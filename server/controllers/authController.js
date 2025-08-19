const { userDB, mainDB } = require('../db');

const login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const [authRows] = await userDB.query('SELECT * FROM user_auth WHERE id = ?', [id]);
    if (!authRows.length) {
      return res.status(401).json({ error: 'User not found' });
    }

    const auth = authRows[0];
    if (auth.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const [userRows] = await mainDB.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
      [id]
    );
    if (!userRows.length) {
      return res.status(404).json({ error: 'User details not found' });
    }

    const user = userRows[0];
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const register = async (req, res) => {
  const { id, first_name, last_name, email, password, role } = req.body;

  try {
    const [existing] = await userDB.query('SELECT id FROM user_auth WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User with this ID already exists' });
    }

    // put the auth details in the user_auth
    await userDB.query('INSERT INTO user_auth (id, password) VALUES (?, ?)', [id, password]);

    // put the other user details un the main DB
    await mainDB.query(
      'INSERT INTO users (id, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?)',
      [id, first_name, last_name, email, role]
    );

    const user = { id, first_name, last_name, email, role };
    res.json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not register user' });
  }
};

module.exports = { login, register };
