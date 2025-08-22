const Inspection = require('../models/Inspection');
const Property = require('../models/Property');
const User = require('../models/User');
const { successResponse, errorResponse, paginationMeta } = require('../utils/responseFormatter');

// @desc    Create inspection
// @route   POST /api/inspections
// @access  Private
const createInspection = async (req, res) => {
  try {
    const inspectionData = {
      ...req.body,
      createdBy: req.user.id
    };

    const inspection = await Inspection.create(inspectionData);
    
    await inspection.populate([
      { path: 'property', select: 'title address' },
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    res.status(201).json(
      successResponse(inspection, 'Inspection created successfully')
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error creating inspection', 500)
    );
  }
};

// @desc    Get inspections
// @route   GET /api/inspections
// @access  Private
const getInspections = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'seller') {
      // Get inspections for seller's properties
      const sellerProperties = await Property.find({ owner: req.user.id }).select('_id');
      const propertyIds = sellerProperties.map(p => p._id);
      query.property = { $in: propertyIds };
    } else if (req.user.role === 'agent') {
      query.assignedTo = req.user.id;
    } else if (req.user.role === 'buyer') {
      query.createdBy = req.user.id;
    }

    const inspections = await Inspection.find(query)
      .populate('property', 'title address')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Inspection.countDocuments(query);

    res.json(
      successResponse(
        inspections,
        'Inspections retrieved successfully',
        200,
        paginationMeta(page, limit, total)
      )
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error retrieving inspections', 500)
    );
  }
};

module.exports = {
  createInspection,
  getInspections
};