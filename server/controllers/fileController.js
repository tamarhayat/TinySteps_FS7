const { mainDB } = require('../db');

// get all files
const getAllFiles = async (req, res) => {
  try {
    const [rows] = await mainDB.query('SELECT * FROM files');
    res.json(rows);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};

// get files by child ID
const getFilesByChildId = async (req, res) => {
  const { childId } = req.params;
  try {
    const [rows] = await mainDB.query('SELECT * FROM files WHERE child_id = ?', [childId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch files for this child' });
  }
};

// add a new file (with multer)
const addFile = async (req, res) => {
  const { child_id, description, uploaded_by } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file_path = `/uploadFiles/${req.file.filename}`;
  const upload_date = new Date();

  try {
    const [result] = await mainDB.query(
      'INSERT INTO files (child_id, file_path, description, uploaded_by, upload_date) VALUES (?, ?, ?, ?, ?)',
      [child_id, file_path, description, uploaded_by, upload_date]
    );

    res.json({
      message: 'File added successfully',
      file: {
        id: result.insertId,
        child_id,
        description,
        uploaded_by,
        file_path,
        upload_date
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add file' });
  }
};

// update file
const updateFile = async (req, res) => {
  const { child_id, description, file_path } = req.body;
  try {
    const [result] = await mainDB.query(
      'UPDATE files SET child_id=?, description=?, file_path=? WHERE id=?',
      [child_id, description, file_path, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'File not found' });
    res.json({ message: 'File updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update file' });
  }
};

// delete file
const deleteFile = async (req, res) => {
  try {
    const [result] = await mainDB.query('DELETE FROM files WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'File not found' });
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

module.exports = {
  getAllFiles,
  getFileById,
  getFilesByChildId,
  addFile,
  updateFile,
  deleteFile
};
