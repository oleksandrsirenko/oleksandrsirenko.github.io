// File: src/js/utils/responsive.js

/**
 * Responsive utilities for managing breakpoints and responsive behaviors
 */

// Breakpoints matching the SCSS variables
const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Check if the current viewport matches a specific breakpoint
 * @param {string} breakpoint - The breakpoint to check (xs, sm, md, lg, xl, 2xl)
 * @param {string} comparison - The comparison type ('min', 'max', 'only')
 * @returns {boolean} Whether the current viewport matches the breakpoint
 */
export function matchesBreakpoint(breakpoint, comparison = 'min') {
  const windowWidth = window.innerWidth;
  const breakpointValue = breakpoints[breakpoint];
  
  if (!breakpointValue) {
    console.error(`Unknown breakpoint: ${breakpoint}`);
    return false;
  }
  
  // Get the next breakpoint for 'only' comparison
  const breakpointKeys = Object.keys(breakpoints);
  const breakpointIndex = breakpointKeys.indexOf(breakpoint);
  const nextBreakpoint = breakpointIndex < breakpointKeys.length - 1 
    ? breakpoints[breakpointKeys[breakpointIndex + 1]]
    : Infinity;
  
  switch (comparison) {
    case 'min':
      return windowWidth >= breakpointValue;
    case 'max':
      return windowWidth < breakpointValue;
    case 'only':
      return windowWidth >= breakpointValue && windowWidth < nextBreakpoint;
    default:
      console.error(`Unknown comparison type: ${comparison}`);
      return false;
  }
}

/**
 * Create a debounced resize handler
 * @param {Function} callback - The function to execute on resize
 * @param {number} delay - Delay in ms before executing the callback
 * @returns {Function} Debounced function
 */
export function createResizeHandler(callback, delay = 250) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

/**
 * Setup a responsive element that changes based on breakpoints
 * @param {HTMLElement} element - The element to make responsive
 * @param {Object} options - Configuration for different breakpoints
 * @param {Function} updateFn - Function to update the element with new options
 */
export function setupResponsiveElement(element, options, updateFn) {
  if (!element || !options || !updateFn) return;
  
  const updateElement = () => {
    const breakpointKeys = Object.keys(breakpoints);
    
    // Find the largest matching breakpoint
    for (let i = breakpointKeys.length - 1; i >= 0; i--) {
      const breakpoint = breakpointKeys[i];
      
      if (matchesBreakpoint(breakpoint) && options[breakpoint]) {
        updateFn(element, options[breakpoint]);
        return;
      }
    }
    
    // If no breakpoints match, use default options
    if (options.default) {
      updateFn(element, options.default);
    }
  };
  
  // Initial update
  updateElement();
  
  // Update on resize
  const resizeHandler = createResizeHandler(updateElement);
  window.addEventListener('resize', resizeHandler);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('resize', resizeHandler);
  };
}

/**
 * Lazy load images when they enter the viewport
 * @param {string} selector - CSS selector for images to lazy load
 * @param {Object} options - IntersectionObserver options
 */
export function setupLazyLoading(selector = '.lazy-image', options = {}) {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support IntersectionObserver
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      img.classList.remove('lazy-image');
    });
    return;
  }
  
  const config = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Set the src from data-src
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        // Set srcset if available
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // Set sizes if available
        if (img.dataset.sizes) {
          img.sizes = img.dataset.sizes;
        }
        
        // Remove placeholder class and lazy-image class
        img.classList.remove('lazy-placeholder', 'lazy-image');
        
        // Stop observing the image
        observer.unobserve(img);
      }
    });
  }, config);
  
  // Observe all images with the selector
  const images = document.querySelectorAll(selector);
  images.forEach(img => {
    img.classList.add('lazy-placeholder');
    observer.observe(img);
  });
}

/**
 * Handle responsive navigation for mobile devices
 * @param {string} navSelector - Selector for the navigation element
 * @param {string} toggleSelector - Selector for the toggle button
 */
export function setupResponsiveNavigation(navSelector = '.site-nav', toggleSelector = '.nav-toggle') {
  const nav = document.querySelector(navSelector);
  const toggle = document.querySelector(toggleSelector);
  
  if (!nav || !toggle) return;
  
  // Toggle navigation on click
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('is-open');
    
    // Prevent scrolling when nav is open
    document.body.classList.toggle('nav-open');
  });
  
  // Close navigation when clicking outside
  document.addEventListener('click', (event) => {
    const isNavOpen = nav.classList.contains('is-open');
    const isClickInside = nav.contains(event.target) || toggle.contains(event.target);
    
    if (isNavOpen && !isClickInside) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });
  
  // Close navigation on resize if we hit desktop breakpoint
  const resizeHandler = createResizeHandler(() => {
    if (matchesBreakpoint('lg')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });
  
  window.addEventListener('resize', resizeHandler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', resizeHandler);
  };
}

// Export breakpoints for use in other modules
export { breakpoints };
