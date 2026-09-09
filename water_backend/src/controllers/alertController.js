const Alert = require('../models/Alert');

exports.getAlerts = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.resolved === 'false') filter.isResolved = false;
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.plant) filter.plant = req.query.plant;

    const alerts = await Alert.find(filter)
      .populate('plant', 'name code')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .limit(parseInt(req.query.limit) || 50);

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

exports.resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        isResolved: true,
        isRead: true,
        resolvedAt: Date.now(),
        resolvedBy: req.user.id
      },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Alert.countDocuments({ isRead: false, isResolved: false });
    res.json({ success: true, count });
  } catch (error) {
    next(error);
  }
};
