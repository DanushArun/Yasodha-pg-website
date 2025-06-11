// Configuration for API endpoints
const config = {
    // Update this URL after deployment to your Render app URL
    // Example: https://yasodha-pg-website.onrender.com
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5001'
        : '' // Use same origin in production
};

// Export for use in other scripts
window.appConfig = config;