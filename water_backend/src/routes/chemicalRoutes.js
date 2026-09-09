const express = require('express');
const {
  getChemicals,
  createChemical,
  updateChemical,
  deleteChemical
} = require('../controllers/chemicalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getChemicals)
  .post(authorize('admin', 'manager'), createChemical);

router.route('/:id')
  .put(authorize('admin', 'manager', 'operator'), updateChemical)
  .delete(authorize('admin'), deleteChemical);

module.exports = router;
