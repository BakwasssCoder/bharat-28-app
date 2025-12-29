# BHARAT²⁸ - Restaurant Management System

## Overview
BHARAT²⁸ is a complete restaurant management system with:
- Frontend website for customers to browse menu and place orders
- Admin panel for managing menu items, categories, and orders
- WhatsApp ordering integration
- Complete billing and order management system

## 🚀 Deployment Instructions

### Frontend (Client-side)
1. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Set build command to `npm run build`
   - Set output directory to `dist`
   - Add environment variables:
     - `VITE_API_BASE_URL`: URL of your deployed backend server
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### Backend (Server-side)
The backend server must be deployed separately:
1. Deploy to Render, Railway, or Heroku
2. Set environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `PORT`: Port number (defaults to 5000)
3. Use start command: `npm start`

### Important Notes
- The frontend and backend are separate deployments
- Both need to be properly configured with the same Supabase project
- The frontend makes API calls to the backend server
- WhatsApp ordering uses the number: +919999173075

## 🛠️ Technologies Used
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- Express.js
- PostgreSQL

## 📋 Features
- Real-time menu management
- Order tracking
- WhatsApp integration
- Admin panel
- Responsive design

## 📝 Admin Access

Default admin credentials:
- Username: `admin`
- Password: `admin123`

**Important**: Change the default password after first login!

## 📖 API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Protected API routes
- Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## 📜 License

This project is proprietary to BHARAT 28 and should not be distributed without permission.

## 🛠️ Support

For technical support, contact the development team.