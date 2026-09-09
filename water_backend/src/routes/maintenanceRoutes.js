const express = require('express');
const {
  getMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMaintenances)
  .post(authorize('admin', 'manager'), createMaintenance);

router.route('/:id')
  .put(authorize('admin', 'manager', 'operator'), updateMaintenance)
  .delete(authorize('admin'), deleteMaintenance);

module.exports = router;
