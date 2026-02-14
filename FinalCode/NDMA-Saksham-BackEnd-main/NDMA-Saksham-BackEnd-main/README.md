# NDMA Saksham Backend

## 🎯 Overview

The **NDMA Saksham Backend** is the central API server for the SAKSHAM disaster management platform. It handles authentication, data management, AI-powered alert generation, and coordinates between all frontend applications.

## 🌟 Key Features

- 🔐 **Authentication** - Clerk-based user management
- 🤖 **AI Integration** - Google Generative AI for intelligent alerts
- 📊 **Data Management** - MongoDB with Mongoose ODM
- 📄 **PDF Generation** - Automated report creation
- 🔔 **Alert System** - Real-time disaster notifications
- 📡 **RESTful API** - Well-structured endpoints

## 📁 Project Structure

```
NDMA-Saksham-BackEnd-main/
├── app.js                  # Main application entry point
├── controllers/            # Request handlers
├── models/                 # Mongoose schemas
├── routes/                 # API route definitions
├── middlewares/            # Custom middleware (auth, validation)
├── services/               # Business logic layer
├── init/                   # Database initialization & seeding
│   └── seed.js            # Seed data script
├── uploads/               # File upload storage
├── util/                  # Helper utilities
├── future_use/            # Planned features
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
└── package.json          # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd NDMA-Saksham-BackEnd-main/NDMA-Saksham-BackEnd-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env` file with:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/saksham
   
   # Clerk Authentication
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Google Generative AI
   GOOGLE_API_KEY=your_google_api_key
   
   # Server
   PORT=3000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your_jwt_secret
   ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Server will run on**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
GET    /api/auth/verify            # Verify JWT token
```

### Alerts
```
GET    /api/alerts                 # Get all alerts
GET    /api/alerts/:id             # Get specific alert
POST   /api/alerts                 # Create new alert
PUT    /api/alerts/:id             # Update alert
DELETE /api/alerts/:id             # Delete alert
```

### Disasters
```
GET    /api/disasters              # Get all disasters
GET    /api/disasters/:id          # Get specific disaster
POST   /api/disasters              # Report new disaster
PUT    /api/disasters/:id          # Update disaster info
```

### Training
```
GET    /api/training               # Get training programs
POST   /api/training               # Create training program
GET    /api/training/recommendations  # Get AI recommendations
```

### Reports
```
GET    /api/reports                # Get all reports
POST   /api/reports/generate       # Generate new PDF report
GET    /api/reports/:id/download   # Download report
```

## 🛠️ Technology Stack

### Core
- **Node.js** - Runtime environment
- **Express.js** v5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** v9.0.0 - ODM

### Authentication & Security
- **Clerk SDK** v4.13.23 - User authentication
- **JWT** v9.0.3 - Token-based auth
- **CORS** v2.8.5 - Cross-origin resource sharing

### AI & External Services
- **Google Generative AI** v0.24.1 - AI-powered alerts
- **Axios** v1.13.2 - HTTP client

### Utilities
- **PDFKit** v0.17.2 - PDF generation
- **date-fns** v4.1.0 - Date manipulation
- **dotenv** v17.2.3 - Environment config

### Development
- **Nodemon** v3.1.11 - Development server with hot reload

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `CLERK_SECRET_KEY` | Clerk authentication key | Yes |
| `GOOGLE_API_KEY` | Google AI API key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### MongoDB Models

Key schemas:
- **User** - User accounts and profiles
- **Alert** - Disaster alerts
- **Disaster** - Disaster records
- **Training** - Training programs
- **Report** - Generated reports

## 📊 Database Seeding

Initialize database with sample data:

```bash
npm run seed
```

This will create:
- Sample users
- Test alerts
- Historical disaster data
- Training programs

## 🔐 Authentication Flow

1. **User Registration/Login** → Clerk handles authentication
2. **JWT Token Generation** → Server creates token
3. **Token Verification** → Middleware validates on protected routes
4. **User Context** → Attached to `req.user` in routes

## 🤖 AI Integration

### Google Generative AI Features
- Intelligent alert generation
- Training recommendations
- Report summarization
- Risk assessment

### Usage Example
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Generate alert description
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent(prompt);
```

## 📄 PDF Report Generation

Automated PDF generation using PDFKit:
- Disaster summaries
- Training completion certificates
- Statistical reports
- Alert history

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🐛 Debugging

Enable verbose logging:
```bash
DEBUG=* npm run dev
```

## 📈 Performance

- Uses connection pooling for MongoDB
- Implements request rate limiting
- Caches frequently accessed data
- Optimized query indexing

## 🚀 Deployment

### Production Build
```bash
NODE_ENV=production npm start
```

### Recommended Hosting
- **Heroku** - Easy deployment
- **Railway** - Modern platform
- **AWS EC2** - Full control
- **DigitalOcean** - Cost-effective

### Environment Setup
1. Set production environment variables
2. Use MongoDB Atlas for database
3. Enable HTTPS
4. Configure CORS for production domains

## 🔒 Security Best Practices

- ✅ Environment variables for secrets
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Input validation
- ✅ MongoDB injection prevention
- ✅ Rate limiting (recommended)
- ✅ HTTPS in production

## 📚 API Documentation

For detailed API documentation:
- Use Postman collection (coming soon)
- Check inline code comments
- Review controller files

## 🤝 Contributing

1. Follow existing code structure
2. Use meaningful commit messages
3. Test endpoints before committing
4. Update documentation for new features

## 📞 Support

For backend issues:
- Check logs in console
- Verify environment variables
- Ensure MongoDB connection
- Review Clerk configuration

---

**Part of SAKSHAM - SIH 2025 Project**
