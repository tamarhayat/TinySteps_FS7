const express = require('express');
const router = express.Router();
const {
    getAllMeasurements,
    getMeasurementById,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement
} = require('../controllers/measurementController');

router.get('/', getAllMeasurements);
router.get('/:id', getMeasurementById);
router.post('/', addMeasurement);
router.put('/:id', updateMeasurement);
router.delete('/:id', deleteMeasurement);

module.exports = router;
