// File: src/js/main.js
import '../styles/main.scss'; // Import main styles
import { setupLazyLoading } from './utils/responsive';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website initialized with Vite');
  
  // Initialize components
  initializeApp();
});

function initializeApp() {
  // Initialize responsive features
  setupLazyLoading();
  
  // Setup responsive navigation (will be initialized once we create the nav component)
  // setupResponsiveNavigation('.site-nav', '.nav-toggle');
  
  // Additional initialization logic will be added in future tasks
  console.log('Responsive framework initialized');
}