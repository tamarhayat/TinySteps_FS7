const { mainDB } = require('../db');

// get all files
const getAllFiles = async (req, res) => {
    try {
        const [rows] = await mainDB.query('SELECT * FROM files');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

// get file by ID
const getFileById = async (req, res) => {
    try {
        const [rows] = await mainDB.query('SELECT * FROM files WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'File not found' });
        res.json(rows[0]);
    } catch (err) {        
        res.status(500).json({ error: 'Failed to fetch file' });
    }
};

// add a new file
const addFile = async (req, res) => {
    const { id, child_id, file_name, file_path, uploaded_at } = req.body;
    try {
        await mainDB.query(
            'INSERT INTO files (id, child_id, file_name, file_path, uploaded_at) VALUES (?, ?, ?, ?, ?)',
            [id, child_id, file_name, file_path, uploaded_at]
        );
        res.json({ message: 'File added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add file' });
    }
};

// update file
const updateFile = async (req, res) => {
    const { child_id, file_name, file_path, uploaded_at } = req.body;
    try {
        await mainDB.query(
            'UPDATE files SET child_id=?, file_name=?, file_path=?, uploaded_at=? WHERE id=?',
            [child_id, file_name, file_path, uploaded_at, req.params.id]
        );
        res.json({ message: 'File updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update file' });
    }
};

// delete file
const deleteFile = async (req, res) => {
    try {
        await mainDB.query('DELETE FROM files WHERE id = ?', [req.params.id]);
        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

module.exports = {
    getAllFiles,
    getFileById,
    addFile,
    updateFile,
    deleteFile
};
