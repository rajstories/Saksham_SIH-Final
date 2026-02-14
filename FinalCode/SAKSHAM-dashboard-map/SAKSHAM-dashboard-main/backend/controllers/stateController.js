const Training = require('../models/Training');
const State = require('../models/State');

// Get state details by slug
exports.getStateDetails = async (req, res) => {
  try {
    const { stateSlug } = req.params;
    
    const state = await State.findOne({ slug: stateSlug.toLowerCase() });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: `State '${stateSlug}' not found. Please check the state name and try again.`
      });
    }
    
    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    console.error('Error fetching state details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch state details',
      error: error.message
    });
  }
};

// Get trainings for a specific state with filters
exports.getStateTrainings = async (req, res) => {
  try {
    const { stateSlug } = req.params;
    const { status, type, startDate, endDate, page = 1, limit = 100 } = req.query;
    
    // Find state
    const state = await State.findOne({ slug: stateSlug.toLowerCase() });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: `State '${stateSlug}' not found.`
      });
    }
    
    // Build query
    let query = {};
    
    // First try to match by state field (if populated)
    const stateMatches = [
      state.name,
      state.slug,
      state.code,
      state.name.toLowerCase(),
      state.code.toLowerCase()
    ];
    
    // Geospatial query for trainings within state polygon
    query.$or = [
      { 'address.state': { $in: stateMatches } },
      { state: { $in: stateMatches } },
      {
        location: {
          $geoWithin: {
            $geometry: state.geometry
          }
        }
      }
    ];
    
    // Apply filters
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const trainings = await Training.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Training.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        trainings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        },
        state: {
          name: state.name,
          slug: state.slug,
          code: state.code
        }
      }
    });
  } catch (error) {
    console.error('Error fetching state trainings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trainings',
      error: error.message
    });
  }
};

// Get summary statistics for a state
exports.getStateSummary = async (req, res) => {
  try {
    const { stateSlug } = req.params;
    
    // Find state
    const state = await State.findOne({ slug: stateSlug.toLowerCase() });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: `State '${stateSlug}' not found.`
      });
    }
    
    const stateMatches = [
      state.name,
      state.slug,
      state.code,
      state.name.toLowerCase(),
      state.code.toLowerCase()
    ];
    
    // Build base query
    const baseQuery = {
      $or: [
        { 'address.state': { $in: stateMatches } },
        { state: { $in: stateMatches } },
        {
          location: {
            $geoWithin: {
              $geometry: state.geometry
            }
          }
        }
      ]
    };
    
    // Aggregate statistics
    const summary = await Training.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalParticipants: { $sum: '$participants' }
        }
      }
    ]);
    
    // Get training types distribution
    const typeDistribution = await Training.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format response
    const statusCounts = {
      completed: 0,
      active: 0,
      planned: 0,
      scheduled: 0,
      cancelled: 0
    };
    
    let totalParticipants = 0;
    
    summary.forEach(item => {
      const status = item._id ? item._id.toLowerCase() : 'unknown';
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status] = item.count;
      }
      totalParticipants += item.totalParticipants || 0;
    });
    
    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    
    res.json({
      success: true,
      data: {
        state: {
          name: state.name,
          slug: state.slug,
          code: state.code
        },
        summary: {
          total,
          ...statusCounts,
          totalParticipants
        },
        typeDistribution: typeDistribution.map(t => ({
          type: t._id,
          count: t.count
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching state summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary',
      error: error.message
    });
  }
};

// Resolve state from coordinates (for trainings without state field)
exports.getStateFromCoordinates = async (req, res) => {
  try {
    const { lng, lat } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }
    
    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);
    
    if (isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }
    
    // Find state containing this point
    const state = await State.findOne({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      }
    });
    
    if (!state) {
      // Fallback: find nearest state
      const nearestState = await State.findOne({
        center: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: 200000 // 200km radius
          }
        }
      });
      
      if (nearestState) {
        return res.json({
          success: true,
          data: nearestState,
          fallback: true,
          message: 'Point not in any state polygon, showing nearest state'
        });
      }
      
      return res.status(404).json({
        success: false,
        message: 'No state found for these coordinates'
      });
    }
    
    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    console.error('Error resolving state from coordinates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve state',
      error: error.message
    });
  }
};

// Get all states (for dropdown or list)
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find()
      .select('name slug code center')
      .sort({ name: 1 })
      .lean();
    
    res.json({
      success: true,
      data: states
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch states',
      error: error.message
    });
  }
};