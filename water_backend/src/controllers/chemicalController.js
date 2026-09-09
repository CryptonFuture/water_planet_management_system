const Chemical = require('../models/Chemical');
const Alert = require('../models/Alert');

exports.getChemicals = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.plant) filter.plant = req.query.plant;
    if (req.query.status) filter.status = req.query.status;

    const chemicals = await Chemical.find(filter).populate('plant', 'name code').sort('name');
    res.json({ success: true, count: chemicals.length, data: chemicals });
  } catch (error) {
    next(error);
  }
};

exports.createChemical = async (req, res, next) => {
  try {
    const chemical = await Chemical.create(req.body);
    res.status(201).json({ success: true, data: chemical });
  } catch (error) {
    next(error);
  }
};

exports.updateChemical = async (req, res, next) => {
  try {
    const chemical = await Chemical.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found' });
    }

    if (chemical.quantity <= chemical.minStock) {
      chemical.status = chemical.quantity === 0 ? 'out_of_stock' : 'low';
      await chemical.save();
      await Alert.create({
        title: `Chemical Stock ${chemical.status.toUpperCase()}`,
        message: `${chemical.name} stock is low/out (${chemical.quantity} ${chemical.unit})`,
        type: 'inventory',
        severity: chemical.status === 'out_of_stock' ? 'critical' : 'warning',
        plant: chemical.plant,
        relatedTo: { model: 'Chemical', id: chemical._id }
      });
    }

    res.json({ success: true, data: chemical });
  } catch (error) {
    next(error);
  }
};

exports.deleteChemical = async (req, res, next) => {
  try {
    const chemical = await Chemical.findByIdAndDelete(req.params.id);
    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found' });
    }
    res.json({ success: true, message: 'Chemical deleted' });
  } catch (error) {
    next(error);
  }
};
