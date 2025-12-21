# BHARAT 28 Restaurant Management System

A complete, production-ready restaurant management system with integrated billing and sales tracking.

## Features

- **Complete Admin Panel** - Secure authentication and dashboard
- **Billing System** - Counter sales processing with payment modes
- **Sales Tracking** - Real-time analytics and reporting
- **Menu Management** - Dynamic menu with categories and items
- **Content Management** - Editable website content
- **POS Integration** - Ready for external POS systems
- **Secure Authentication** - JWT-based login system
- **Database-Driven** - All content comes from PostgreSQL database

## Tech Stack

### Frontend
- React with Vite
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication

## Project Structure

```
.
├── src/                    # Frontend source code
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   └── App.tsx             # Main application component
├── backend/                # Backend API
│   ├── controllers/         # Request handlers
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   ├── prisma/             # Database schema
│   ├── server.js           # Entry point
│   └── package.json        # Backend dependencies
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
├── ADMIN_USAGE.md          # Admin panel usage guide
└── IMPLEMENTATION_SUMMARY.md  # Technical implementation details
```

## Quick Start

1. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   ```

2. **Setup Database**
   ```bash
   # Make sure PostgreSQL is running
   cd backend
   npx prisma migrate dev
   npx prisma generate
   npm run init-db
   ```

3. **Configure Environment**
   ```bash
   # Backend - copy and configure .env
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

4. **Start Servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from root directory)
   npm run dev
   ```

5. **Access Applications**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:5173/admin

## Admin Access

Default admin credentials:
- Username: `admin`
- Password: `admin123`

**Important**: Change the default password after first login!

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment instructions.

## Usage Guide

See [ADMIN_USAGE.md](ADMIN_USAGE.md) for admin panel usage instructions.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Protected API routes
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is proprietary to BHARAT 28 and should not be distributed without permission.

## Support

For technical support, contact the development team.