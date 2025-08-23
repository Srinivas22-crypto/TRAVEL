import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  processRefund,
  getTransactions,
  razorpayWebhook,
  stripeWebhook,
} from '../controllers/payments.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and transaction management
 */

// Protect all routes except webhooks
router.use((req, res, next) => {
  if (req.path.includes('/webhook/')) {
    return next();
  }
  protect(req, res, next);
});

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - paymentMethod
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: Booking ID
 *               paymentMethod:
 *                 type: string
 *                 enum: [razorpay, stripe]
 *                 description: Payment method
 *               currency:
 *                 type: string
 *                 description: Currency code
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentIntent:
 *                       type: object
 *                     clientSecret:
 *                       type: string
 *                     transactionId:
 *                       type: string
 */
router.post('/create-intent', createPaymentIntent);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - paymentIntentId
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID
 *               paymentIntentId:
 *                 type: string
 *                 description: Payment intent ID from gateway
 *               paymentDetails:
 *                 type: object
 *                 description: Additional payment details
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 */
router.post('/confirm', confirmPayment);

/**
 * @swagger
 * /api/payments/status/{transactionId}:
 *   get:
 *     summary: Get payment status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Payment status
 */
router.get('/status/:transactionId', getPaymentStatus);

/**
 * @swagger
 * /api/payments/refund:
 *   post:
 *     summary: Process refund (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - amount
 *               - reason
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID
 *               amount:
 *                 type: number
 *                 description: Refund amount
 *               reason:
 *                 type: string
 *                 description: Refund reason
 *     responses:
 *       200:
 *         description: Refund processed successfully
 */
router.post('/refund', authorize('admin'), processRefund);

/**
 * @swagger
 * /api/payments/transactions:
 *   get:
 *     summary: Get transactions (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of transactions per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', authorize('admin'), getTransactions);

// Webhook endpoints (no authentication required)
/**
 * @swagger
 * /api/payments/webhook/razorpay:
 *   post:
 *     summary: Razorpay webhook
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/webhook/razorpay', razorpayWebhook);

/**
 * @swagger
 * /api/payments/webhook/stripe:
 *   post:
 *     summary: Stripe webhook
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/webhook/stripe', stripeWebhook);

export default router;
