const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../utils/supabaseClient');

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin by username
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    const { error: updateError } = await supabase
      .from('admins')
      .update({ last_login: new Date() })
      .eq('id', admin.id);

    if (updateError) {
      console.error('Update last login error:', updateError);
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        lastLogin: admin.last_login
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin.id,
        username: req.admin.username,
        role: req.admin.role,
        lastLogin: req.admin.last_login,
        createdAt: req.admin.created_at
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh admin token
const refreshAdminToken = async (req, res) => {
  try {
    // Get the current admin from the request (attached by auth middleware)
    const admin = req.admin;
    
    // Generate a new JWT token
    const newToken = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  refreshAdminToken  // Add the new function
};