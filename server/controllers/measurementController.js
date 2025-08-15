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

const addMeasurement = async (req, res) => {
    const { id, child_id, date, weight, height } = req.body;
    try {
        await mainDB.query(
            'INSERT INTO measurements (id, child_id, date, weight, height) VALUES (?, ?, ?, ?, ?)',
            [id, child_id, date, weight, height]
        );
        res.json({ message: 'Measurement added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add measurement' });
    }
};

const updateMeasurement = async (req, res) => {
    const { id } = req.params;
    const { child_id, date, weight, height } = req.body;
    try {
        const [result] = await mainDB.query(
            'UPDATE measurements SET child_id = ?, date = ?, weight = ?, height = ? WHERE id = ?',
            [child_id, date, weight, height, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Measurement not found' });
        }
        res.json({ message: 'Measurement updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update measurement' });
    }
};

const deleteMeasurement = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await mainDB.query('DELETE FROM measurements WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Measurement not found' });
        }
        res.json({ message: 'Measurement deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete measurement' });
    }
};

module.exports = {
    getAllMeasurements,
    getMeasurementById,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement
};
