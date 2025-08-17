const { mainDB } = require('../db');

// get all appointments
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

// get appointments by child ID
const getAppointmentsByChildId = async (req, res) => {
  const { childId } = req.params;
  try {
    const [rows] = await mainDB.query('SELECT * FROM appointments WHERE child_id = ?', [childId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments for this child' });
  }
};

// get available appointments
const getAvailableAppointments = async (req, res) => {
  try {
    const [rows] = await mainDB.query('SELECT * FROM appointments WHERE status = "available" ORDER BY appointment_time ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch available appointments' });
  }
};

// add new appointment (יצירת תור חדש)
const addAppointment = async (req, res) => {
  const { date, type, notes, nurse_name } = req.body;
  try {
    const [result] = await mainDB.query(
      'INSERT INTO appointments (date, type, notes, nurse_name, status) VALUES (?, ?, ?, ?, "available")',
      [date, type, notes, nurse_name]
    );
    res.json({ message: 'Appointment created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add appointment' });
  }
};

// update an appointment (כולל הזמנת תור)
const updateAppointment = async (req, res) => {
  const { child_id, date, type, notes } = req.body;

  try {
    if (child_id) {
      // אם child_id נשלח – מדובר בהזמנת תור קיים
      const [result] = await mainDB.query(
        'UPDATE appointments SET child_id=?, status="booked" WHERE id=? AND status="available"',
        [child_id, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(400).json({ error: 'Appointment not available' });
      return res.json({ message: 'Appointment booked successfully' });
    } else {
      // אחרת – עדכון רגיל של פרטי תור
      await mainDB.query(
        'UPDATE appointments SET date=?, type=?, notes=? WHERE id=?',
        [date, type, notes, req.params.id]
      );
      res.json({ message: 'Appointment updated successfully' });
    }
  } catch (err) {
    console.error(err);
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
  getAppointmentsByChildId,
  getAvailableAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment
};
