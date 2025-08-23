import api, { ApiResponse } from '../lib/api';

export interface PaymentIntent {
  paymentIntent: any;
  clientSecret: string;
  transactionId: string;
  amount: number;
  currency: string;
}

export interface Transaction {
  _id: string;
  user: string;
  booking: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: 'razorpay' | 'stripe' | 'card' | 'paypal' | 'bank_transfer';
  paymentGateway?: string;
  gatewayTransactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    bankName?: string;
    upiId?: string;
  };
  refundAmount: number;
  refundReason?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
  refundedAt?: string;
}

class PaymentService {
  // Create payment intent
  async createPaymentIntent(
    bookingId: string,
    paymentMethod: 'razorpay' | 'stripe',
    currency: string = 'USD'
  ): Promise<PaymentIntent> {
    try {
      const response = await api.post<ApiResponse<PaymentIntent>>('/payments/create-intent', {
        bookingId,
        paymentMethod,
        currency,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  }

  // Confirm payment
  async confirmPayment(
    transactionId: string,
    paymentIntentId: string,
    paymentDetails?: any
  ): Promise<{
    transaction: Transaction;
    booking: any;
  }> {
    try {
      const response = await api.post('/payments/confirm', {
        transactionId,
        paymentIntentId,
        paymentDetails,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
  }

  // Get payment status
  async getPaymentStatus(transactionId: string): Promise<Transaction> {
    try {
      const response = await api.get<ApiResponse<Transaction>>(
        `/payments/status/${transactionId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }

  // Process Razorpay payment
  async processRazorpayPayment(
    paymentIntent: PaymentIntent,
    userDetails: {
      name: string;
      email: string;
      phone?: string;
    }
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentIntent.amount * 100, // Amount in paise
        currency: paymentIntent.currency,
        name: 'Travel Booking',
        description: 'Travel booking payment',
        order_id: paymentIntent.paymentIntent.id,
        handler: async (response: any) => {
          try {
            const result = await this.confirmPayment(
              paymentIntent.transactionId,
              response.razorpay_payment_id,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    });
  }

  // Process Stripe payment
  async processStripePayment(
    paymentIntent: PaymentIntent,
    stripe: any,
    elements: any
  ): Promise<any> {
    try {
      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        throw new Error(error.message);
      }

      if (confirmedPaymentIntent.status === 'succeeded') {
        const result = await this.confirmPayment(
          paymentIntent.transactionId,
          confirmedPaymentIntent.id
        );
        return result;
      }

      throw new Error('Payment not completed');
    } catch (error: any) {
      throw new Error(error.message || 'Payment failed');
    }
  }

  // Get supported payment methods
  getSupportedPaymentMethods(): Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
  }> {
    return [
      {
        id: 'razorpay',
        name: 'Razorpay',
        icon: '💳',
        description: 'Credit/Debit Cards, UPI, Net Banking, Wallets',
      },
      {
        id: 'stripe',
        name: 'Stripe',
        icon: '💳',
        description: 'Credit/Debit Cards, Digital Wallets',
      },
    ];
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Get payment status color
  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // Get payment method icon
  getPaymentMethodIcon(method: string): string {
    switch (method) {
      case 'razorpay':
        return '🇮🇳';
      case 'stripe':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'bank_transfer':
        return '🏦';
      default:
        return '💳';
    }
  }

  // Validate payment amount
  validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Max $10,000 or equivalent
  }

  // Calculate processing fee
  calculateProcessingFee(amount: number, paymentMethod: string): number {
    switch (paymentMethod) {
      case 'razorpay':
        return Math.round(amount * 0.02 * 100) / 100; // 2%
      case 'stripe':
        return Math.round((amount * 0.029 + 0.30) * 100) / 100; // 2.9% + $0.30
      default:
        return 0;
    }
  }

  // Load payment gateway scripts
  async loadPaymentGatewayScript(gateway: 'razorpay' | 'stripe'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (gateway === 'razorpay') {
        if ((window as any).Razorpay) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.head.appendChild(script);
      } else if (gateway === 'stripe') {
        if ((window as any).Stripe) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Stripe SDK'));
        document.head.appendChild(script);
      }
    });
  }
}

// Create and export a singleton instance
const paymentService = new PaymentService();
export default paymentService;
