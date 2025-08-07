const { userDB } = require('../db');

const login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const [rows] = await userDB.query('SELECT * FROM users WHERE id = ?', [id]);
        if (!rows.length) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = rows[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const register = async (req, res) => {
    const { id, password, role } = req.body;

    try {
        await userDB.query(
            'INSERT INTO users (id, password, role) VALUES (?, ?, ?)',
            [id, password, role]
        );
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Could not register user' });
    }
};

module.exports = { login, register };
