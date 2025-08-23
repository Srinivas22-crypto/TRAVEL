# Travel Backend API

A comprehensive backend API for a travel booking and community platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & User Management**: JWT-based authentication with role-based access control
- **Travel Content**: Destinations, flights, hotels, and car rentals with search and filtering
- **Booking System**: Complete booking workflow with payment integration
- **Community Features**: Social posts, comments, likes, groups, and user interactions
- **Payment Processing**: Razorpay and Stripe integration for secure payments
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Centralized error handling with detailed responses
- **Security**: Helmet, CORS, rate limiting, and other security measures

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment Gateways**: Razorpay, Stripe
- **Documentation**: Swagger/OpenAPI
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-rate-limit
- **File Upload**: Multer (for future image uploads)
- **Email**: Nodemailer (for notifications)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   API_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:5173

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/travel_db

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Payment Gateway Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Database Setup**
   - Make sure MongoDB is running locally or provide a MongoDB Atlas connection string
   - The application will automatically connect to the database on startup

5. **Seed Sample Data** (Optional)
   ```bash
   npm run seed
   ```
   
   To remove seeded data:
   ```bash
   npm run seed -- -d
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:5000/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Send password reset email
- `PUT /api/auth/resetpassword/:token` - Reset password

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get single destination
- `GET /api/destinations/search` - Search destinations
- `GET /api/destinations/popular` - Get popular destinations
- `GET /api/destinations/category/:category` - Get destinations by category
- `POST /api/destinations` - Create destination (Admin)
- `PUT /api/destinations/:id` - Update destination (Admin)
- `DELETE /api/destinations/:id` - Delete destination (Admin)

### Flights
- `GET /api/flights` - Get all flights
- `GET /api/flights/:id` - Get single flight
- `GET /api/flights/search` - Search flights
- `GET /api/flights/deals` - Get flight deals
- `POST /api/flights` - Create flight (Admin)
- `PUT /api/flights/:id` - Update flight (Admin)
- `DELETE /api/flights/:id` - Delete flight (Admin)

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get single hotel
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/deals` - Get hotel deals
- `POST /api/hotels` - Create hotel (Admin)
- `PUT /api/hotels/:id` - Update hotel (Admin)
- `DELETE /api/hotels/:id` - Delete hotel (Admin)

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get single car
- `GET /api/cars/search` - Search cars
- `POST /api/cars` - Create car (Admin)
- `PUT /api/cars/:id` - Update car (Admin)
- `DELETE /api/cars/:id` - Delete car (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/status/:transactionId` - Get payment status
- `POST /api/payments/refund` - Process refund (Admin)
- `GET /api/payments/transactions` - Get transactions (Admin)

### Posts (Community)
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/:id` - Get single post
- `GET /api/posts/user/:userId` - Get user's posts
- `GET /api/posts/tag/:tag` - Get posts by tag
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post
- `POST /api/posts/:id/comment` - Add comment
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment
- `POST /api/posts/:id/share` - Share post

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get single group
- `GET /api/groups/:id/posts` - Get group posts
- `GET /api/groups/:id/members` - Get group members
- `POST /api/groups` - Create group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group
- `PUT /api/groups/:id/members/:userId` - Update member role
- `DELETE /api/groups/:id/members/:userId` - Remove member

## Database Models

### User
- Authentication and profile information
- Role-based access control (user, admin)
- Preferences and settings

### Destination
- Travel destinations with categories
- Images, coordinates, ratings
- Popular activities and budget estimates

### Flight
- Flight information with departure/arrival details
- Pricing for different classes
- Seat availability and amenities

### Hotel
- Hotel details with location and amenities
- Room types and pricing
- Ratings and reviews

### Car
- Car rental information
- Categories, features, and pricing
- Location and availability

### Booking
- Unified booking system for flights, hotels, cars
- Passenger/guest details
- Payment and status tracking

### Transaction
- Payment processing records
- Gateway integration details
- Refund management

### Post
- Social media posts with content and images
- Tags, location, likes, comments
- Group association

### Group
- Travel communities and groups
- Member management with roles
- Privacy settings and rules

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevent API abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

### Environment Variables
Ensure all production environment variables are set:
- Database connection string
- JWT secrets
- Payment gateway credentials
- Email service configuration

### Production Considerations
- Use a production MongoDB instance
- Set `NODE_ENV=production`
- Configure proper logging
- Set up monitoring and health checks
- Use HTTPS in production
- Configure proper CORS origins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
