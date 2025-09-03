const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
require('dotenv').config();

// Database connection
const connectDB = require('./config/db');

// Middleware imports
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter, authLimiter, messageLimiter } = require('./middleware/rateLimitMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const addonRoutes = require('./routes/addonRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const termsRoutes = require('./routes/termsRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const agentRoutes = require('./routes/agentRoutes');
const agentsRoutes = require('./routes/agentsRoutes'); // Add this line

// Connect to database
connectDB();

const app = express();

// CORS configuration - Single, unified configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3010',
    'http://127.0.0.1:3010'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply middleware in correct order
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(generalLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/agents', agentsRoutes); // Add this line
app.use('/api/cash-offers', require('./routes/cashOfferRoutes'));

// Catch all handler
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});

module.exports = app;