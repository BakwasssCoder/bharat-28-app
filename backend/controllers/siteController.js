const { supabase } = require('../utils/supabaseClient');

// Get all site settings
const getAllSiteContent = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;

    res.json({
      success: true,
      content: data
    });
  } catch (error) {
    console.error('Get site content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get specific site setting by key
const getSiteContentByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      content: data
    });
  } catch (error) {
    console.error('Get site content by key error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllSiteContent,
  getSiteContentByKey
};