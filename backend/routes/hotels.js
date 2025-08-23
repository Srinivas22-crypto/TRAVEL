import express from 'express';
import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
  getHotelDeals,
} from '../controllers/hotels.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management and search
 */

router
  .route('/')
  .get(optionalAuth, getHotels)
  .post(protect, authorize('admin'), createHotel);

router.get('/search', searchHotels);
router.get('/deals', getHotelDeals);

router
  .route('/:id')
  .get(getHotel)
  .put(protect, authorize('admin'), updateHotel)
  .delete(protect, authorize('admin'), deleteHotel);

export default router;
