const Property = require('../models/Property');
const CashOffer = require('../models/CashOffer');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Get seller overview statistics
// @route   GET /api/seller/:id/overview
// @access  Private (Seller only)
const getSellerOverview = async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    // Verify the seller can only access their own data
    if (req.user.role !== 'seller' || req.user.id !== sellerId) {
      return res.status(403).json(
        errorResponse('Access denied. You can only view your own overview.', 403)
      );
    }

    // Get seller's properties
    const properties = await Property.find({ 
      owner: sellerId, 
      isDeleted: false 
    }).select('_id price status dateListed');

    const propertyIds = properties.map(p => p._id);

    // Get cash offers for seller's properties
    const offers = await CashOffer.find({
      property: { $in: propertyIds },
      isDeleted: false
    }).select('status offerAmount property');

    // Calculate statistics
    const stats = {
      totalOffers: offers.length,
      pendingOffers: offers.filter(offer => 
        ['submitted', 'under_review', 'inspection_scheduled', 'inspection_completed', 'offer_made', 'negotiating'].includes(offer.status)
      ).length,
      acceptedOffers: offers.filter(offer => 
        ['accepted', 'closed'].includes(offer.status)
      ).length,
      averageOfferValue: 0,
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.status === 'active').length,
      soldProperties: properties.filter(p => p.status === 'sold').length,
      averagePropertyValue: 0,
      totalViews: 0, // This would need to be calculated from property view counts
      totalInquiries: offers.length // Using offers as inquiries for now
    };

    // Calculate average offer value
    if (offers.length > 0) {
      const validOffers = offers.filter(offer => offer.offerAmount && offer.offerAmount > 0);
      if (validOffers.length > 0) {
        stats.averageOfferValue = Math.round(
          validOffers.reduce((sum, offer) => sum + offer.offerAmount, 0) / validOffers.length
        );
      }
    }

    // Calculate average property value
    if (properties.length > 0) {
      const validProperties = properties.filter(p => p.price && p.price > 0);
      if (validProperties.length > 0) {
        stats.averagePropertyValue = Math.round(
          validProperties.reduce((sum, p) => sum + p.price, 0) / validProperties.length
        );
      }
    }

    // Calculate total views from properties
    const propertiesWithViews = await Property.find({ 
      owner: sellerId, 
      isDeleted: false 
    }).select('viewCount');
    
    stats.totalViews = propertiesWithViews.reduce((sum, p) => sum + (p.viewCount || 0), 0);

    res.json(
      successResponse(
        stats,
        'Seller overview retrieved successfully',
        200
      )
    );
  } catch (error) {
    console.error('Error fetching seller overview:', error);
    res.status(500).json(
      errorResponse('Failed to fetch seller overview', 500)
    );
  }
};

// @desc    Get seller's properties with detailed information
// @route   GET /api/seller/:id/listings
// @access  Private (Seller only)
const getSellerListings = async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    // Verify the seller can only access their own data
    if (req.user.role !== 'seller' || req.user.id !== sellerId) {
      return res.status(403).json(
        errorResponse('Access denied. You can only view your own listings.', 403)
      );
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // Optional status filter

    // Build filter
    const filter = { 
      owner: sellerId, 
      isDeleted: false 
    };
    
    if (status) {
      filter.status = status;
    }

    // Get total count
    const total = await Property.countDocuments(filter);

    // Get properties with populated data
    const properties = await Property.find(filter)
      .populate('agents.agent', 'name email phone')
      .select('title address price beds baths squareMeters status images dateListed viewCount daysOnMarket propertyType')
      .sort({ dateListed: -1 })
      .skip(skip)
      .limit(limit);

    // Get offer counts for each property
    const propertyIds = properties.map(p => p._id);
    const offerCounts = await CashOffer.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$property',
          totalOffers: { $sum: 1 },
          pendingOffers: {
            $sum: {
              $cond: [
                {
                  $in: ['$status', ['submitted', 'under_review', 'inspection_scheduled', 'inspection_completed', 'offer_made', 'negotiating']]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Create a map for quick lookup
    const offerCountMap = {};
    offerCounts.forEach(count => {
      offerCountMap[count._id.toString()] = {
        totalOffers: count.totalOffers,
        pendingOffers: count.pendingOffers
      };
    });

    // Enhance properties with offer data
    const enhancedProperties = properties.map(property => {
      const propertyObj = property.toObject();
      const offers = offerCountMap[property._id.toString()] || { totalOffers: 0, pendingOffers: 0 };
      
      return {
        ...propertyObj,
        inquiries: offers.totalOffers,
        pendingInquiries: offers.pendingOffers,
        views: propertyObj.viewCount || 0,
        primaryImage: propertyObj.images?.find(img => img.isPrimary)?.url || propertyObj.images?.[0]?.url || null
      };
    });

    const paginationMeta = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    };

    res.json(
      successResponse(
        enhancedProperties,
        'Seller listings retrieved successfully',
        200,
        paginationMeta
      )
    );
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    res.status(500).json(
      errorResponse('Failed to fetch seller listings', 500)
    );
  }
};

module.exports = {
  getSellerOverview,
  getSellerListings
};