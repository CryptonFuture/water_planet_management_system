const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['quality', 'level', 'maintenance', 'inventory', 'system', 'security'],
    default: 'system'
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical', 'emergency'],
    default: 'info'
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  relatedTo: {
    model: String, // e.g. 'Reservoir', 'WaterQuality'
    id: mongoose.Schema.Types.ObjectId
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

alertSchema.index({ isResolved: 1, severity: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
