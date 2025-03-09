// File: src/js/components/header.js

/**
 * Header component functionality
 * Handles header behavior such as scroll effects and mobile navigation
 */

import { createResizeHandler } from '../utils/responsive';

export function initializeHeader() {
  // Elements
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.header__nav-toggle');
  const nav = document.querySelector('.header__nav');
  const overlay = document.querySelector('.header__overlay');
  const navLinks = document.querySelectorAll('.header__nav-link');
  
  if (!header) return;
  
  // State
  let lastScrollY = window.scrollY;
  let isNavOpen = false;
  
  // Toggle mobile navigation
  function toggleNav() {
    isNavOpen = !isNavOpen;
    
    // Update button attributes
    navToggle.setAttribute('aria-expanded', isNavOpen);
    navToggle.classList.toggle('is-open', isNavOpen);
    
    // Toggle navigation visibility
    nav.classList.toggle('is-open', isNavOpen);
    
    // Toggle overlay
    if (overlay) {
      overlay.classList.toggle('is-visible', isNavOpen);
    }
    
    // Prevent body scrolling when nav is open
    document.body.classList.toggle('nav-open', isNavOpen);
  }
  
  // Close mobile navigation
  function closeNav() {
    if (!isNavOpen) return;
    
    isNavOpen = false;
    navToggle.setAttribute('aria-expanded', false);
    navToggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    
    if (overlay) {
      overlay.classList.remove('is-visible');
    }
    
    document.body.classList.remove('nav-open');
  }
  
  // Handle scroll effects
  function handleScroll() {
    const scrollY = window.scrollY;
    const threshold = 50; // Minimum scroll amount before showing/hiding header
    
    // Add shadow when scrolled
    header.classList.toggle('header--scrolled', scrollY > 10);
    
    // Hide header when scrolling down, show when scrolling up
    if (Math.abs(scrollY - lastScrollY) > threshold) {
      if (scrollY > lastScrollY && scrollY > 100) {
        // Scrolling down
        header.classList.add('header--hidden');
      } else {
        // Scrolling up
        header.classList.remove('header--hidden');
      }
      lastScrollY = scrollY;
    }
  }
  
  // Set active link based on current section
  function setActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY;
    
    // Find the current section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to current section link
        const currentLink = document.querySelector(`.header__nav-link[href="#${sectionId}"]`);
        if (currentLink) {
          currentLink.classList.add('active');
        }
      }
    });
  }
  
  // Smooth scroll to section when clicking on nav links
  function setupSmoothScroll() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle internal links
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Close mobile navigation
            closeNav();
            
            // Scroll to target section
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Account for header height
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
  
  // Event listeners
  function setupEventListeners() {
    // Toggle mobile nav
    if (navToggle) {
      navToggle.addEventListener('click', toggleNav);
    }
    
    // Close mobile nav when clicking on overlay
    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }
    
    // Close mobile nav when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isNavOpen) {
        closeNav();
      }
    });
    
    // Close mobile nav on resize to desktop
    const resizeHandler = createResizeHandler(() => {
      const isMobile = window.innerWidth < 768; // Match SCSS breakpoints
      
      if (!isMobile && isNavOpen) {
        closeNav();
      }
    });
    
    window.addEventListener('resize', resizeHandler);
    
    // Handle scroll effects
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle scroll effects - throttled for performance
    let scrollThrottleTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollThrottleTimeout) {
        scrollThrottleTimeout = setTimeout(() => {
          setActiveLink();
          scrollThrottleTimeout = null;
        }, 100);
      }
    }, { passive: true });
  }
  
  // Initialize smooth scrolling
  setupSmoothScroll();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initial state
  handleScroll();
  setActiveLink();
  
  // Return public API
  return {
    closeNav,
    toggleNav
  };
}