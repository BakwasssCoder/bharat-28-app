# BHARAT 28 Restaurant System - Deployment Guide

## Architecture Overview

The BHARAT 28 system consists of two main components:
1. **Frontend**: React/Vite application (in the root directory)
2. **Backend**: Node.js/Express API with PostgreSQL database (in the `/backend` directory)

## Prerequisites

- Node.js v18+ installed
- PostgreSQL v13+ installed
- npm or yarn package manager
- Cloudinary account (for image storage, optional)

## Backend Setup

### 1. Database Configuration

1. Create a PostgreSQL database:
```sql
CREATE DATABASE bharat28;
```

2. Update the `.env` file in the `/backend` directory with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/bharat28?schema=public"
```

### 2. Environment Variables

Create a `.env` file in the `/backend` directory based on `.env.example`:
```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A strong secret key for JWT tokens
- `CLOUDINARY_*`: (Optional) Your Cloudinary credentials

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Database Migration

Run Prisma migrations to set up the database schema:
```bash
npm run migrate
```

### 5. Generate Prisma Client

```bash
npm run generate
```

### 6. Create Admin User

To create an admin user, you can use the Prisma Studio or create a script:

```bash
npm run studio
```

Then manually add an admin user to the `admins` table with:
- `username`: your desired admin username
- `passwordHash`: a bcrypt hash of your password
- `role`: "admin"

Alternatively, create a script in `backend/scripts/create-admin.js`:
```javascript
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  const password = 'your_secure_password';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      passwordHash: hashedPassword,
      role: 'admin'
    }
  });
  
  console.log('Admin created:', admin);
}

createAdmin()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run the script:
```bash
node scripts/create-admin.js
```

### 7. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`.

## Frontend Setup

### 1. Install Dependencies

From the root directory:
```bash
npm install
```

### 2. Environment Variables

The frontend doesn't require special environment variables for basic functionality.

### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (authenticated)

### Orders
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders` - Get all orders (authenticated)
- `GET /api/orders/:id` - Get order by ID (authenticated)
- `POST /api/orders/pos` - Create order from POS system (public)

### Sales
- `GET /api/sales/dashboard` - Get sales dashboard data (authenticated)
- `GET /api/sales/report` - Get sales report (authenticated)

## Security Considerations

1. Always use HTTPS in production
2. Store JWT secrets securely
3. Use strong passwords for admin accounts
4. Regularly update dependencies
5. Implement rate limiting for public endpoints
6. Sanitize all user inputs
7. Use prepared statements to prevent SQL injection

## Scaling Considerations

1. Use a reverse proxy like Nginx for production deployments
2. Implement database connection pooling
3. Use Redis for caching frequently accessed data
4. Set up monitoring and logging
5. Consider horizontal scaling with load balancers
6. Use CDN for static assets
7. Implement database read replicas for heavy read workloads

## Backup and Recovery

1. Regularly backup the PostgreSQL database
2. Store backups in secure, geographically distributed locations
3. Test restoration procedures regularly
4. Monitor backup jobs for failures

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL in `.env`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Prisma Client Generation Failed**
   - Ensure Prisma CLI is installed
   - Check `schema.prisma` for syntax errors

3. **JWT Verification Failed**
   - Check JWT_SECRET in `.env`
   - Ensure token expiration is appropriate

4. **CORS Errors**
   - Check CORS configuration in `server.js`
   - Ensure frontend and backend URLs are correctly configured

### Logs

Check logs in:
- Backend: Console output or log files if configured
- Database: PostgreSQL logs
- Frontend: Browser developer console

## Maintenance

1. Regularly update dependencies
2. Monitor disk space and database size
3. Review and rotate logs
4. Update SSL certificates
5. Review security patches
6. Monitor performance metrics

## Support

For issues with the BHARAT 28 system, contact the development team or check the project documentation.

# Deployment Guide for BHARAT²⁸ Application

## Architecture Overview
The BHARAT²⁸ application consists of two main components:
1. **Frontend**: React application (deployed on Vercel)
2. **Backend**: Node.js API server (needs separate deployment)

## Deployment Steps

### 1. Deploy the Backend Server
The backend server needs to be deployed separately on a platform like Render, Railway, or Heroku.

#### Option A: Deploy to Render
1. Create an account at [Render](https://render.com)
2. Create a new Web Service
3. Connect to your GitHub repository
4. Set the root directory to `/backend`
5. Use the following settings:
   - Environment: `Node`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in Render dashboard:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - PORT (set to 10000 or leave blank for default)

#### Option B: Deploy to Railway
1. Create an account at [Railway](https://railway.app)
2. Create a new project
3. Connect to your GitHub repository
4. Select the `/backend` directory
5. Deploy the service
6. Add environment variables in Railway dashboard

### 2. Deploy the Frontend to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. In the settings, add the following environment variables:
   - `VITE_API_BASE_URL`: Set to your backend server URL (e.g., `https://your-backend.onrender.com`)
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### 3. Environment Variables Required

#### Frontend (Vercel):
- `VITE_API_BASE_URL`: Your deployed backend server URL
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

#### Backend (Render/Railway):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `PORT`: Port number (optional, defaults to 5000)

## Important Notes
- The frontend and backend are separate deployments
- The frontend makes API calls to the backend server
- Both need to be properly configured with the correct Supabase credentials
- CORS should be configured to allow requests between frontend and backend domains
