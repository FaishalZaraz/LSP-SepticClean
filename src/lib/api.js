// API configuration for XAMPP backend
const API_BASE_URL = 'http://localhost/septicclean2/backend/api';

// API helper functions
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API response from ${endpoint}:`, data);
    
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(`Network/Fetch error for ${endpoint}:`, error.message);
      alert(`Gagal menghubungi server: ${error.message}\n${url}`);
    } else {
      console.error(`API Error for ${endpoint}:`, error);
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    return apiRequest('/services.php');
  },
  
  create: async (serviceData) => {
    return apiRequest('/services.php', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },
  
  update: async (id, serviceData) => {
    return apiRequest('/services.php', {
      method: 'PUT',
      body: JSON.stringify({ id, ...serviceData }),
    });
  },
  
  delete: async (id) => {
    return apiRequest('/services.php', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    return apiRequest('/orders.php');
  },
  
  create: async (orderData) => {
    return apiRequest('/orders.php', {
      method: 'POST',
      body: JSON.stringify({
        service_id: orderData.serviceId,
        service_name: orderData.serviceName,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail,
        address: orderData.address,
        scheduled_date: orderData.scheduledDate,
        notes: orderData.notes,
        total_price: orderData.totalPrice,
      }),
    });
  },
  
  updateStatus: async (id, status) => {
    return apiRequest('/orders.php', {
      method: 'PUT',
      body: JSON.stringify({ id, status }),
    });
  },
};