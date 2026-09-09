const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Plant = require('./models/Plant');
const Reservoir = require('./models/Reservoir');
const WaterQuality = require('./models/WaterQuality');
const Chemical = require('./models/Chemical');
const Alert = require('./models/Alert');
const Maintenance = require('./models/Maintenance');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/water_plant_db');
    console.log('Connected to MongoDB');

    // Clear existing
    await Promise.all([
      User.deleteMany(),
      Plant.deleteMany(),
      Reservoir.deleteMany(),
      WaterQuality.deleteMany(),
      Chemical.deleteMany(),
      Alert.deleteMany(),
      Maintenance.deleteMany()
    ]);
    console.log('Cleared existing data');

    // Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@waterplant.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543210'
    });

    const manager = await User.create({
      name: 'Rajesh Kumar',
      email: 'manager@waterplant.com',
      password: 'manager123',
      role: 'manager',
      phone: '+91-9876543211'
    });

    const operator = await User.create({
      name: 'Priya Sharma',
      email: 'operator@waterplant.com',
      password: 'operator123',
      role: 'operator',
      phone: '+91-9876543212'
    });

    console.log('Users created');

    // Plants
    const plant1 = await Plant.create({
      name: 'Yamuna Water Treatment Plant',
      code: 'YWTP-01',
      location: {
        address: 'Okhla, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        coordinates: { lat: 28.5355, lng: 77.2910 }
      },
      capacity: 150,
      currentProduction: 132,
      status: 'operational',
      plantType: 'treatment',
      manager: manager._id,
      description: 'Major water treatment plant serving South Delhi',
      establishedDate: new Date('2005-06-15'),
      contactPhone: '+91-11-23456789',
      contactEmail: 'ywtp@waterplant.com'
    });

    const plant2 = await Plant.create({
      name: 'Ganga Jal Shakti Plant',
      code: 'GJSP-02',
      location: {
        address: 'Haridwar Road',
        city: 'Haridwar',
        state: 'Uttarakhand',
        country: 'India',
        coordinates: { lat: 29.9457, lng: 78.1642 }
      },
      capacity: 80,
      currentProduction: 75,
      status: 'operational',
      plantType: 'treatment',
      manager: manager._id,
      description: 'Treatment plant on Ganga river',
      establishedDate: new Date('2012-03-20')
    });

    const plant3 = await Plant.create({
      name: 'Desalination Unit Mumbai',
      code: 'DUM-03',
      location: {
        address: 'Coastal Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      },
      capacity: 50,
      currentProduction: 0,
      status: 'maintenance',
      plantType: 'desalination',
      description: 'Sea water desalination plant'
    });

    console.log('Plants created');

    // Reservoirs
    await Reservoir.create([
      {
        name: 'Clear Water Tank A',
        plant: plant1._id,
        capacity: 50000,
        currentLevel: 42000,
        unit: 'cubic_meters',
        type: 'treated_water',
        status: 'normal'
      },
      {
        name: 'Raw Water Reservoir',
        plant: plant1._id,
        capacity: 100000,
        currentLevel: 65000,
        unit: 'cubic_meters',
        type: 'raw_water',
        status: 'normal'
      },
      {
        name: 'Distribution Tank B',
        plant: plant1._id,
        capacity: 30000,
        currentLevel: 5500,
        unit: 'cubic_meters',
        type: 'distribution',
        status: 'low',
        minLevel: 20
      },
      {
        name: 'Main Storage',
        plant: plant2._id,
        capacity: 40000,
        currentLevel: 38000,
        unit: 'cubic_meters',
        type: 'treated_water',
        status: 'normal'
      }
    ]);

    console.log('Reservoirs created');

    // Water Quality
    await WaterQuality.create([
      {
        plant: plant1._id,
        parameters: {
          ph: 7.2,
          turbidity: 2.1,
          dissolvedOxygen: 6.5,
          chlorine: 0.5,
          hardness: 180,
          tds: 320,
          temperature: 26,
          residualChlorine: 0.4
        },
        status: 'excellent',
        recordedBy: operator._id,
        source: 'sensor'
      },
      {
        plant: plant1._id,
        parameters: {
          ph: 7.0,
          turbidity: 3.5,
          chlorine: 0.4,
          tds: 350,
          temperature: 25
        },
        status: 'good',
        recordedBy: operator._id,
        source: 'lab',
        recordedAt: new Date(Date.now() - 86400000)
      },
      {
        plant: plant2._id,
        parameters: {
          ph: 6.8,
          turbidity: 4.2,
          chlorine: 0.6,
          tds: 280,
          temperature: 24
        },
        status: 'good',
        recordedBy: operator._id
      }
    ]);

    console.log('Quality records created');

    // Chemicals
    await Chemical.create([
      {
        name: 'Alum (Aluminium Sulfate)',
        code: 'CHEM-ALUM-01',
        plant: plant1._id,
        category: 'coagulant',
        quantity: 2500,
        unit: 'kg',
        minStock: 500,
        supplier: 'ChemSupply India',
        status: 'available'
      },
      {
        name: 'Chlorine Gas',
        code: 'CHEM-CL2-01',
        plant: plant1._id,
        category: 'disinfectant',
        quantity: 180,
        unit: 'kg',
        minStock: 200,
        supplier: 'SafeChem Ltd',
        status: 'low'
      },
      {
        name: 'Lime (Calcium Hydroxide)',
        code: 'CHEM-LIME-01',
        plant: plant1._id,
        category: 'pH_adjuster',
        quantity: 1200,
        unit: 'kg',
        minStock: 300,
        status: 'available'
      },
      {
        name: 'PAC (Poly Aluminium Chloride)',
        code: 'CHEM-PAC-01',
        plant: plant2._id,
        category: 'coagulant',
        quantity: 800,
        unit: 'kg',
        minStock: 200,
        status: 'available'
      }
    ]);

    console.log('Chemicals created');

    // Alerts
    await Alert.create([
      {
        title: 'Low Chlorine Stock',
        message: 'Chlorine Gas stock is below minimum level at Yamuna Plant',
        type: 'inventory',
        severity: 'warning',
        plant: plant1._id,
        createdBy: manager._id
      },
      {
        title: 'Reservoir Level Low',
        message: 'Distribution Tank B is at low level (18%)',
        type: 'level',
        severity: 'warning',
        plant: plant1._id
      },
      {
        title: 'Maintenance Due',
        message: 'Filter backwash system inspection due',
        type: 'maintenance',
        severity: 'info',
        plant: plant1._id
      }
    ]);

    // Maintenance
    await Maintenance.create([
      {
        title: 'Filter Media Replacement',
        description: 'Replace sand filter media in unit 2',
        plant: plant1._id,
        equipment: 'Sand Filter Unit-2',
        type: 'preventive',
        priority: 'high',
        status: 'scheduled',
        scheduledDate: new Date(Date.now() + 7 * 86400000),
        assignedTo: operator._id,
        estimatedHours: 16,
        createdBy: manager._id
      },
      {
        title: 'Pump Overhaul',
        description: 'Annual overhaul of high-lift pumps',
        plant: plant1._id,
        equipment: 'High Lift Pump Set',
        type: 'preventive',
        priority: 'medium',
        status: 'in_progress',
        scheduledDate: new Date(),
        assignedTo: operator._id,
        estimatedHours: 24,
        createdBy: manager._id
      },
      {
        title: 'Desalination Membrane Check',
        description: 'Inspect and clean RO membranes',
        plant: plant3._id,
        equipment: 'RO Membrane Bank',
        type: 'corrective',
        priority: 'critical',
        status: 'scheduled',
        scheduledDate: new Date(Date.now() + 2 * 86400000),
        createdBy: admin._id
      }
    ]);

    console.log('Alerts & Maintenance created');
    console.log('\n=== Seed completed successfully ===');
    console.log('Login credentials:');
    console.log('Admin: admin@waterplant.com / admin123');
    console.log('Manager: manager@waterplant.com / manager123');
    console.log('Operator: operator@waterplant.com / operator123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
