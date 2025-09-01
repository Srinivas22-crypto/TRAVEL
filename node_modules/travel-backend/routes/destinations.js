import express from 'express';
import {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getDestinationsByCategory,
  searchDestinations,
  getPopularDestinations,
} from '../controllers/destinations.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateDestination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Travel destinations management
 */

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Get all destinations
 *     tags: [Destinations]
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
 *         description: Number of destinations per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search destinations
 *     responses:
 *       200:
 *         description: List of destinations
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
 *                     $ref: '#/components/schemas/Destination'
 *   post:
 *     summary: Create new destination (Admin only)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destination'
 *     responses:
 *       201:
 *         description: Destination created successfully
 */
router
  .route('/')
  .get(optionalAuth, getDestinations)
  .post(protect, authorize('admin'), validateDestination, createDestination);

/**
 * @swagger
 * /api/destinations/search:
 *   get:
 *     summary: Search destinations
 *     tags: [Destinations]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minBudget
 *         schema:
 *           type: number
 *         description: Minimum budget
 *       - in: query
 *         name: maxBudget
 *         schema:
 *           type: number
 *         description: Maximum budget
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', searchDestinations);

/**
 * @swagger
 * /api/destinations/popular:
 *   get:
 *     summary: Get popular destinations
 *     tags: [Destinations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of destinations to return
 *     responses:
 *       200:
 *         description: Popular destinations
 */
router.get('/popular', getPopularDestinations);

/**
 * @swagger
 * /api/destinations/category/{category}:
 *   get:
 *     summary: Get destinations by category
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of destinations per page
 *     responses:
 *       200:
 *         description: Destinations in category
 */
router.get('/category/:category', getDestinationsByCategory);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Get single destination
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination ID
 *     responses:
 *       200:
 *         description: Destination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Destination'
 *       404:
 *         description: Destination not found
 *   put:
 *     summary: Update destination (Admin only)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destination'
 *     responses:
 *       200:
 *         description: Destination updated successfully
 *   delete:
 *     summary: Delete destination (Admin only)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination ID
 *     responses:
 *       200:
 *         description: Destination deleted successfully
 */
router
  .route('/:id')
  .get(getDestination)
  .put(protect, authorize('admin'), updateDestination)
  .delete(protect, authorize('admin'), deleteDestination);

export default router;
