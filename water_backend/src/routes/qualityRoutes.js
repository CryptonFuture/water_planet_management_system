const express = require('express');
const {
  getQualityRecords,
  getQualityRecord,
  createQualityRecord,
  getLatestByPlant
} = require('../controllers/qualityController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getQualityRecords)
  .post(authorize('admin', 'manager', 'operator'), createQualityRecord);

router.get('/plant/:plantId/latest', getLatestByPlant);
router.get('/:id', getQualityRecord);

module.exports = router;
