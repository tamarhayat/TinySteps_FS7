const express = require('express');
const router = express.Router();
const {
  getAllChildren,
  getChildById,
  getChildrenByParentId,
  addChild,
  updateChild,
  deleteChild
} = require('../controllers/childController');

router.get('/', getAllChildren);
router.get('/parent/:parentId', getChildrenByParentId);
router.get('/:id', getChildById);

router.post('/', addChild);
router.put('/:id', updateChild);
router.delete('/:id', deleteChild);

module.exports = router;
