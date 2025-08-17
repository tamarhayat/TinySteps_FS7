const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// CRUD routes
router.get('/', getAllUsers);            // Read all users
router.get('/:id', getUserById);         // Read user by ID
router.post('/', addUser);               // Create new user
router.put('/:id', updateUser);          // Update user
router.delete('/:id', deleteUser);       // Delete user

module.exports = router;
