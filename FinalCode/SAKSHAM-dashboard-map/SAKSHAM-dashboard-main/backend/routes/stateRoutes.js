const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');

// Get all states
router.get('/', stateController.getAllStates);

// Resolve state from coordinates
router.get('/resolve', stateController.getStateFromCoordinates);

// Get specific state details
router.get('/:stateSlug', stateController.getStateDetails);

// Get trainings for a state
router.get('/:stateSlug/trainings', stateController.getStateTrainings);

// Get summary for a state
router.get('/:stateSlug/summary', stateController.getStateSummary);

module.exports = router;