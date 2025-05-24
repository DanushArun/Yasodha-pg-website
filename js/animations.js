/**
 * Yasodha Residency - Animations JavaScript
 * Handles advanced animations using GSAP and ScrollTrigger
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger is not loaded for V3 animations!');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    console.log('GSAP and ScrollTrigger registered for V3 animations.');

    // --- V3 Global Animations ---

    // Example: Generic fade-in for sections as they scroll into view
    gsap.utils.toArray('.section-padding').forEach((section, i) => {
        gsap.from(section, {
            opacity: 0,
            y: 60, // Slightly more pronounced slide up
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 90%', // Trigger a bit earlier
                end: 'bottom 20%',
                toggleActions: 'play none none none',
                // markers: true, // Uncomment for debugging specific section triggers
            }
        });
    });

    // --- V3 Hero Section Animations ---
    const heroHeadline = document.querySelector('.hero-headline');
    const heroSubheadline = document.querySelector('.hero-subheadline');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-down-indicator');

    if (heroHeadline && heroSubheadline && heroCta) {
        const heroTl = gsap.timeline({ delay: 0.5 }); // Slightly longer delay for impact
        heroTl
            .from(heroHeadline, { opacity: 0, y: 40, duration: 1, ease: 'power4.out' })
            .from(heroSubheadline, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, "-=0.6") // Overlap more
            .from(heroCta, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, "-=0.5");
        
        if(scrollIndicator){
            heroTl.from(scrollIndicator, { opacity: 0, y: -20, duration: 0.5, ease: 'power1.out' }, "-=0.2");
        }
    }
    
    // --- V3 Experience Section Animations ---
    const experienceGrid = document.querySelector('.experience-grid');
    const experienceItems = document.querySelectorAll('.experience-item');

    if(experienceGrid && experienceItems.length > 0){
        gsap.from(experienceItems, { // Target all items directly
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2, // Add a 0.2s stagger between each item animation
            scrollTrigger: {
                trigger: experienceGrid, // Trigger when the grid container comes into view
                start: 'top 80%', // Start animation when 80% of the grid top is visible
                toggleActions: 'play none none none',
                 // markers: true, // For debugging this specific trigger
            }
        });
    }

    // --- V3 Amenities Section Animations ---
    const amenityCards = document.querySelectorAll('.amenity-card');
    if(amenityCards.length > 0){
        gsap.from(amenityCards, {
            opacity: 0,
            y: 50,
            duration: 0.7,
            stagger: 0.2, // Stagger the animation of each card
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.amenities-grid', // Trigger when the grid itself is in view
                start: 'top 80%',
                toggleActions: 'play none none none',
            }
        });
    }

    // Add more V3 specific animations for other sections (Gallery, Location, etc.) as they are styled.

    console.log('V3 animations initialized.');
});

/**
 * Initialize text reveal animations
 */
function initTextRevealAnimations() {
    // Get all text elements to animate
    const textElements = document.querySelectorAll('.reveal-text');
    
    textElements.forEach(element => {
        // Wrap the text content in a span
        const content = element.innerHTML;
        element.innerHTML = `<span>${content}</span>`;
        
        // Create animation
        gsap.from(element.querySelector('span'), {
            y: '100%',
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
    // Hero parallax effect
    gsap.to('.hero-bg', {
        y: 100,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Parallax elements
    document.querySelectorAll('.parallax').forEach(element => {
        const depth = element.dataset.depth || 0.2;
        
        gsap.to(element, {
            y: 100 * depth,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

/**
 * Initialize scroll-based animations
 */
function initScrollBasedAnimations() {
    // Fade-up animations
    gsap.utils.toArray('.fade-up').forEach(element => {
        gsap.from(element, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Fade-in animations
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.from(element, {
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Fade-left animations
    gsap.utils.toArray('.fade-left').forEach(element => {
        gsap.from(element, {
            x: -50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Fade-right animations
    gsap.utils.toArray('.fade-right').forEach(element => {
        gsap.from(element, {
            x: 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Section header animations
    document.querySelectorAll('.section-header').forEach(header => {
        const title = header.querySelector('h2');
        const line = header.querySelector('.header-line');
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        tl.from(title, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }).from(line, {
            width: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');
    });
    
    // Progress line animations
    document.querySelectorAll('.scroll-line').forEach(line => {
        gsap.to(line, {
            height: '100%',
            duration: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: line,
                start: 'top 90%',
                end: 'bottom 10%',
                scrub: true
            }
        });
    });
}

/**
 * Initialize staggered element animations
 */
function initStaggeredAnimations() {
    // Staggered animation for amenities
    gsap.from('.amenity-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.amenities-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Staggered animation for gallery items
    gsap.from('.gallery-item', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Staggered animation for FAQ items
    gsap.from('.accordion-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.faq-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Staggered animation for key points
    gsap.from('.key-point', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.key-points',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

/**
 * Initialize hero section animations
 */
function initHeroAnimations() {
    // Initial animation for hero section
    const heroTl = gsap.timeline({delay: 0.5});
    
    heroTl.from('.hero-text h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.hero-text h2', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-text p', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.scroll-indicator', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.2');
    
    // Continuous subtle animation for scroll indicator
    if (document.querySelector('.scroll-arrow')) {
        gsap.to('.scroll-arrow::before', {
            y: 20,
            opacity: 0,
            duration: 1.5,
            repeat: -1,
            ease: 'power2.inOut'
        });
    }
}
