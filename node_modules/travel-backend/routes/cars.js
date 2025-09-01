import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
} from '../controllers/cars.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car rental management and search
 */

router
  .route('/')
  .get(optionalAuth, getCars)
  .post(protect, authorize('admin'), createCar);

router.get('/search', searchCars);

router
  .route('/:id')
  .get(getCar)
  .put(protect, authorize('admin'), updateCar)
  .delete(protect, authorize('admin'), deleteCar);

export default router;
