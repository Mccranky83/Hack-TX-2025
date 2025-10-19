import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// In production, this should be an environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

export default stripePromise;
