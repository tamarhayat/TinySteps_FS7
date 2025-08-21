const { mainDB } = require('../db');

// get all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await mainDB.query('SELECT id, first_name, last_name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// get users by role
const getUsersByRole = async (req, res) => {
  const { role } = req.params; 
  try {
    const [rows] = await mainDB.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE role = ?',
      [role]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: `No users found with role: ${role}` });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users by role' });
  }
};


// get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await mainDB.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// create new user
const addUser = async (req, res) => {
  const { id, first_name, last_name, email, role, password } = req.body;
  try {
    // בדיקה אם המשתמש קיים
    const [existing] = await mainDB.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User with this ID already exists' });
    }

    await userDB.query(
      'INSERT INTO users (id, first_name, last_name, email, role, password) VALUES (?, ?, ?, ?, ?, ?)',
      [id, first_name, last_name, email, role, password]
    );

    res.json({ message: 'User added successfully', user: { id, first_name, last_name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user' });
  }
};

// update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, role, password } = req.body;
  try {
    const [result] = await mainDB.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ?, password = ? WHERE id = ?',
      [first_name, last_name, email, role, password, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await mainDB.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  getUsersByRole,
  getUserById,
  addUser,
  updateUser,
  deleteUser
};
