const Maintenance = require('../models/Maintenance');

exports.getMaintenances = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.plant) filter.plant = req.query.plant;
    if (req.query.status) filter.status = req.query.status;

    const items = await Maintenance.find(filter)
      .populate('plant', 'name code')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort('scheduledDate');

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

exports.createMaintenance = async (req, res, next) => {
  try {
    const item = await Maintenance.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.updateMaintenance = async (req, res, next) => {
  try {
    if (req.body.status === 'completed' && !req.body.completedDate) {
      req.body.completedDate = Date.now();
    }
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.deleteMaintenance = async (req, res, next) => {
  try {
    const item = await Maintenance.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};
