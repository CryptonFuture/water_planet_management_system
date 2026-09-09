const express = require('express');
const {
  getAlerts,
  markAsRead,
  resolveAlert,
  getUnreadCount
} = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/:id/resolve', resolveAlert);

module.exports = router;
