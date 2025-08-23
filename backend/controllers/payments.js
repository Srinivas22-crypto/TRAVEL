import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod, currency = 'USD' } = req.body;

    // Get booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking',
      });
    }

    // Check if booking is already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already paid',
      });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      user: req.user.id,
      booking: bookingId,
      amount: booking.totalAmount,
      currency,
      paymentMethod,
      paymentGateway: paymentMethod,
      status: 'pending',
    });

    // Create payment intent based on payment method
    let paymentIntent;
    let clientSecret;

    if (paymentMethod === 'razorpay') {
      // Razorpay integration
      paymentIntent = {
        id: `razorpay_${transaction.transactionId}`,
        amount: booking.totalAmount * 100, // Razorpay expects amount in paise
        currency: currency.toLowerCase(),
        receipt: transaction.transactionId,
      };
      clientSecret = `razorpay_secret_${transaction.transactionId}`;
    } else if (paymentMethod === 'stripe') {
      // Stripe integration
      paymentIntent = {
        id: `stripe_${transaction.transactionId}`,
        amount: booking.totalAmount * 100, // Stripe expects amount in cents
        currency: currency.toLowerCase(),
        metadata: {
          bookingId,
          transactionId: transaction.transactionId,
        },
      };
      clientSecret = `stripe_secret_${transaction.transactionId}`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported payment method',
      });
    }

    // Update transaction with payment intent ID
    transaction.gatewayTransactionId = paymentIntent.id;
    transaction.status = 'processing';
    await transaction.save();

    res.status(200).json({
      success: true,
      data: {
        paymentIntent,
        clientSecret,
        transactionId: transaction.transactionId,
        amount: booking.totalAmount,
        currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res, next) => {
  try {
    const { transactionId, paymentIntentId, paymentDetails } = req.body;

    // Find transaction
    const transaction = await Transaction.findOne({ transactionId })
      .populate('booking');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this payment',
      });
    }

    // Update transaction status
    transaction.status = 'completed';
    transaction.gatewayTransactionId = paymentIntentId;
    transaction.processedAt = new Date();
    
    if (paymentDetails) {
      transaction.paymentDetails = paymentDetails;
    }

    await transaction.save();

    // Update booking status
    const booking = transaction.booking;
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.transaction = transaction._id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        transaction,
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:transactionId
// @access  Private
export const getPaymentStatus = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ 
      transactionId: req.params.transactionId 
    }).populate('booking');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify user owns the transaction or is admin
    if (transaction.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
export const processRefund = async (req, res, next) => {
  try {
    const { transactionId, amount, reason } = req.body;

    const transaction = await Transaction.findOne({ transactionId })
      .populate('booking');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed transactions',
      });
    }

    if (amount > transaction.amount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed transaction amount',
      });
    }

    // Process refund
    await transaction.processRefund(amount, reason);

    // Update booking status if full refund
    if (amount === transaction.amount) {
      const booking = transaction.booking;
      booking.paymentStatus = 'refunded';
      booking.status = 'cancelled';
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions
// @route   GET /api/payments/transactions
// @access  Private/Admin
export const getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.paymentMethod) {
      query.paymentMethod = req.query.paymentMethod;
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .populate('user', 'name email')
      .populate('booking')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Razorpay webhook
// @route   POST /api/payments/webhook/razorpay
// @access  Public
export const razorpayWebhook = async (req, res, next) => {
  try {
    // Verify webhook signature (implement based on Razorpay docs)
    const event = req.body;

    if (event.event === 'payment.captured') {
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment.entity.order_id;

      // Find transaction and update status
      const transaction = await Transaction.findOne({
        gatewayTransactionId: orderId,
      });

      if (transaction) {
        await transaction.markCompleted(paymentId);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook
// @route   POST /api/payments/webhook/stripe
// @access  Public
export const stripeWebhook = async (req, res, next) => {
  try {
    // Verify webhook signature (implement based on Stripe docs)
    const event = req.body;

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const transactionId = paymentIntent.metadata.transactionId;

      // Find transaction and update status
      const transaction = await Transaction.findOne({ transactionId });

      if (transaction) {
        await transaction.markCompleted(paymentIntent.id);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
