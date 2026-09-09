const Plant = require('../models/Plant');

exports.getPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find().populate('manager', 'name email').sort('-createdAt');
    res.json({ success: true, count: plants.length, data: plants });
  } catch (error) {
    next(error);
  }
};

exports.getPlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id).populate('manager', 'name email phone');
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }
    res.json({ success: true, data: plant });
  } catch (error) {
    next(error);
  }
};

exports.createPlant = async (req, res, next) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json({ success: true, data: plant });
  } catch (error) {
    next(error);
  }
};

exports.updatePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }
    res.json({ success: true, data: plant });
  } catch (error) {
    next(error);
  }
};

exports.deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }
    res.json({ success: true, message: 'Plant deleted' });
  } catch (error) {
    next(error);
  }
};
