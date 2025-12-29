// API utility functions for the admin panel
import { supabase } from '@/lib/supabaseClient';

// Dynamic API base URL that works for both development and production
// In production, you'll need to deploy the backend server separately and update this URL
const getApiBaseUrl = () => {
  // For production, you need to set the backend URL as an environment variable
  // For development, use the proxy
  if (process.env.NODE_ENV === 'development') {
    return '/api'; // This will be proxied through Vite during development
  } else {
    // In production, use environment variable or default to a backend server
    // You'll need to deploy your backend server and set this URL
    return import.meta.env.VITE_API_BASE_URL || 'https://your-backend-domain.com/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Admin authentication
export const adminLogin = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  return response.json();
};

// Refresh admin token
export const refreshAdminToken = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Menu Management
export const getMenuCategories = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/menu/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

export const createMenuCategory = async (token: string, categoryData: any) => {
  const response = await fetch(`${API_BASE_URL}/menu/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  return response.json();
};

export const updateMenuCategory = async (token: string, id: string, categoryData: any) => {
  const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  return response.json();
};

export const deleteMenuCategory = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getMenuItems = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/menu/items`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

export const createMenuItem = async (token: string, itemData: any) => {
  const response = await fetch(`${API_BASE_URL}/menu/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });

  return response.json();
};

export const updateMenuItem = async (token: string, id: string, itemData: any) => {
  const response = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });

  return response.json();
};

export const deleteMenuItem = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Get admin profile
export const getAdminProfile = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Create order (billing)
export const createOrder = async (token: string, orderData: any) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  return response.json();
};

// Get all orders
export const getAllOrders = async (token: string, page = 1, limit = 20) => {
  const response = await fetch(`${API_BASE_URL}/orders?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Get order by ID
export const getOrderById = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Confirm order
export const confirmOrder = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/confirm`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Reverse order (change CONFIRMED back to PENDING)
export const reverseOrder = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/reverse`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Cancel order
export const cancelOrder = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Delete order
export const deleteOrder = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Get sales dashboard
export const getSalesDashboard = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/sales/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Print KOT
export const printKOT = async (token: string, orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/print/kot/${orderId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Print Bill
export const printBill = async (token: string, orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/print/bill/${orderId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// Get menu items from Supabase (for public website)
export const getPublicMenuItems = async () => {
  try {
    // Use the API endpoint instead of direct Supabase access
    const response = await fetch(`${API_BASE_URL}/menu/public/items`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch menu items');
    }
    
    const data = result.menuItems;

    // Group items by category
    const categoriesMap: Record<string, any> = {};
    data.forEach((item: any) => {
      const categoryId = item.category_id;
      if (!categoriesMap[categoryId]) {
        categoriesMap[categoryId] = {
          id: categoryId,
          title: item.categories?.name || '',
          items: []
        };
      }
      categoriesMap[categoryId].items.push({
        id: item.id,
        name: item.name,
        desc: item.description || '',
        price: item.price,
        tags: item.is_featured ? ['featured'] : [],
        image: item.image_url || '/placeholder.svg'
      });
    });

    return {
      menu: Object.values(categoriesMap)
    };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    throw error;
  }
};

// Get site content from API
export const getSiteContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/site/content`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch site content');
    }
    
    const data = result.content;
    
    const content: Record<string, string> = {};
    data.forEach((item: any) => {
      content[item.key] = item.value;
    });
    
    return content;
  } catch (error) {
    console.error('Error fetching site content:', error);
    throw error;
  }
};

// Create pending order (for WhatsApp orders) - now using API instead of direct Supabase
export const createPendingOrder = async (orderData: any) => {
  const response = await fetch(`${API_BASE_URL}/orders/website`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to create order');
  }
  
  return result.order;
};