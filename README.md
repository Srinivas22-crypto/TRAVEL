# Travel Hub

A comprehensive travel booking and community platform built with React, TypeScript, and Node.js.

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Start development servers (both frontend and backend)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## ✨ Features

- **User Authentication**: Secure login and registration system with JWT
- **Destination Browsing**: Explore popular destinations and categories
- **Booking System**: Book trips and manage reservations
- **Community Features**: Connect with other travelers
- **Multi-language Support**: Available in multiple languages (i18n)
- **Responsive Design**: Works seamlessly on all devices
- **Route Planning**: Interactive route planning with maps
- **Payment Integration**: Stripe and Razorpay support

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast build tooling
- **TailwindCSS** for utility-first styling
- **Shadcn/ui** for beautiful, accessible components
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **i18next** for internationalization
- **Leaflet** for interactive maps

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image uploads
- **Stripe/Razorpay** for payment processing
- **Express Rate Limit** for API protection
- **Helmet** for security headers

## 📁 Project Structure

```
travel-hub/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   └── ...            # Custom components
│   │   ├── pages/             # Page components (.tsx)
│   │   ├── contexts/          # React contexts (Auth, Theme, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions and API client
│   │   ├── services/          # API service functions
│   │   └── i18n/              # Internationalization files
│   ├── public/                # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── backend/                     # Node.js Express backend
│   ├── models/                # MongoDB models
│   ├── routes/                # API route handlers
│   ├── middleware/            # Express middleware
│   ├── scripts/               # Utility scripts (replaces .bat files)
│   ├── package.json
│   └── server.js
├── package.json                # Root package.json with workspace scripts
└── README.md
```

## 🔧 Available Scripts

### Root Level Commands
```bash
# Development
npm run dev                    # Start both frontend and backend
npm run dev:frontend          # Start only frontend (port 5173)
npm run dev:backend           # Start only backend (port 5001)

# Production
npm run build                 # Build frontend for production
npm run start                 # Start both in production mode
npm run start:frontend        # Start frontend in production
npm run start:backend         # Start backend in production

# Maintenance
npm run install:all           # Install dependencies for all packages
npm run clean                 # Clean all node_modules and build files
```

### Development & Testing Scripts
```bash
# Testing & Debugging
npm run test                  # Run backend tests
npm run test:auth            # Test authentication endpoints
npm run debug:login          # Debug login issues
npm run health:check         # Check if backend server is running

# Database & Development Data
npm run create:test-user     # Create test user (email: test@example.com, password: password123)
npm run seed:data           # Seed database with sample destinations and data
```

## 🔐 Environment Setup

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=Travel Hub
```

### Backend Environment (.env)
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/travelhub

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Payment Gateways
STRIPE_SECRET_KEY=your-stripe-secret-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** (local or cloud)
- **npm** 8+

### Installation Steps

1. **Clone and Install**
```bash
git clone <repository-url>
cd travel-hub
npm run install:all
```

2. **Set up Environment Variables**
   - Copy `.env.example` to `.env` in both `frontend/` and `backend/` directories
   - Fill in your configuration values

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - just update MONGODB_URI
```

4. **Seed Database (Optional)**
```bash
npm run seed:data
npm run create:test-user
```

5. **Start Development**
```bash
npm run dev
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete user account

### Destinations
- `GET /api/destinations` - Get all destinations (with pagination)
- `GET /api/destinations/:id` - Get destination by ID
- `GET /api/destinations/category/:category` - Get destinations by category
- `POST /api/destinations` - Create destination (admin only)
- `PUT /api/destinations/:id` - Update destination (admin only)
- `DELETE /api/destinations/:id` - Delete destination (admin only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload profile picture

## 🧪 Testing

### Manual Testing
1. **Create Test User**
```bash
npm run create:test-user
```
This creates a user with:
- Email: `test@example.com`
- Password: `password123`

2. **Test Authentication Flow**
```bash
npm run test:auth
```

3. **Debug Login Issues**
```bash
npm run debug:login
```

### Automated Testing
```bash
npm run test          # Run all backend tests
npm run test:watch    # Run tests in watch mode
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the frontend/dist folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables in your hosting platform
# Deploy the backend folder
```

### Full Stack (Docker)
```dockerfile
# Dockerfile example available in repository
docker build -t travel-hub .
docker run -p 3000:3000 -p 5001:5001 travel-hub
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code style
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style Guidelines
- Use TypeScript for all new frontend code
- Follow React functional component patterns
- Use TailwindCSS for styling (avoid inline styles)
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Backend not starting:**
```bash
npm run health:check
# Check if MongoDB is running
# Verify environment variables
```

**Frontend build errors:**
```bash
# Clear cache and reinstall
npm run clean
npm run install:all
```

**Authentication issues:**
```bash
npm run debug:login
npm run test:auth
```

**Database connection issues:**
- Verify MongoDB is running
- Check MONGODB_URI in backend/.env
- Ensure database permissions are correct

For more help, check the troubleshooting guides in the `/docs` folder or open an issue.