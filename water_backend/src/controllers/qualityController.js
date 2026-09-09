const WaterQuality = require('../models/WaterQuality');
const Alert = require('../models/Alert');

const determineStatus = (params) => {
  let score = 0;
  if (params.ph >= 6.5 && params.ph <= 8.5) score += 2;
  else if (params.ph >= 6 && params.ph <= 9) score += 1;
  if (params.turbidity !== undefined && params.turbidity <= 5) score += 2;
  else if (params.turbidity <= 10) score += 1;
  if (params.chlorine !== undefined && params.chlorine >= 0.2 && params.chlorine <= 1) score += 2;
  if (params.tds !== undefined && params.tds <= 500) score += 2;
  else if (params.tds <= 1000) score += 1;

  if (score >= 7) return 'excellent';
  if (score >= 5) return 'good';
  if (score >= 3) return 'acceptable';
  if (score >= 1) return 'poor';
  return 'critical';
};

exports.getQualityRecords = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.plant) filter.plant = req.query.plant;
    if (req.query.status) filter.status = req.query.status;

    const records = await WaterQuality.find(filter)
      .populate('plant', 'name code')
      .populate('recordedBy', 'name')
      .sort('-recordedAt')
      .limit(parseInt(req.query.limit) || 50);

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

exports.getQualityRecord = async (req, res, next) => {
  try {
    const record = await WaterQuality.findById(req.params.id)
      .populate('plant', 'name code location')
      .populate('recordedBy', 'name email');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

exports.createQualityRecord = async (req, res, next) => {
  try {
    const status = determineStatus(req.body.parameters || {});
    const record = await WaterQuality.create({
      ...req.body,
      status,
      recordedBy: req.user.id
    });

    // Auto-create alert for poor/critical
    if (status === 'poor' || status === 'critical') {
      await Alert.create({
        title: `Water Quality ${status.toUpperCase()}`,
        message: `Water quality at plant is ${status}. Immediate attention required.`,
        type: 'quality',
        severity: status === 'critical' ? 'critical' : 'warning',
        plant: record.plant,
        relatedTo: { model: 'WaterQuality', id: record._id },
        createdBy: req.user.id
      });
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

exports.getLatestByPlant = async (req, res, next) => {
  try {
    const record = await WaterQuality.findOne({ plant: req.params.plantId })
      .sort('-recordedAt')
      .populate('plant', 'name code');
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};
