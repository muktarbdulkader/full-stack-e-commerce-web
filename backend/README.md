# TechStore Backend API

Full-stack e-commerce backend built with Node.js, Express, MongoDB (NoSQL), and PostgreSQL (SQL).

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Register, Login, Profile)
- 📦 Product Management (CRUD operations)
- 🛒 Shopping Cart
- 📝 Order Processing & Tracking
- ⭐ Product Reviews & Ratings
- 🔍 Advanced Filtering & Search
- 💳 Payment Integration Ready (Stripe)
- 📊 Admin Dashboard APIs

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Databases:**
  - MongoDB (NoSQL) - Primary database
  - PostgreSQL (SQL) - Alternative/Backup
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/techstore

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=techstore

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173

If you prefer to serve the provided frontend files from this backend (recommended for a simple local setup), place the `frontend/` folder as a sibling to `backend/` (already present in this repo). The server is configured to serve static files from `../frontend` and will respond to non-API routes with `index.html` so the SPA works correctly.

When serving the frontend from the backend you can leave `FRONTEND_URL` empty or set it to `http://localhost:5000`.
```

### 3. Database Setup

#### MongoDB Setup

Install MongoDB locally or use MongoDB Atlas (cloud):

```bash
# Local MongoDB
mongod

# Or use connection string for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techstore
```

#### PostgreSQL Setup

Install PostgreSQL and create database:

```bash
# Create database
createdb techstore

# Or using psql
psql -U postgres
CREATE DATABASE techstore;

# Run schema
psql -U postgres -d techstore -f models/sql/schema.sql
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description       | Access  |
| ------ | ----------- | ----------------- | ------- |
| POST   | `/register` | Register new user | Public  |
| POST   | `/login`    | Login user        | Public  |
| GET    | `/me`       | Get current user  | Private |

### Products (`/api/products`)

| Method | Endpoint       | Description       | Access  |
| ------ | -------------- | ----------------- | ------- |
| GET    | `/`            | Get all products  | Public  |
| GET    | `/:id`         | Get product by ID | Public  |
| POST   | `/`            | Create product    | Admin   |
| PUT    | `/:id`         | Update product    | Admin   |
| DELETE | `/:id`         | Delete product    | Admin   |
| POST   | `/:id/reviews` | Add review        | Private |

### Cart (`/api/cart`)

| Method | Endpoint      | Description      | Access  |
| ------ | ------------- | ---------------- | ------- |
| GET    | `/`           | Get user cart    | Private |
| POST   | `/`           | Add to cart      | Private |
| PUT    | `/:productId` | Update quantity  | Private |
| DELETE | `/:productId` | Remove from cart | Private |
| DELETE | `/`           | Clear cart       | Private |

### Orders (`/api/orders`)

| Method | Endpoint      | Description     | Access  |
| ------ | ------------- | --------------- | ------- |
| GET    | `/`           | Get all orders  | Private |
| GET    | `/:id`        | Get order by ID | Private |
| POST   | `/`           | Create order    | Private |
| PUT    | `/:id/status` | Update status   | Admin   |
| PUT    | `/:id/pay`    | Mark as paid    | Private |
| DELETE | `/:id`        | Cancel order    | Private |

### Users (`/api/users`)

| Method | Endpoint | Description    | Access  |
| ------ | -------- | -------------- | ------- |
| GET    | `/`      | Get all users  | Admin   |
| GET    | `/:id`   | Get user by ID | Private |
| PUT    | `/:id`   | Update user    | Private |
| DELETE | `/:id`   | Delete user    | Admin   |

## Authentication

All protected routes require JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Example Authenticated Request

```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Models

### MongoDB Models (NoSQL)

Located in `/models/mongodb/`:

- **User** - User accounts and profiles
- **Product** - Product catalog
- **Order** - Customer orders
- **Cart** - Shopping carts

### PostgreSQL Schema (SQL)

Located in `/models/sql/schema.sql`:

- Complete relational schema
- Indexes for performance
- Foreign key constraints
- Sample data

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev mode only)"
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ Role-based access control
- ✅ SQL injection prevention
- ✅ XSS protection

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get products
curl http://localhost:5000/api/products

# Get products by category
curl "http://localhost:5000/api/products?category=Audio&sort=price-low"
```

### Using Postman

Import the API endpoints into Postman for easier testing:

1. Create a new collection
2. Add environment variables for BASE_URL and TOKEN
3. Set Authorization header for protected routes

## Production Deployment

### Environment Variables

Ensure all production environment variables are set:

- Change `JWT_SECRET` to a strong secret
- Use production database URLs
- Set `NODE_ENV=production`
- Configure CORS for your frontend domain

### Recommended Services

- **Backend Hosting:** Heroku, DigitalOcean, AWS, Railway
- **MongoDB:** MongoDB Atlas
- **PostgreSQL:** Heroku Postgres, Supabase, AWS RDS
- **File Storage:** AWS S3, Cloudinary

## Project Structure

```
backend/
├── config/           # Database connections
├── middleware/       # Auth & validation middleware
├── models/
│   ├── mongodb/     # Mongoose schemas
│   └── sql/         # PostgreSQL schemas
├── routes/          # API routes
├── .env.example     # Environment template
├── package.json     # Dependencies
├── server.js        # Entry point
└── README.md        # Documentation
```

## Support

For issues or questions:

- Check the error logs in console
- Verify database connections
- Ensure all environment variables are set
- Check JWT token validity

## License

MIT License
