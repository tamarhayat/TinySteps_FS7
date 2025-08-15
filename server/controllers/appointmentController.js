const { mainDB } = require('../db');

// gat all appointments
const getAllAppointments = async (req, res) => {
    try {
        const [rows] = await mainDB.query('SELECT * FROM appointments');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

// get appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const [rows] = await mainDB.query('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Appointment not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
};

// add new appointment
const addAppointment = async (req, res) => {
    const { id, child_id, date, type, notes } = req.body;
    try {
        await mainDB.query(
            'INSERT INTO appointments (id, child_id, date, type, notes) VALUES (?, ?, ?, ?, ?)',
            [id, child_id, date, type, notes]
        );
        res.json({ message: 'Appointment added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add appointment' });
    }
};

// update an appointment
const updateAppointment = async (req, res) => {
    const { child_id, date, type, notes } = req.body;
    try {
        await mainDB.query(
            'UPDATE appointments SET child_id=?, date=?, type=?, notes=? WHERE id=?',
            [child_id, date, type, notes, req.params.id]
        );
        res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};

// delete appointment
const deleteAppointment = async (req, res) => {
    try {
        await mainDB.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    addAppointment,
    updateAppointment,
    deleteAppointment
};
