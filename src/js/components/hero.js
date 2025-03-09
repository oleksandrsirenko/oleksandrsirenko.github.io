// File: src/js/components/hero.js

/**
 * Hero component animations and interactions
 */

// Import GSAP for animations (if available)
// Check if gsap is defined to avoid errors if gsap isn't yet installed
const hasGsap = typeof gsap !== 'undefined';

export function initializeHero() {
  const heroElement = document.querySelector('.hero');
  if (!heroElement) return;
  
  // Handle scroll indicator visibility
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      // Fade out scroll indicator as user scrolls down
      if (scrollPosition > 100) {
        scrollIndicator.style.opacity = 0;
      } else {
        scrollIndicator.style.opacity = 1 - scrollPosition / 100;
      }
    }, { passive: true });
    
    // Scroll to next section when clicking the scroll indicator
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('section:not(.hero)');
      if (nextSection) {
        window.scrollTo({
          top: nextSection.offsetTop - 80, // Account for header height
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Initialize GSAP animations if available
  if (hasGsap) {
    initializeAnimations();
  }
}

// GSAP animations for the hero section
function initializeAnimations() {
  // Stagger animations for hero elements
  const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
  
  // Fade in hero elements with staggered delay
  tl.from('.hero__pre-title', { 
    y: -20, 
    opacity: 0,
    duration: 0.6
  })
  .from('.hero__title', { 
    y: -30, 
    opacity: 0,
    duration: 0.8
  }, '-=0.4')
  .from('.hero__title--highlight', { 
    y: -30, 
    opacity: 0,
    duration: 0.8
  }, '-=0.6')
  .from('.hero__description', { 
    y: -20, 
    opacity: 0
  }, '-=0.6')
  .from('.hero__cta .btn', { 
    y: -10, 
    opacity: 0, 
    stagger: 0.1
  }, '-=0.6')
  .from('.hero__image', {
    y: 30,
    opacity: 0,
    duration: 1
  }, '-=1')
  .from('.circle-decoration', {
    scale: 0.8,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2
  }, '-=1.5')
  .from('.hero__scroll-indicator', {
    opacity: 0,
    y: -10,
    duration: 0.6
  }, '-=0.8');
}