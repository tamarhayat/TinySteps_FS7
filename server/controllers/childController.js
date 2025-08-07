const { mainDB } = require('../db');

const getAllChildren = async (req, res) => {
    try {
        const [rows] = await mainDB.query('SELECT * FROM children');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch children' });
    }
};

const addChild = async (req, res) => {
    const { id, name, birth_date, parent_id } = req.body;

    try {
        await mainDB.query(
            'INSERT INTO children (id, name, birth_date, parent_id) VALUES (?, ?, ?, ?)',
            [id, name, birth_date, parent_id]
        );
        res.json({ message: 'Child added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add child' });
    }
};

module.exports = { getAllChildren, addChild };
