import express from 'express';
import {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
  getFlightDeals,
} from '../controllers/flights.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Flights
 *   description: Flight management and search
 */

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Get all flights
 *     tags: [Flights]
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
 *         description: Number of flights per page
 *       - in: query
 *         name: airline
 *         schema:
 *           type: string
 *         description: Filter by airline
 *     responses:
 *       200:
 *         description: List of flights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flight'
 *   post:
 *     summary: Create new flight (Admin only)
 *     tags: [Flights]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flight'
 *     responses:
 *       201:
 *         description: Flight created successfully
 */
router
  .route('/')
  .get(optionalAuth, getFlights)
  .post(protect, authorize('admin'), createFlight);

/**
 * @swagger
 * /api/flights/search:
 *   get:
 *     summary: Search flights
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Departure city
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination city
 *       - in: query
 *         name: departureDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Departure date
 *       - in: query
 *         name: returnDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Return date (for round trip)
 *       - in: query
 *         name: passengers
 *         schema:
 *           type: integer
 *         description: Number of passengers
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *           enum: [economy, business, first]
 *         description: Flight class
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: Flight search results
 */
router.get('/search', searchFlights);

/**
 * @swagger
 * /api/flights/deals:
 *   get:
 *     summary: Get flight deals
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of deals to return
 *     responses:
 *       200:
 *         description: Flight deals
 */
router.get('/deals', getFlightDeals);

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Get single flight
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID
 *     responses:
 *       200:
 *         description: Flight details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Flight'
 *       404:
 *         description: Flight not found
 *   put:
 *     summary: Update flight (Admin only)
 *     tags: [Flights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flight'
 *     responses:
 *       200:
 *         description: Flight updated successfully
 *   delete:
 *     summary: Delete flight (Admin only)
 *     tags: [Flights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID
 *     responses:
 *       200:
 *         description: Flight deleted successfully
 */
router
  .route('/:id')
  .get(getFlight)
  .put(protect, authorize('admin'), updateFlight)
  .delete(protect, authorize('admin'), deleteFlight);

export default router;
