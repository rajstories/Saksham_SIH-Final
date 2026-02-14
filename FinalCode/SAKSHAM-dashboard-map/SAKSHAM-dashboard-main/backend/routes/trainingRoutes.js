const express = require('express');
const router = express.Router();
const {
  getAllTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  getNearbyTrainings,
} = require('../controllers/trainingController');

// Base routes
router.route('/').get(getAllTrainings).post(createTraining);

// Nearby trainings (must be before /:id)
router.route('/nearby').get(getNearbyTrainings);

// ID-based routes
router.route('/:id').get(getTrainingById).put(updateTraining).delete(deleteTraining);

module.exports = router;