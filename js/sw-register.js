/**
 * Service Worker Registration
 * Registers the service worker for offline functionality
 */

// Service Worker temporarily disabled for debugging
console.log('Service Worker registration disabled for debugging');

/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
*/