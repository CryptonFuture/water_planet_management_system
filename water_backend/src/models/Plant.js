const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  capacity: {
    type: Number, // in MLD (Million Liters per Day)
    required: true
  },
  currentProduction: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['operational', 'maintenance', 'offline', 'under_construction'],
    default: 'operational'
  },
  plantType: {
    type: String,
    enum: ['treatment', 'distribution', 'desalination', 'wastewater', 'combined'],
    default: 'treatment'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  establishedDate: Date,
  contactPhone: String,
  contactEmail: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Plant', plantSchema);
