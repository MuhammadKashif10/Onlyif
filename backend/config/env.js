require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/onlyif',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@onlyif.com',
  NODE_ENV: process.env.NODE_ENV || 'development'
};