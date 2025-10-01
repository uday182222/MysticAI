import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface PaymentTier {
  id: string;
  name: string;
  amount: number; // in INR
  credits: number;
  minutes: number;
  description: string;
}

export const PAYMENT_TIERS: PaymentTier[] = [
  {
    id: 'tier1',
    name: 'Basic Plan',
    amount: 99, // ₹99
    credits: 5,
    minutes: 5,
    description: '5 AI Chat Credits + 5 Minutes'
  },
  {
    id: 'tier2',
    name: 'Standard Plan',
    amount: 199, // ₹199
    credits: 10,
    minutes: 10,
    description: '10 AI Chat Credits + 10 Minutes'
  },
  {
    id: 'tier3',
    name: 'Premium Plan',
    amount: 299, // ₹299
    credits: 15,
    minutes: 15,
    description: '15 AI Chat Credits + 15 Minutes'
  }
];

export async function createRazorpayOrder(amount: number, currency: string = 'INR') {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        description: 'MysticAI Credits Purchase'
      }
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export function verifyRazorpaySignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): boolean {
  try {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    return false;
  }
}

export async function getRazorpayPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}

export { razorpay };
