const jwt = require('jsonwebtoken');
const { supabase } = require('../utils/supabaseClient');

// Authentication middleware for admin routes
const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin exists
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', decoded.adminId)
      .single();

    if (error || !admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Admin not found.' 
      });
    }

    // Attach admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

module.exports = { authenticateAdmin };