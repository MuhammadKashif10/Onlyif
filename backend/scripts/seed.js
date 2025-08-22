const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Addon = require('../models/Addon');
const connectDB = require('../config/db');
const logger = require('../utils/logger');

// Admin credentials as specified
const ADMIN_EMAIL = 'info@onlyif.com';
const ADMIN_PASSWORD = 'admin123';

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info('Connected to database for seeding');

    // Clear existing data (optional - remove if you want to keep existing data)
    // await User.deleteMany({});
    // await Property.deleteMany({});
    // await Addon.deleteMany({});
    // logger.info('Cleared existing data');

    // 1. Create Admin Account
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    let admin;
    
    if (!existingAdmin) {
      admin = await User.create({
        name: 'OnlyIf Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        termsAccepted: true,
        termsAcceptedAt: new Date(),
        termsVersion: '1.0'
      });
      logger.info(`Admin account created: ${admin.email}`);
    } else {
      admin = existingAdmin;
      logger.info(`Admin account already exists: ${admin.email}`);
    }

    // 2. Create Agent Accounts
    const agents = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@onlyif.com',
        password: 'agent123',
        role: 'agent',
        termsAccepted: true,
        termsAcceptedAt: new Date(),
        termsVersion: '1.0'
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@onlyif.com',
        password: 'agent123',
        role: 'agent',
        termsAccepted: true,
        termsAcceptedAt: new Date(),
        termsVersion: '1.0'
      }
    ];

    const createdAgents = [];
    for (const agentData of agents) {
      const existingAgent = await User.findOne({ email: agentData.email });
      if (!existingAgent) {
        const agent = await User.create(agentData);
        createdAgents.push(agent);
        logger.info(`Agent created: ${agent.name} (${agent.email})`);
      } else {
        createdAgents.push(existingAgent);
        logger.info(`Agent already exists: ${existingAgent.name} (${existingAgent.email})`);
      }
    }

    // 3. Create Sample Seller Account
    const sellerData = {
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: 'seller123',
      role: 'seller',
      termsAccepted: true,
      termsAcceptedAt: new Date(),
      termsVersion: '1.0'
    };

    let seller;
    const existingSeller = await User.findOne({ email: sellerData.email });
    if (!existingSeller) {
      seller = await User.create(sellerData);
      logger.info(`Seller created: ${seller.name} (${seller.email})`);
    } else {
      seller = existingSeller;
      logger.info(`Seller already exists: ${seller.name} (${seller.email})`);
    }

    // 4. Create Sample Properties
    const properties = [
      {
        owner: seller._id,
        title: 'Beautiful Family Home in Downtown',
        address: '123 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        price: 450000,
        beds: 3,
        baths: 2,
        size: 1800,
        description: 'Stunning 3-bedroom home with modern amenities and great location.',
        images: [
          '/images/01.jpg',
          '/images/02.jpg',
          '/images/03.jpg'
        ],
        status: 'active',
        visibility: 'public',
        assignedAgent: createdAgents[0]._id
      },
      {
        owner: seller._id,
        title: 'Modern Condo with City Views',
        address: '456 Oak Avenue',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        price: 320000,
        beds: 2,
        baths: 2,
        size: 1200,
        description: 'Luxury condo with panoramic city views and premium finishes.',
        images: [
          '/images/04.jpg',
          '/images/05.jpg',
          '/images/06.jpg'
        ],
        status: 'active',
        visibility: 'public',
        assignedAgent: createdAgents[1]._id
      }
    ];

    const createdProperties = [];
    for (const propertyData of properties) {
      const existingProperty = await Property.findOne({ 
        address: propertyData.address,
        city: propertyData.city 
      });
      
      if (!existingProperty) {
        const property = await Property.create(propertyData);
        createdProperties.push(property);
        logger.info(`Property created: ${property.title} in ${property.city}`);
      } else {
        createdProperties.push(existingProperty);
        logger.info(`Property already exists: ${existingProperty.title}`);
      }
    }

    // 5. Create Add-ons
    const addons = [
      {
        type: 'photo',
        title: 'Professional Photography Package',
        price: 299,
        features: [
          'High-resolution photos',
          '20-30 professional images',
          'HDR processing',
          'Same-day delivery'
        ],
        image: '/images/photo-addon.jpg',
        status: 'active'
      },
      {
        type: 'floorplan',
        title: 'Interactive Floor Plan',
        price: 199,
        features: [
          '2D floor plan',
          'Room measurements',
          'Interactive features',
          'Print-ready format'
        ],
        image: '/images/floorplan-addon.jpg',
        status: 'active'
      },
      {
        type: 'drone',
        title: 'Aerial Drone Photography',
        price: 399,
        features: [
          'Aerial property shots',
          '4K video footage',
          'Neighborhood overview',
          'Weather permitting'
        ],
        image: '/images/drone-addon.jpg',
        status: 'active'
      },
      {
        type: 'walkthrough',
        title: '3D Virtual Walkthrough',
        price: 499,
        features: [
          '360-degree virtual tour',
          'Interactive hotspots',
          'Mobile-friendly',
          'Branded experience'
        ],
        image: '/images/walkthrough-addon.jpg',
        status: 'active'
      }
    ];

    for (const addonData of addons) {
      const existingAddon = await Addon.findOne({ 
        type: addonData.type,
        title: addonData.title 
      });
      
      if (!existingAddon) {
        const addon = await Addon.create(addonData);
        logger.info(`Add-on created: ${addon.title} ($${addon.price})`);
      } else {
        logger.info(`Add-on already exists: ${existingAddon.title}`);
      }
    }

    logger.info('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    logger.info('\nAdmin Login Credentials:');
    logger.info(`Email: ${ADMIN_EMAIL}`);
    logger.info(`Password: ${ADMIN_PASSWORD}`);
    logger.info('\nAgent Login Credentials:');
    logger.info('Agent 1 - Sarah Johnson: sarah.johnson@onlyif.com / agent123');
    logger.info('Agent 2 - Michael Chen: michael.chen@onlyif.com / agent123');
    logger.info('\nSeller Login Credentials:');
    logger.info('Seller - John Smith: john.smith@example.com / seller123');
    logger.info('\nNote: Admin cannot register through the frontend - login only!');
    
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  }
};

// Run seeding
if (require.main === module) {
  seedData();
}

module.exports = seedData;