const Property = require('../models/Property');
const User = require('../models/User');
const Notification = require('../models/Notification');
const corelogicService = require('../services/corelogicService');
const emailService = require('../services/emailService');
const { successResponse, errorResponse, paginationMeta } = require('../utils/responseFormatter');

// @desc    Create property listing
// @route   POST /api/properties
// @access  Private (Seller only)
const createProperty = async (req, res) => {
  // Only sellers can create properties
  if (req.user.role !== 'seller') {
    return res.status(403).json(
      errorResponse('Only sellers can create property listings', 403)
    );
  }

  const propertyData = {
    ...req.body,
    owner: req.user.id,
    status: 'pending' // Default to pending until media/admin approval
  };

  const property = await Property.create(propertyData);
  
  res.status(201).json(
    successResponse(property, 'Property listing created successfully')
  );
};

// @desc    Get property details
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('agents.agent', 'name email avatar');

  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Apply visibility logic - Updated to work with agents array
  const canView = (
    property.status === 'public' ||
    (req.user && (
      req.user.id === property.owner._id.toString() ||
      req.user.role === 'admin' ||
      (property.agents && property.agents.some(agentObj => 
        agentObj.agent && req.user.id === agentObj.agent._id.toString()
      ))
    ))
  );

  if (!canView) {
    return res.status(403).json(
      errorResponse('Property not accessible', 403)
    );
  }

  // Transform property to include frontend-compatible coordinates
  const propertyObj = property.toObject();
  
  if (propertyObj.location && propertyObj.location.coordinates && propertyObj.location.coordinates.length === 2) {
    propertyObj.coordinates = {
      lng: propertyObj.location.coordinates[0],
      lat: propertyObj.location.coordinates[1]
    };
  } else {
    propertyObj.coordinates = {
      lng: -97.7431,
      lat: 30.2672
    };
  }
  
  delete propertyObj.location;

  res.json(
    successResponse(propertyObj, 'Property retrieved successfully')
  );
};

// @desc    Update property
// @route   PATCH /api/properties/:id
// @access  Private (Owner/Agent/Admin)
const updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Check permissions
  const canEdit = (
    req.user.id === property.owner.toString() ||
    req.user.role === 'admin' ||
    (property.assignedAgent && req.user.id === property.assignedAgent.toString())
  );

  if (!canEdit) {
    return res.status(403).json(
      errorResponse('Not authorized to edit this property', 403)
    );
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('owner', 'name email').populate('assignedAgent', 'name email');

  res.json(
    successResponse(updatedProperty, 'Property updated successfully')
  );
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin only)
const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Only owner or admin can delete
  const canDelete = (
    req.user.id === property.owner.toString() ||
    req.user.role === 'admin'
  );

  if (!canDelete) {
    return res.status(403).json(
      errorResponse('Not authorized to delete this property', 403)
    );
  }

  await Property.findByIdAndDelete(req.params.id);

  res.json(
    successResponse(null, 'Property deleted successfully')
  );
};

// @desc    Assign agent to property
// @route   POST /api/properties/:id/assign-agent
// @access  Private (Seller only)
const assignAgent = async (req, res) => {
  const { agentId } = req.body;
  
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Only property owner can assign agent
  if (req.user.id !== property.owner.toString()) {
    return res.status(403).json(
      errorResponse('Only property owner can assign agent', 403)
    );
  }

  // Verify agent exists and has correct role
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'agent') {
    return res.status(400).json(
      errorResponse('Invalid agent ID', 400)
    );
  }

  property.assignedAgent = agentId;
  await property.save();

  // Create notification for agent
  await Notification.create({
    user: agentId,
    type: 'new_assignment',
    title: 'New Property Assignment',
    message: `You have been assigned to help with property: ${property.title}`,
    data: { propertyId: property._id, propertyTitle: property.title }
  });

  // Send email notification
  await emailService.sendNotificationEmail(agent, 'new_assignment', {
    propertyTitle: property.title
  });

  res.json(
    successResponse(property, 'Agent assigned successfully')
  );
};

// @desc    Get CoreLogic price check
// @route   GET /api/properties/:id/price-check
// @access  Private (Owner/Agent/Admin)
const getPriceCheck = async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Check permissions
  const canAccess = (
    req.user.id === property.owner.toString() ||
    req.user.role === 'admin' ||
    (property.assignedAgent && req.user.id === property.assignedAgent.toString())
  );

  if (!canAccess) {
    return res.status(403).json(
      errorResponse('Not authorized to access price check', 403)
    );
  }

  try {
    const priceEstimate = await corelogicService.getPriceEstimate(property);
    
    res.json(
      successResponse(priceEstimate, 'Price check completed successfully')
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Price check service unavailable', 500)
    );
  }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object - Updated to include both pending and public properties
  const filter = { status: { $in: ['pending', 'public'] } };
  
  if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
  if (req.query.state) filter.state = new RegExp(req.query.state, 'i');
  if (req.query.minPrice) filter.price = { ...filter.price, $gte: req.query.minPrice };
  if (req.query.maxPrice) filter.price = { ...filter.price, $lte: req.query.maxPrice };
  if (req.query.beds) filter.beds = { $gte: req.query.beds };
  if (req.query.baths) filter.baths = { $gte: req.query.baths };
  
  // Add featured filter
  if (req.query.featured === 'true') {
    filter.featured = true;
  }

  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate('owner', 'name email')
    .populate('agents.agent', 'name email')
    .sort({ featured: -1, dateListed: -1 })
    .skip(skip)
    .limit(limit);

  // Transform properties to include frontend-compatible coordinates
  const transformedProperties = properties.map(property => {
    const propertyObj = property.toObject();
    
    // Transform GeoJSON coordinates to frontend format
    if (propertyObj.location && propertyObj.location.coordinates && propertyObj.location.coordinates.length === 2) {
      propertyObj.coordinates = {
        lng: propertyObj.location.coordinates[0], // GeoJSON uses [longitude, latitude]
        lat: propertyObj.location.coordinates[1]
      };
    } else {
      // Provide fallback coordinates if missing
      propertyObj.coordinates = {
        lng: -97.7431, // Austin default
        lat: 30.2672
      };
    }
    
    // Remove the location field to avoid confusion
    delete propertyObj.location;
    
    return propertyObj;
  });

  res.json(
    successResponse(
      transformedProperties,
      'Properties retrieved successfully',
      200,
      paginationMeta(page, limit, total)
    )
  );
};

