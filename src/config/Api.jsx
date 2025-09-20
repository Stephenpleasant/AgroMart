const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://agromart-4tnl.onrender.com',
  ENDPOINTS: {
    BUYER: {
      REGISTER: '/api/buyer/register',
      LOGIN: '/api/buyer/login'
    },
    SELLER: {
      REGISTER: '/api/seller/register',
      LOGIN: '/api/seller/login'
    }
  }
};

export default API_CONFIG;