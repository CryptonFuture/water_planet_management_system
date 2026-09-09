const Reservoir = require('../models/Reservoir');
const Alert = require('../models/Alert');

exports.getReservoirs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.plant) filter.plant = req.query.plant;

    const reservoirs = await Reservoir.find(filter)
      .populate('plant', 'name code')
      .sort('name');

    res.json({ success: true, count: reservoirs.length, data: reservoirs });
  } catch (error) {
    next(error);
  }
};

exports.getReservoir = async (req, res, next) => {
  try {
    const reservoir = await Reservoir.findById(req.params.id).populate('plant', 'name code');
    if (!reservoir) {
      return res.status(404).json({ success: false, message: 'Reservoir not found' });
    }
    res.json({ success: true, data: reservoir });
  } catch (error) {
    next(error);
  }
};

exports.createReservoir = async (req, res, next) => {
  try {
    const reservoir = await Reservoir.create(req.body);
    res.status(201).json({ success: true, data: reservoir });
  } catch (error) {
    next(error);
  }
};

exports.updateLevel = async (req, res, next) => {
  try {
    const { currentLevel } = req.body;
    const reservoir = await Reservoir.findById(req.params.id);
    if (!reservoir) {
      return res.status(404).json({ success: false, message: 'Reservoir not found' });
    }

    reservoir.currentLevel = currentLevel;
    reservoir.lastUpdated = Date.now();

    const percentage = (currentLevel / reservoir.capacity) * 100;
    if (percentage < reservoir.minLevel) {
      reservoir.status = percentage < 10 ? 'critical' : 'low';
    } else if (percentage > reservoir.maxLevel) {
      reservoir.status = 'overflow';
    } else {
      reservoir.status = 'normal';
    }

    await reservoir.save();

    if (reservoir.status === 'low' || reservoir.status === 'critical') {
      await Alert.create({
        title: `Reservoir Level ${reservoir.status.toUpperCase()}`,
        message: `${reservoir.name} is at ${Math.round(percentage)}% capacity.`,
        type: 'level',
        severity: reservoir.status === 'critical' ? 'critical' : 'warning',
        plant: reservoir.plant,
        relatedTo: { model: 'Reservoir', id: reservoir._id },
        createdBy: req.user?.id
      });
    }

    res.json({ success: true, data: reservoir });
  } catch (error) {
    next(error);
  }
};

exports.updateReservoir = async (req, res, next) => {
  try {
    const reservoir = await Reservoir.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!reservoir) {
      return res.status(404).json({ success: false, message: 'Reservoir not found' });
    }
    res.json({ success: true, data: reservoir });
  } catch (error) {
    next(error);
  }
};

exports.deleteReservoir = async (req, res, next) => {
  try {
    const reservoir = await Reservoir.findByIdAndDelete(req.params.id);
    if (!reservoir) {
      return res.status(404).json({ success: false, message: 'Reservoir not found' });
    }
    res.json({ success: true, message: 'Reservoir deleted' });
  } catch (error) {
    next(error);
  }
};
