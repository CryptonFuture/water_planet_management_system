const mongoose = require('mongoose');

const reservoirSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  capacity: {
    type: Number, // in liters or cubic meters
    required: true
  },
  currentLevel: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    enum: ['liters', 'cubic_meters', 'gallons'],
    default: 'cubic_meters'
  },
  type: {
    type: String,
    enum: ['raw_water', 'treated_water', 'distribution', 'storage'],
    default: 'treated_water'
  },
  minLevel: {
    type: Number,
    default: 20 // percentage or absolute
  },
  maxLevel: {
    type: Number,
    default: 95
  },
  status: {
    type: String,
    enum: ['normal', 'low', 'critical', 'overflow', 'maintenance'],
    default: 'normal'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  location: String
}, {
  timestamps: true
});

reservoirSchema.virtual('fillPercentage').get(function () {
  if (!this.capacity || this.capacity === 0) return 0;
  return Math.round((this.currentLevel / this.capacity) * 100);
});

reservoirSchema.set('toJSON', { virtuals: true });
reservoirSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reservoir', reservoirSchema);
