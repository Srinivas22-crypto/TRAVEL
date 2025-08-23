import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - user
 *         - booking
 *         - amount
 *         - currency
 *         - paymentMethod
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Transaction ID
 *         user:
 *           type: string
 *           description: User ID who made the transaction
 *         booking:
 *           type: string
 *           description: Booking ID associated with transaction
 *         transactionId:
 *           type: string
 *           description: Unique transaction identifier
 *         amount:
 *           type: number
 *           description: Transaction amount
 *         currency:
 *           type: string
 *           description: Currency code
 *         paymentMethod:
 *           type: string
 *           enum: [card, razorpay, stripe, paypal, bank_transfer]
 *           description: Payment method used
 *         paymentGateway:
 *           type: string
 *           description: Payment gateway used
 *         gatewayTransactionId:
 *           type: string
 *           description: Transaction ID from payment gateway
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, failed, cancelled, refunded]
 *           description: Transaction status
 *         paymentDetails:
 *           type: object
 *           description: Additional payment details
 *         refundAmount:
 *           type: number
 *           description: Refund amount if applicable
 *         refundReason:
 *           type: string
 *           description: Reason for refund
 *         failureReason:
 *           type: string
 *           description: Reason for failure
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a user'],
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: [true, 'Transaction must be associated with a booking'],
  },
  transactionId: {
    type: String,
    unique: true,
    uppercase: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide transaction amount'],
    min: [0, 'Amount must be positive'],
  },
  currency: {
    type: String,
    required: [true, 'Please provide currency'],
    uppercase: true,
    maxlength: [3, 'Currency code must be 3 characters'],
    default: 'USD',
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please provide payment method'],
    enum: {
      values: ['card', 'razorpay', 'stripe', 'paypal', 'bank_transfer'],
      message: 'Payment method must be one of: card, razorpay, stripe, paypal, bank_transfer',
    },
  },
  paymentGateway: {
    type: String,
    trim: true,
    maxlength: [50, 'Payment gateway name cannot be more than 50 characters'],
  },
  gatewayTransactionId: {
    type: String,
    trim: true,
    maxlength: [100, 'Gateway transaction ID cannot be more than 100 characters'],
  },
  status: {
    type: String,
    required: [true, 'Please provide transaction status'],
    enum: {
      values: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      message: 'Status must be one of: pending, processing, completed, failed, cancelled, refunded',
    },
    default: 'pending',
  },
  paymentDetails: {
    cardLast4: {
      type: String,
      maxlength: [4, 'Card last 4 digits must be 4 characters'],
    },
    cardBrand: {
      type: String,
      maxlength: [20, 'Card brand cannot be more than 20 characters'],
    },
    bankName: {
      type: String,
      maxlength: [100, 'Bank name cannot be more than 100 characters'],
    },
    upiId: {
      type: String,
      maxlength: [100, 'UPI ID cannot be more than 100 characters'],
    },
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount must be positive'],
    default: 0,
  },
  refundReason: {
    type: String,
    maxlength: [500, 'Refund reason cannot be more than 500 characters'],
  },
  failureReason: {
    type: String,
    maxlength: [500, 'Failure reason cannot be more than 500 characters'],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  processedAt: {
    type: Date,
  },
  refundedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Generate transaction ID before saving
transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

// Update processedAt when status changes to completed
transactionSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.processedAt) {
      this.processedAt = new Date();
    }
    if (this.status === 'refunded' && !this.refundedAt) {
      this.refundedAt = new Date();
    }
  }
  next();
});

// Create indexes
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ booking: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ gatewayTransactionId: 1 });

// Virtual for net amount (amount - refund)
transactionSchema.virtual('netAmount').get(function() {
  return this.amount - this.refundAmount;
});

// Method to mark as completed
transactionSchema.methods.markCompleted = function(gatewayTransactionId) {
  this.status = 'completed';
  this.processedAt = new Date();
  if (gatewayTransactionId) {
    this.gatewayTransactionId = gatewayTransactionId;
  }
  return this.save();
};

// Method to mark as failed
transactionSchema.methods.markFailed = function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  return this.save();
};

// Method to process refund
transactionSchema.methods.processRefund = function(amount, reason) {
  this.status = 'refunded';
  this.refundAmount = amount || this.amount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  return this.save();
};

export default mongoose.model('Transaction', transactionSchema);
