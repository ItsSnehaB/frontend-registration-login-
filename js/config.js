// Frontend API Configuration
// Supports Localhost Development, Vercel Production Rewrites, and Direct Render URLs

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Direct Render backend URLs configured for production
const customEndpoints = window.CUSTOM_RENDER_ENDPOINTS || {};

const CONFIG = {
  // When running locally: point to ports 8081 and 8082
  // When running on Vercel: directly call live Render endpoints
  USER_SERVICE_URL: isLocalhost 
    ? (customEndpoints.USER_SERVICE || 'http://localhost:8081/api')
    : (customEndpoints.USER_SERVICE || 'https://reglogin-user-service.onrender.com/api'),
    
  AUTH_SERVICE_URL: isLocalhost 
    ? (customEndpoints.AUTH_SERVICE || 'http://localhost:8082/api')
    : (customEndpoints.AUTH_SERVICE || 'https://reglogin-auth-service.onrender.com/api'),

  ENDPOINTS: {
    REGISTER: '/reg',
    LOGIN: '/login',
    LOGOUT: '/logout',
    ME: '/me'
  }
};

window.CONFIG = CONFIG;
