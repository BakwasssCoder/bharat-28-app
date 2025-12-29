const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const salesRoutes = require('./routes/salesRoutes');
const menuRoutes = require('./routes/menuRoutes');
const printRoutes = require('./routes/printRoutes'); // Add print routes
const siteRoutes = require('./routes/siteRoutes'); // Add site routes

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS to allow requests from any origin
const corsOptions = {
  origin: true, // Allow any origin
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/print', printRoutes); // Add print routes
app.use('/api/site', siteRoutes); // Add site routes

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'BHARAT 28 API Server is running',
    version: '1.0.0',
    endpoints: {
      admin: '/api/admin',
      orders: '/api/orders',
      sales: '/api/sales',
      menu: '/api/menu',
      print: '/api/print', // Add print endpoint
      site: '/api/site', // Add site endpoint
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});