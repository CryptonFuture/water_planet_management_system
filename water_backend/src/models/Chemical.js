const mongoose = require('mongoose');

const chemicalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  category: {
    type: String,
    enum: ['coagulant', 'disinfectant', 'pH_adjuster', 'flocculant', 'other'],
    default: 'other'
  },
  quantity: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'liters', 'tons', 'bags'],
    default: 'kg'
  },
  minStock: {
    type: Number,
    default: 100
  },
  supplier: String,
  lastRestocked: Date,
  expiryDate: Date,
  unitCost: Number,
  status: {
    type: String,
    enum: ['available', 'low', 'out_of_stock', 'expired'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chemical', chemicalSchema);