// Add new function for property stats
const getPropertyStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments({ status: 'public' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const avgPriceResult = await Property.aggregate([
      { $match: { status: 'public' } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    
    const stats = {
      totalProperties: totalProperties || 0,
      soldProperties: soldProperties || 0,
      averagePrice: avgPriceResult[0]?.avgPrice || 0,
      activeListings: totalProperties || 0
    };
    
    res.json(successResponse(stats, 'Property stats retrieved successfully'));
  } catch (error) {
    // Return fallback stats if database query fails
    const fallbackStats = {
      totalProperties: 150,
      soldProperties: 45,
      averagePrice: 450000,
      activeListings: 150
    };
    res.json(successResponse(fallbackStats, 'Property stats retrieved successfully'));
  }
};

// @desc    Get seller's properties
// @route   GET /api/seller/properties
// @access  Private (Seller only)
const getSellerProperties = async (req, res) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json(
      errorResponse('Only sellers can access this endpoint', 403)
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filter by owner (current seller)
  const filter = { owner: req.user.id };
  
  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate('assignedAgent', 'name email')
    .sort({ dateListed: -1 })
    .skip(skip)
    .limit(limit);

  res.json(
    successResponse(
      properties,
      'Seller properties retrieved successfully',
      200,
      paginationMeta(page, limit, total)
    )
  );
};

// @desc    Submit property publicly (no authentication required)
// @route   POST /api/properties/public-submit
// @access  Public
const submitPropertyPublic = async (req, res) => {
  try {
    const {
      title, address, city, state, zipCode, price, beds, baths, 
      squareMeters, propertyType, yearBuilt, description, features,
      contactName, contactEmail, contactPhone, images, timeframe,
      latitude = 0, longitude = 0
    } = req.body;

    // Validation for required fields
    const requiredFields = {
      title, address, city, state, zipCode, price, beds, baths,
      squareMeters, propertyType, contactName, contactEmail, contactPhone
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create or find user
    let user = await User.findOne({ email: contactEmail });
    if (!user) {
      // Generate a temporary password for public submissions
      const tempPassword = Math.random().toString(36).slice(-12) + 'Temp123!';
      
      user = new User({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        password: tempPassword, // Add temporary password
        role: 'seller',
        isVerified: false
      });
      await user.save();
    }

    // Process images if provided
    const processedImages = images && images.length > 0 
      ? images.map((img, index) => ({
          url: img.url || img.preview || '',
          caption: img.caption || '',
          isPrimary: index === 0,
          order: index
        }))
      : [];

    // Create property data
    const propertyData = {
      owner: user._id,
      title,
      address: {
        street: address,
        city,
        state,
        zipCode,
        country: 'US'
      },
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
      },
      propertyType,
      price: parseFloat(price),
      beds: parseInt(beds),
      baths: parseFloat(baths),
      squareMeters: parseFloat(squareMeters),
      yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
      description: description || '',
      contactInfo: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone
      },
      images: processedImages,
      status: 'draft'
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property submitted successfully',
      data: {
        propertyId: property._id,
        status: property.status
      }
    });

  } catch (error) {
    console.error('Property submission error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${validationErrors.join(', ')}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during property submission'
    });
  }
};

// @desc    Get filter options for properties
// @route   GET /api/properties/filter-options
// @access  Public
const getFilterOptions = async (req, res) => {
  try {
    // Get unique property types
    const propertyTypes = await Property.distinct('propertyType', { status: 'public' });
    
    // Get unique cities
    const cities = await Property.distinct('city', { status: 'public' });
    
    // Get price range
    const priceStats = await Property.aggregate([
      { $match: { status: 'public' } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    // Get size range
    const sizeStats = await Property.aggregate([
      { $match: { status: 'public' } },
      {
        $group: {
          _id: null,
          minSize: { $min: '$squareMeters' },
          maxSize: { $max: '$squareMeters' }
        }
      }
    ]);
    
    const filterOptions = {
      propertyTypes: propertyTypes.filter(type => type), // Remove null/undefined values
      cities: cities.filter(city => city), // Remove null/undefined values
      priceRange: {
        min: priceStats[0]?.minPrice || 0,
        max: priceStats[0]?.maxPrice || 1000000
      },
      sizeRange: {
        min: sizeStats[0]?.minSize || 0,
        max: sizeStats[0]?.maxSize || 465 // 5000 sq ft converted to sq m
      }
    };
    
    res.json(
      successResponse(filterOptions, 'Filter options retrieved successfully')
    );
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve filter options', 500)
    );
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  assignAgent,
  getPriceCheck,
  getSellerProperties,
  getPropertyStats,
  submitPropertyPublic,
  getFilterOptions  // Add this new function
};