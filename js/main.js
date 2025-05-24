/**
 * Yasodha Residency - Main JavaScript
 * Handles core functionality like navigation, custom cursor, and page loading
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Yasodha Residency V3 website scripts loaded. DOMContentLoaded fired.');

    // Initialize all core functions
    initLoader();
    initCustomCursor();
    initContactForm();
    initAccordion();

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.main-header'); // Defined here for broader scope if needed

    if (navToggle) {
        console.log('.nav-toggle element found.');
        if (navMenu) {
            console.log('.nav-menu element found.');
            navToggle.addEventListener('click', () => {
                console.log('.nav-toggle clicked.');
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                // Optional: Add a class to body to prevent scrolling when mobile menu is open
                document.body.classList.toggle('no-scroll'); 
            });
        } else {
            console.error('.nav-menu element NOT found!');
        }
    } else {
        console.error('.nav-toggle element NOT found! This is likely the cause of the error.');
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
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (navMenu && navMenu.classList.contains('active') && navToggle && navToggle.classList.contains('active')){
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            } else {
                console.warn(`Smooth scroll target ${targetId} not found.`);
            }
        });
    });

    // Update footer year
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        console.log('currentYear element found.');
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn('currentYear element NOT found.');
    }
    
    // Add class to header on scroll (for styling effects like background change)
    if(header){
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
 * Initialize the page loader
 */
function initLoader() {
    const loader = document.querySelector('.loader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    if (loaderProgress) { // Check if loaderProgress exists before trying to style it
        if (performance.navigation.type === 1 || document.cookie.indexOf('returning=true') !== -1) {
            loaderProgress.style.animationDuration = '1.5s';
        }
    } else {
        console.warn('.loader-progress element not found in initLoader.');
    }
    
    document.cookie = 'returning=true; max-age=604800';
    console.log('initLoader: Cookie and animation duration logic executed.');
}

/**
 * Initialize custom cursor effect
 */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Only initialize on desktop devices
    if (window.innerWidth > 1024 && !isMobileDevice()) {
        document.body.classList.add('cursor-active');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            // Follower follows with slight delay for effect
            setTimeout(() => {
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
            }, 70);
        });
        
        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .gallery-item, .testimonial-card, input, textarea, select, .accordion-header');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-follower-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-follower-hover');
            });
        });
    }
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const form = document.getElementById('inquiry-form');
    
    if (form) {
        const formGroups = form.querySelectorAll('.form-group');
        
        // Add focus events to form fields for floating label animation
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Check initial state (for autofill)
                if (input.value !== '') {
                    label.classList.add('active');
                }
                
                // Focus events
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                });
                
                input.addEventListener('blur', () => {
                    if (input.value === '') {
                        label.classList.remove('active');
                    }
                });
            }
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            // Phone validation
            const phoneField = form.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value) {
                const phonePattern = /^\d{10}$/;
                if (!phonePattern.test(phoneField.value.replace(/\D/g, ''))) {
                    isValid = false;
                    phoneField.classList.add('error');
                }
            }
            
            // If form is valid, show success message
            if (isValid) {
                const formData = new FormData(form);
                const formDataObject = {};
                
                formData.forEach((value, key) => {
                    formDataObject[key] = value;
                });
                
                // In a real implementation, you would send this data to a server
                console.log('Form Data:', formDataObject);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('form-success');
                successMessage.innerHTML = `
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Thank You!</h3>
                    <p>Your inquiry has been submitted successfully. We will get back to you within 24 hours.</p>
                `;
                
                form.innerHTML = '';
                form.appendChild(successMessage);
            }
        });
    }
}

/**
 * Initialize accordion functionality for FAQ section
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all items
            const currentlyActive = document.querySelector('.accordion-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Check if the user is on a mobile device
 * @returns {boolean} True if the user is on a mobile device
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
