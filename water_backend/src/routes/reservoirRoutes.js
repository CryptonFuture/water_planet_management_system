const express = require('express');
const {
  getReservoirs,
  getReservoir,
  createReservoir,
  updateLevel,
  updateReservoir,
  deleteReservoir
} = require('../controllers/reservoirController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReservoirs)
  .post(authorize('admin', 'manager'), createReservoir);

router.route('/:id')
  .get(getReservoir)
  .put(authorize('admin', 'manager'), updateReservoir)
  .delete(authorize('admin'), deleteReservoir);

router.put('/:id/level', authorize('admin', 'manager', 'operator'), updateLevel);

module.exports = router;
