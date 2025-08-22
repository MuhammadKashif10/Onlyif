const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  constructor() {
    this.isConfigured = !!process.env.STRIPE_SECRET_KEY;
  }

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      if (!this.isConfigured) {
        // Mock response when Stripe is not configured
        return {
          id: `pi_mock_${Date.now()}`,
          client_secret: `pi_mock_${Date.now()}_secret`,
          status: 'succeeded',
          amount: amount,
          currency: currency,
          metadata: metadata
        };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Stripe Error:', error.message);
      throw new Error('Payment processing failed');
    }
  }

  async confirmPaymentIntent(paymentIntentId) {
    try {
      if (!this.isConfigured) {
        return {
          id: paymentIntentId,
          status: 'succeeded'
        };
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe Confirm Error:', error.message);
      throw new Error('Payment confirmation failed');
    }
  }
}

module.exports = new StripeService();