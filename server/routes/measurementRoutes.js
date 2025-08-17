const express = require('express');
const router = express.Router();
const {
    getAllMeasurements,
    getMeasurementById,
    getMeasurementsByChildId,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement
} = require('../controllers/measurementController');

router.get('/', getAllMeasurements);
router.get('/:id', getMeasurementById);
router.get('/child/:childId', getMeasurementsByChildId);
router.post('/', addMeasurement);
router.put('/:id', updateMeasurement);
router.delete('/:id', deleteMeasurement);

module.exports = router;
