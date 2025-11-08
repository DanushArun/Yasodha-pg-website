/**
 * Yasodha Residency - Main JavaScript
 * Handles core functionality like navigation, custom cursor, and page loading
 */

// Debug mode - set to false for production
const DEBUG_MODE = false;

// Debug logger utility
const debug = {
    log: (...args) => DEBUG_MODE && console.log(...args),
    warn: (...args) => DEBUG_MODE && console.warn(...args),
    error: (...args) => console.error(...args) // Always log errors
};

// Handle Google Maps errors globally
window.addEventListener('error', function(e) {
    if (e.filename && (e.filename.includes('maps.googleapis.com') || e.filename.includes('google.com/maps'))) {
        debug.warn('Google Maps error handled:', e.message);
        return true; // Prevent the error from propagating
    }
}, true);

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    debug.log('Yasodha Residency V3 website scripts loaded. DOMContentLoaded fired.');

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (navToggle && navLinks) {
        debug.log('.nav-toggle and .nav-links elements found.');
        navToggle.addEventListener('click', () => {
            debug.log('.nav-toggle clicked.');
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active'); // For styling the hamburger icon itself
            body.classList.toggle('menu-open'); // Prevent body scroll when menu is open
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    } else {
        debug.error('.nav-toggle or .nav-links element NOT found! This is likely the cause of the error.');
    }

    // Smooth scrolling for navigation links
    const allAnchors = document.querySelectorAll('a[href^="#"]');
    debug.log(`Found ${allAnchors.length} anchor links for smooth scroll.`);
    allAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get header and calculate offset - NO BUFFER
                const header = document.getElementById('main-header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate target position - just header height, no buffer
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active') && navToggle && navToggle.classList.contains('active')){
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            } else {
                debug.warn(`Smooth scroll target ${targetId} not found.`);
            }
        });
    });

    // Update footer year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        debug.log('currentYear element found.');
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        debug.warn('currentYear element NOT found.');
    }
    
    // Utility function for debouncing scroll events
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Consolidated scroll handler for better performance
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('main section[id]');
    const navListItems = document.querySelectorAll('.nav-links li a');

    function handleScroll() {
        // Update header scrolled state
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Update active navigation link
        if (sections.length > 0 && navListItems.length > 0) {
            const headerHeight = header ? header.offsetHeight : 0;
            const scrollPosition = window.pageYOffset + headerHeight + 50;

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navListItems.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Single debounced scroll event listener
    if (header || (sections.length > 0 && navListItems.length > 0)) {
        window.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });
        // Call once to set initial state
        handleScroll();
    }
});

// Window load event for actions that need all resources loaded
window.addEventListener('load', () => {
    debug.log('Window loaded event fired.');
    document.body.classList.add('loaded');

    // Explicitly hide the loader now that everything should be loaded
    const loader = document.querySelector('.loader');
    if (loader) {
        debug.log('Loader element found, attempting to hide.');
        // Smooth fade out (if CSS transition is set up)
        loader.style.opacity = '0';
        // Wait for opacity transition to finish before setting visibility to hidden
        // This timeout should match your CSS transition duration for opacity
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            debug.log('Loader hidden via JS.');
        }, 500); // Adjust this duration (e.g., 500ms = 0.5s)
    } else {
        debug.warn('Loader element not found at window.load, cannot hide.');
    }
});

/**
 * Check if the user is on a mobile device
 * @returns {boolean} True if the user is on a mobile device
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
