const Training = require('../models/Training');

// @desc    Get all trainings
// @route   GET /api/trainings
// @access  Public
exports.getAllTrainings = async (req, res) => {
  try {
    const { status, type, startDate, endDate } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      if (!['active', 'scheduled', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value',
        });
      }
      filter.status = status;
    }

    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const trainings = await Training.find(filter).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: trainings.length,
      data: trainings,
    });
  } catch (error) {
    console.error('Error in getAllTrainings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trainings',
      error: error.message,
    });
  }
};

// @desc    Get single training by ID
// @route   GET /api/trainings/:id
// @access  Public
exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found',
      });
    }

    res.status(200).json({
      success: true,
      data: training,
    });
  } catch (error) {
    console.error('Error in getTrainingById:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid training ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new training
// @route   POST /api/trainings
// @access  Public
exports.createTraining = async (req, res) => {
  try {
    const {
      name,
      type,
      status,
      location,
      address,
      participants,
      startDate,
      endDate,
      instructor,
      description,
      resources,
    } = req.body;

    // Validate required fields
    if (!name || !type || !location || !participants || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate coordinates format
    if (!location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location coordinates',
      });
    }

    const training = await Training.create({
      name,
      type,
      status: status || 'scheduled',
      location,
      address,
      participants,
      startDate,
      endDate,
      instructor,
      description,
      resources,
    });

    res.status(201).json({
      success: true,
      message: 'Training created successfully',
      data: training,
    });
  } catch (error) {
    console.error('Error in createTraining:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating training',
      error: error.message,
    });
  }
};

// @desc    Update training
// @route   PUT /api/trainings/:id
// @access  Public
exports.updateTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Training updated successfully',
      data: training,
    });
  } catch (error) {
    console.error('Error in updateTraining:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid training ID',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete training
// @route   DELETE /api/trainings/:id
// @access  Public
exports.deleteTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Training deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteTraining:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid training ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get trainings near a location
// @route   GET /api/trainings/nearby
// @access  Public
exports.getNearbyTrainings = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude',
      });
    }

    const trainings = await Training.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance), // in meters
        },
      },
    });

    res.status(200).json({
      success: true,
      count: trainings.length,
      data: trainings,
    });
  } catch (error) {
    console.error('Error in getNearbyTrainings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};