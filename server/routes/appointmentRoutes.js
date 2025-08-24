const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.get('/available', appointmentController.getAvailableAppointments);

router.get('/nurse/:nurseId', appointmentController.getAppointmentsByNurseId);
router.post('/nurse/:nurseId', appointmentController.addAppointment);
router.get('/child/:childId', appointmentController.getAppointmentsByChildId);

router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.put('/:id/book', appointmentController.updateAppointmentNurse);
router.delete('/:id', appointmentController.deleteAppointment);




module.exports = router;