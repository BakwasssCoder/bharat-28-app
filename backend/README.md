# BHARAT 28 Backend API

This is the backend API for the BHARAT 28 restaurant management system.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)

## Features

- Admin authentication with JWT
- Menu management
- Order processing (counter and POS)
- Sales tracking and reporting
- Daily sales snapshots
- Secure API endpoints

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing

## Project Structure

```
backend/
├── controllers/        # Request handlers
├── middleware/         # Custom middleware
├── models/            # Database models (Prisma)
├── routes/            # API route definitions
├── utils/             # Utility functions
├── prisma/            # Prisma schema and migrations
├── scripts/           # Helper scripts
├── .env.example       # Environment variable template
├── server.js          # Entry point
└── package.json       # Dependencies and scripts
```

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root of the backend directory based on `.env.example`:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation

## Database Setup

1. Make sure PostgreSQL is installed and running
2. Create a database:
   ```sql
   CREATE DATABASE bharat28;
   ```
3. Update the `DATABASE_URL` in your `.env` file
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## API Documentation

### Authentication

#### Admin Login
```
POST /api/admin/login
```
Body:
```json
{
  "username": "admin",
  "password": "password"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "uuid",
    "username": "admin",
    "role": "admin"
  }
}
```

#### Get Admin Profile
```
GET /api/admin/profile
```
Headers:
```
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "success": true,
  "admin": {
    "id": "uuid",
    "username": "admin",
    "role": "admin",
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Orders

#### Create Order (Counter)
```
POST /api/orders
```
Headers:
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```
Body:
```json
{
  "items": [
    {
      "menuItemId": "uuid",
      "quantity": 2
    }
  ],
  "paymentMode": "Cash",
  "orderSource": "Counter"
}
```

Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-123456-789",
    "totalAmount": 298,
    "paymentMode": "Cash",
    "orderSource": "Counter",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "orderItems": [
      {
        "id": "uuid",
        "orderId": "uuid",
        "menuItemId": "uuid",
        "quantity": 2,
        "priceAtSale": 149,
        "menuItem": {
          "id": "uuid",
          "name": "Litti Chokha",
          "price": 149
        }
      }
    ]
  }
}
```

#### Create POS Order
```
POST /api/orders/pos
```
Body:
```json
{
  "items": [
    {
      "menuItemId": "uuid",
      "quantity": 1,
      "priceAtSale": 149
    }
  ],
  "totalAmount": 149,
  "paymentMode": "UPI"
}
```

Response:
```json
{
  "success": true,
  "message": "POS order created successfully",
  "order": {
    // Same structure as regular order
  }
}
```

#### Get All Orders
```
GET /api/orders?page=1&limit=20
```
Headers:
```
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "success": true,
  "orders": [
    // Array of orders
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalOrders": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Order by ID
```
GET /api/orders/:id
```
Headers:
```
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "success": true,
  "order": {
    // Order object
  }
}
```

### Sales

#### Get Sales Dashboard
```
GET /api/sales/dashboard
```
Headers:
```
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "success": true,
  "data": {
    "today": {
      "totalOrders": 12,
      "totalRevenue": 2450
    },
    "weekly": {
      "totalOrders": 85,
      "totalRevenue": 18750
    },
    "monthly": {
      "totalOrders": 342,
      "totalRevenue": 76500
    },
    "recentOrders": [
      // Array of recent orders
    ],
    "dailySales": [
      // Array of daily sales data
    ]
  }
}
```

#### Get Sales Report
```
GET /api/sales/report?startDate=2023-01-01&endDate=2023-01-31
```
Headers:
```
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "success": true,
  "data": {
    "salesData": [
      // Array of daily sales
    ],
    "summary": {
      "totalOrders": 150,
      "totalRevenue": 32500,
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-01-31T00:00:00.000Z"
    }
  }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Admin logs in with username/password
2. Server validates credentials and returns a JWT
3. Client stores the JWT (typically in localStorage)
4. For subsequent requests, client includes the JWT in the Authorization header:
   ```
   Authorization: Bearer your_jwt_token_here
   ```
5. Server verifies the JWT before processing protected routes

## Security

- Passwords are hashed using bcrypt
- JWT tokens are signed with a secret key
- API endpoints are protected with middleware
- Input validation on all endpoints
- CORS configured for security
- Environment variables used for sensitive configuration

## Testing

Run tests with:
```bash
npm test
```

## Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed deployment instructions.