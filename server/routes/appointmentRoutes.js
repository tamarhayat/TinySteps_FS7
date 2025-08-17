const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.get('/available', appointmentController.getAvailableAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.get('/child/:childId', appointmentController.getAppointmentsByChildId);
router.post('/', appointmentController.addAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);




module.exports = router;
