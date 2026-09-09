const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema({
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  },
  parameters: {
    ph: { type: Number, min: 0, max: 14 },
    turbidity: { type: Number }, // NTU
    dissolvedOxygen: { type: Number }, // mg/L
    chlorine: { type: Number }, // mg/L
    hardness: { type: Number }, // mg/L as CaCO3
    tds: { type: Number }, // Total Dissolved Solids mg/L
    temperature: { type: Number }, // Celsius
    conductivity: { type: Number }, // µS/cm
    coliform: { type: Number }, // CFU/100ml
    residualChlorine: { type: Number }
  },
  status: {
    type: String,
    enum: ['excellent', 'good', 'acceptable', 'poor', 'critical'],
    default: 'good'
  },
  remarks: String,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  source: {
    type: String,
    enum: ['manual', 'sensor', 'lab'],
    default: 'manual'
  }
}, {
  timestamps: true
});

waterQualitySchema.index({ plant: 1, recordedAt: -1 });

module.exports = mongoose.model('WaterQuality', waterQualitySchema);
