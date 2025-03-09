// File: src/js/main.js
import '../styles/main.scss'; // Import main styles
import { initializeHeader } from './components/header';
import { initializeHero } from './components/hero';
import { setupLazyLoading } from './utils/responsive';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website initialized with Vite');
  
  // Initialize components
  initializeApp();
});

function initializeApp() {
  // Initialize responsive features
  setupLazyLoading();
  
  // Initialize header and navigation
  initializeHeader();
  
  // Initialize hero section
  initializeHero();
  
  // Additional initialization logic will be added in future tasks
  console.log('Portfolio components initialized');
}