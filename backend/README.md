# WellSetu Backend API

Node.js/Express.js REST API backend for the WellSetu Mental Health Support Platform.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Testing](#testing)
- [Security](#security)
- [License](#license)

## Features

- JWT-based authentication with role-based access control (student, counselor, admin)
- AI-powered chat integration (OpenAI GPT / Google Gemini)
- Mood tracking and analytics
- Mental health screening assessments
- Appointment scheduling system
- Peer support forum
- Journal entries
- Crisis detection and alerting
- Admin dashboard with analytics

## Tech Stack

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, cors, express-rate-limit, express-mongo-sanitize, hpp

## Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware (auth, validation, error handling)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions and helpers
│   ├── seed.js              # Database seeder
│   └── server.js            # Application entry point
├── logs/                    # Application logs
├── uploads/                 # File uploads directory
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables in .env file

# Seed database (optional)
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | User login |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password/:token` | Reset password |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/profile` | Get user profile |
| PATCH | `/api/v1/users/profile` | Update profile |
| PATCH | `/api/v1/users/change-password` | Change password |
| GET | `/api/v1/users/counselors` | List counselors |

### Mood Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/mood` | Create mood entry |
| GET | `/api/v1/mood` | Get mood entries |
| GET | `/api/v1/mood/stats` | Get mood statistics |
| GET | `/api/v1/mood/trends` | Get mood trends |
| GET | `/api/v1/mood/:id` | Get entry by ID |
| PATCH | `/api/v1/mood/:id` | Update entry |
| DELETE | `/api/v1/mood/:id` | Delete entry |

### Journal

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/journal` | Create journal entry |
| GET | `/api/v1/journal` | Get journal entries |
| GET | `/api/v1/journal/prompts` | Get writing prompts |
| GET | `/api/v1/journal/:id` | Get entry by ID |
| PATCH | `/api/v1/journal/:id` | Update entry |
| DELETE | `/api/v1/journal/:id` | Delete entry |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/appointments` | Book appointment |
| GET | `/api/v1/appointments` | Get appointments |
| GET | `/api/v1/appointments/upcoming` | Get upcoming appointments |
| GET | `/api/v1/appointments/:id` | Get appointment by ID |
| PATCH | `/api/v1/appointments/:id/cancel` | Cancel appointment |
| POST | `/api/v1/appointments/:id/feedback` | Submit feedback |

### Screening

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/screening/tests` | Get available tests |
| POST | `/api/v1/screening` | Submit screening |
| GET | `/api/v1/screening` | Get screening history |
| GET | `/api/v1/screening/progress/:testType` | Get progress over time |

### Forum

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/forum` | Get posts |
| POST | `/api/v1/forum` | Create post |
| GET | `/api/v1/forum/:id` | Get post by ID |
| POST | `/api/v1/forum/:id/like` | Toggle like |
| POST | `/api/v1/forum/:id/reply` | Add reply |
| POST | `/api/v1/forum/:id/report` | Report post |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/chat` | Send message |
| GET | `/api/v1/chat/history` | Get chat history |
| GET | `/api/v1/chat/prompts` | Get suggested prompts |
| GET | `/api/v1/chat/:sessionId` | Get session by ID |
| POST | `/api/v1/chat/:sessionId/end` | End session |

### Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/resources` | Get resources |
| GET | `/api/v1/resources/featured` | Get featured resources |
| GET | `/api/v1/resources/categories` | Get categories |
| GET | `/api/v1/resources/:idOrSlug` | Get resource by ID or slug |
| POST | `/api/v1/resources/:id/rate` | Rate resource |
| POST | `/api/v1/resources/:id/save` | Save to favorites |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Get dashboard stats |
| GET | `/api/v1/admin/analytics/mood` | Get mood analytics |
| GET | `/api/v1/admin/analytics/screening` | Get screening analytics |
| GET | `/api/v1/admin/analytics/engagement` | Get engagement analytics |
| GET | `/api/v1/admin/alerts` | Get alerts |
| GET | `/api/v1/admin/export` | Export data |

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (`development`, `production`) | No |
| `PORT` | Server port (default: 5000) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | Token expiration (default: 7d) | No |
| `CORS_ORIGINS` | Allowed CORS origins | No |
| `AI_PROVIDER` | AI provider (`openai` or `gemini`) | No |
| `OPENAI_API_KEY` | OpenAI API key | Conditional |
| `GEMINI_API_KEY` | Google Gemini API key | Conditional |

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@wellsetu.com | Admin@123 |
| Counselor | counselor@wellsetu.com | Counselor@123 |
| Student | student@wellsetu.com | Student@123 |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot reload |
| `npm run seed` | Seed database with sample data |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint |

## Security

This API implements the following security measures:

- **HTTP Headers**: Helmet for secure HTTP headers
- **Rate Limiting**: Request rate limiting to prevent abuse
- **Authentication**: JWT-based token authentication
- **Password Security**: bcrypt hashing with configurable salt rounds
- **NoSQL Injection Prevention**: MongoDB query sanitization
- **Input Validation**: Request validation using express-validator
- **CORS**: Configurable cross-origin resource sharing
- **Parameter Pollution Prevention**: HPP middleware

### Crisis Detection

The AI chat system includes automated crisis detection:

1. Monitors for concerning keywords in chat messages
2. Flags sessions requiring attention
3. Provides immediate crisis resources to users
4. Creates alerts visible in the admin dashboard

## License

MIT
