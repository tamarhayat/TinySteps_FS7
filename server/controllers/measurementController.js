const { mainDB } = require('../db');

const getAllMeasurements = async (req, res) => {
  try {
    const [rows] = await mainDB.query('SELECT * FROM measurements');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
};

const getMeasurementById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await mainDB.query('SELECT * FROM measurements WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch measurement' });
  }
};
// get measurements by child ID
const getMeasurementsByChildId = async (req, res) => {
  const { childId } = req.params;
  try {
    const [rows] = await mainDB.query('SELECT * FROM measurements WHERE child_id = ?', [childId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch measurements for this child' });
  }
};


const addMeasurement = async (req, res) => {
  const { child_id, date, weight_kg, height_cm } = req.body;
  try {
    const [result] = await mainDB.query(
      'INSERT INTO measurements (child_id, date, weight_kg, height_cm) VALUES (?, ?, ?, ?)',
      [child_id, date, weight_kg, height_cm]
    );
    
    const [newRecord] = await mainDB.query(
      'SELECT * FROM measurements WHERE id = ?',
      [result.insertId]
    );

    res.json({
      message: 'Measurement added successfully',
      measurement: newRecord[0]
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add measurement' });
  }
};

const updateMeasurement = async (req, res) => {
  const { id } = req.params;
  const { weight_kg, height_cm } = req.body;

  try {
    const [result] = await mainDB.query(
      "UPDATE measurements SET weight_kg = ?, height_cm = ? WHERE id = ?",
      [weight_kg, height_cm, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Measurement not found" });
    }

    const [updatedRecord] = await mainDB.query(
      'SELECT * FROM measurements WHERE id = ?',
      [id]
    );

    res.json({
      message: "Measurement updated successfully",
      measurement: updatedRecord[0],
    });
  } catch (err) {
    console.error('Update measurement error:', err);
    res.status(500).json({ error: "Failed to update measurement" });
  }
};

const deleteMeasurement = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await mainDB.query(
      "DELETE FROM measurements WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Measurement not found" });
    }
    res.json({ message: "Measurement deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete measurement" });
  }
};

module.exports = {
  getAllMeasurements,
  getMeasurementById,
  getMeasurementsByChildId,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement
};
