const express = require('express');
const router = express.Router();
const { getAllChildren, addChild } = require('../controllers/childController');

router.get('/', getAllChildren);
router.post('/', addChild);

module.exports = router;
