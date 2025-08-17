const { mainDB } = require('../db');

// get all the children
const getAllChildren = async (req, res) => {
    try {
        const [rows] = await mainDB.query('SELECT * FROM children');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch children' });
    }
};

// get child by ID
const getChildById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await mainDB.query('SELECT * FROM children WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Child not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch child' });
    }
};

//  get children by parent ID
const getChildrenByParentId = async (req, res) => {
    const { parentId } = req.params;
    try {
        const [rows] = await mainDB.query('SELECT * FROM children WHERE parent_id = ?', [parentId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No children found for this parent' });
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch children by parent ID' });
    }
};

// add new child
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

// update a child
const updateChild = async (req, res) => {
    const { id } = req.params;
    const { name, birth_date, parent_id } = req.body;
    try {
        const [result] = await mainDB.query(
            'UPDATE children SET name = ?, birth_date = ?, parent_id = ? WHERE id = ?',
            [name, birth_date, parent_id, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Child not found' });
        }
        res.json({ message: 'Child updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update child' });
    }
};

// delete a child
const deleteChild = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await mainDB.query('DELETE FROM children WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Child not found' });
        }
        res.json({ message: 'Child deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete child' });
    }
};

module.exports = {
    getAllChildren,
    getChildById,
    getChildrenByParentId,
    addChild,
    updateChild,
    deleteChild
};
