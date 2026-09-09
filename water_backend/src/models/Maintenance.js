const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  equipment: String,
  type: {
    type: String,
    enum: ['preventive', 'corrective', 'emergency', 'inspection'],
    default: 'preventive'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue'],
    default: 'scheduled'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedHours: Number,
  actualHours: Number,
  cost: Number,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
