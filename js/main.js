/**
 * Yasodha Residency - Main JavaScript
 * Handles core functionality like navigation, custom cursor, and page loading
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Yasodha Residency V3 website scripts loaded. DOMContentLoaded fired.');

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        console.log('.nav-toggle and .nav-links elements found.');
        navToggle.addEventListener('click', () => {
            console.log('.nav-toggle clicked.');
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active'); // For styling the hamburger icon itself (e.g., to X)
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });
    } else {
        console.error('.nav-toggle or .nav-links element NOT found! This is likely the cause of the error.');
    }

    // Smooth scrolling for navigation links
    const allAnchors = document.querySelectorAll('a[href^="#"]');
    console.log(`Found ${allAnchors.length} anchor links for smooth scroll.`);
    allAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('main-header') ? document.getElementById('main-header').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (navLinks && navLinks.classList.contains('active') && navToggle && navToggle.classList.contains('active')){
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            } else {
                console.warn(`Smooth scroll target ${targetId} not found.`);
            }
        });
    });

    // Update footer year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        console.log('currentYear element found.');
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn('currentYear element NOT found.');
    }
    
    // Add class to header on scroll (for styling effects like background change)
    const header = document.getElementById('main-header');
    if (header) {
        console.log('.main-header element found for scroll effect.');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    } else {
        console.warn('.main-header element NOT found for scroll effect.');
    }

    // Active navigation link highlighting on scroll
    const sections = document.querySelectorAll('main section[id]');
    const navListItems = document.querySelectorAll('.nav-links li a');

    if (sections.length > 0 && navListItems.length > 0) {
        console.log('sections and navListItems elements found for active link highlighting.');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                // Adjust offset if header is fixed and has height
                const headerHeight = document.getElementById('main-header') ? document.getElementById('main-header').offsetHeight : 0;
                if (window.pageYOffset >= (sectionTop - headerHeight - sectionHeight / 3)) { // Adjust the trigger point
                    current = section.getAttribute('id');
                }
            });

            navListItems.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href').substring(1) === current) {
                    a.classList.add('active');
                }
            });
        });
    } else {
        console.warn('sections or navListItems elements NOT found for active link highlighting.');
    }
});

// Window load event for actions that need all resources loaded
window.addEventListener('load', () => {
    console.log('Window loaded event fired.');
    document.body.classList.add('loaded'); 

    // Explicitly hide the loader now that everything should be loaded
    const loader = document.querySelector('.loader');
    if (loader) {
        console.log('Loader element found, attempting to hide.');
        // Option 1: Smooth fade out (if CSS transition is set up)
        loader.style.opacity = '0';
        // Wait for opacity transition to finish before setting visibility to hidden or display to none
        // This timeout should match your CSS transition duration for opacity
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            // loader.style.display = 'none'; // Alternative to visibility
            console.log('Loader hidden via JS.');
        }, 500); // Adjust this duration (e.g., 500ms = 0.5s)

        // Option 2: Immediate removal (less smooth)
        // loader.remove(); 
        // console.log('Loader removed via JS.');

    } else {
        console.warn('Loader element not found at window.load, cannot hide.');
    }
});

/**
 * Check if the user is on a mobile device
 * @returns {boolean} True if the user is on a mobile device
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
