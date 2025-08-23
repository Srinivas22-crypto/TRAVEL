# Travel - Full-Stack Travel Booking & Community Platform

A comprehensive travel platform that combines booking services (flights, hotels, cars) with a social community for travelers. Built with modern technologies and production-ready architecture.

## 🚀 Features

### 🔐 Authentication & User Management
- JWT-based authentication with secure password hashing
- User profiles with preferences and settings
- Role-based access control (User/Admin)
- Password reset and email verification

### 🌍 Travel Content & Booking
- **Destinations**: Explore travel destinations with categories, ratings, and detailed information
- **Flights**: Search, filter, and book flights with multiple class options
- **Hotels**: Find and book accommodations with room types and amenities
- **Cars**: Rent vehicles with various categories and features
- **Unified Booking System**: Seamless booking experience across all services

### 💳 Payment Integration
- **Multiple Payment Gateways**: Razorpay and Stripe integration
- **Secure Transactions**: PCI-compliant payment processing
- **Transaction Management**: Complete payment history and refund handling

### 👥 Community Features
- **Social Posts**: Share travel experiences with photos and stories
- **Groups**: Create and join travel communities
- **Interactions**: Like, comment, and share posts
- **Travel Stories**: Connect with fellow travelers

### 🛡️ Security & Performance
- **Security Headers**: Helmet.js for security
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error management

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay, Stripe
- **Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs, Helmet, CORS

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd travel-platform
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# See backend/.env.example for all required variables

# Seed sample data (optional)
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# See frontend/.env.example for required variables

# Start development server
npm run dev
```

### 4. Environment Configuration

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/travel_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env)
```env
# API
VITE_API_URL=http://localhost:5000/api

# Payment Gateways
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Optional Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## 🚀 Running the Application

### Development Mode
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🗂️ Project Structure

```
travel-platform/
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── scripts/            # Utility scripts
│   └── server.js           # Entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── lib/            # Utilities
│   │   └── App.tsx         # Main app component
│   └── public/             # Static assets
└── README.md
```

## 🔧 Key Features Implementation

### Authentication Flow
1. User registers/logs in through frontend
2. Backend validates credentials and returns JWT
3. Frontend stores token and includes in API requests
4. Protected routes verify token on each request

### Booking Process
1. User searches for flights/hotels/cars
2. Selects preferred option and fills booking details
3. Creates booking record in database
4. Initiates payment through chosen gateway
5. Confirms booking upon successful payment

### Community Features
1. Users create posts with content and images
2. Posts can be tagged and associated with groups
3. Other users can like, comment, and share
4. Groups allow focused community discussions

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
npm run test:watch
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:watch
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure monitoring and logging

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to CDN or static hosting (Vercel, Netlify)
3. Configure environment variables
4. Set up custom domain

### Database
- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backup and monitoring

## 🔒 Security Considerations

- **Environment Variables**: Never commit sensitive data
- **HTTPS**: Use SSL certificates in production
- **CORS**: Configure proper origins
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Validate all user inputs
- **Authentication**: Secure JWT implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review API documentation at `/api-docs`
- Create an issue in the repository
- Contact the development team

## 🎯 Future Enhancements

- [ ] Real-time chat in groups
- [ ] Advanced search with filters
- [ ] Mobile app development
- [ ] AI-powered travel recommendations
- [ ] Integration with external travel APIs
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social media integrations

---

Built with ❤️ for travelers by travelers
