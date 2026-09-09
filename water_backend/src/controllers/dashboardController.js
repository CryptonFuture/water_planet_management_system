const Plant = require('../models/Plant');
const Reservoir = require('../models/Reservoir');
const WaterQuality = require('../models/WaterQuality');
const Chemical = require('../models/Chemical');
const Alert = require('../models/Alert');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalPlants,
      operationalPlants,
      totalReservoirs,
      lowReservoirs,
      recentQuality,
      lowChemicals,
      activeAlerts,
      upcomingMaintenance,
      totalUsers
    ] = await Promise.all([
      Plant.countDocuments(),
      Plant.countDocuments({ status: 'operational' }),
      Reservoir.countDocuments(),
      Reservoir.countDocuments({ status: { $in: ['low', 'critical'] } }),
      WaterQuality.find().sort('-recordedAt').limit(5).populate('plant', 'name'),
      Chemical.countDocuments({ status: { $in: ['low', 'out_of_stock'] } }),
      Alert.countDocuments({ isResolved: false }),
      Maintenance.countDocuments({ status: { $in: ['scheduled', 'in_progress'] } }),
      User.countDocuments({ isActive: true })
    ]);

    const plantsByStatus = await Plant.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const qualityByStatus = await WaterQuality.aggregate([
      { $sort: { recordedAt: -1 } },
      { $group: { _id: '$plant', latestStatus: { $first: '$status' } } },
      { $group: { _id: '$latestStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalPlants,
          operationalPlants,
          totalReservoirs,
          lowReservoirs,
          lowChemicals,
          activeAlerts,
          upcomingMaintenance,
          totalUsers
        },
        plantsByStatus,
        qualityByStatus,
        recentQuality
      }
    });
  } catch (error) {
    next(error);
  }
};
