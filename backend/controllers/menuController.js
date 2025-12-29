const { supabase } = require('../utils/supabaseClient');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      categories: data
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    // Check if category already exists
    const { data: existingCategory, error: existingError } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    
    // Create category
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name: name.trim()
      })
      .select()
      .single();

    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    // Check if another category with the same name exists
    const { data: existingCategory, error: existingError } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name.trim())
      .neq('id', id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    // Update category
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        name: name.trim()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has menu items
    const { count, error: countError } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) throw countError;

    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with menu items. Please move or delete menu items first.'
      });
    }
    
    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all menu items with category information
const getMenuItems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (name)
      `)
      .order('name', { ascending: true });

    if (error) throw error;
    
    res.json({
      success: true,
      menuItems: data
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all menu items with category information (public endpoint)
const getPublicMenuItems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (name)
      `)
      .order('name', { ascending: true });

    if (error) throw error;
    
    res.json({
      success: true,
      menuItems: data
    });
  } catch (error) {
    console.error('Get public menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, price, category_id } = req.body;
    
    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Menu item name is required'
      });
    }
    
    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }
    
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    // Check if category exists
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', category_id)
      .single();

    if (categoryError) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Create menu item
    const { data: menuItem, error } = await supabase
      .from('menu_items')
      .insert({
        name: name.trim(),
        price: parseInt(price),
        category_id
      })
      .select(`
        *,
        categories (name)
      `)
      .single();

    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category_id } = req.body;
    
    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Menu item name is required'
      });
    }
    
    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }
    
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    // Check if category exists
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', category_id)
      .single();

    if (categoryError) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Update menu item
    const { data: menuItem, error } = await supabase
      .from('menu_items')
      .update({
        name: name.trim(),
        price: parseInt(price),
        category_id
      })
      .eq('id', id)
      .select(`
        *,
        categories (name)
      `)
      .single();

    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete menu item
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPublicMenuItems  // Export the new function
};