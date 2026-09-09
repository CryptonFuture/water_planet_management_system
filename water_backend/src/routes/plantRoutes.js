const express = require('express');
const {
  getPlants,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant
} = require('../controllers/plantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPlants)
  .post(authorize('admin', 'manager'), createPlant);

router.route('/:id')
  .get(getPlant)
  .put(authorize('admin', 'manager'), updatePlant)
  .delete(authorize('admin'), deletePlant);

module.exports = router;
