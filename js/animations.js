/**
 * Yasodha Residency - Animations JavaScript
 * Handles advanced animations using GSAP and ScrollTrigger
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger is not loaded!');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Generic Section Fade-In Animation ---
    const sections = document.querySelectorAll('.section-padding');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%', // Trigger when 80% of the section is visible
                toggleActions: 'play none none none', // Play animation once
                // markers: true, // For debugging
            }
        });
    });

    // --- Hero Section Animations ---
    const heroHeadline = document.querySelector('.hero-headline');
    const heroSubheadline = document.querySelector('.hero-subheadline');
    const heroCTA = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroBackground = document.querySelector('.hero-background');

    if (heroHeadline && heroSubheadline && heroCTA) {
        const tlHero = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
        tlHero
            .from(heroHeadline, { opacity: 0, y: 30, delay: 0.3 })
            .from(heroSubheadline, { opacity: 0, y: 30 }, '-=0.6')
            .from(heroCTA, { opacity: 0, y: 30 }, '-=0.6');
        
        if (scrollIndicator) {
            tlHero.from(scrollIndicator, { opacity: 0, y: 20 }, '-=0.4');
        }
    }

    // Hero background parallax effect
    if (heroBackground) {
        gsap.to(heroBackground, {
            yPercent: 10,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // --- Experience Section: Staggered Item Fade-In ---
    const experienceItems = document.querySelectorAll('.experience-item');
    if (experienceItems.length > 0) {
        gsap.from(experienceItems, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            stagger: 0.2, // Stagger the start of each item's animation
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.experience-grid', // Trigger when the grid comes into view
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    }

    // --- Amenities Section: Staggered Card Fade-In ---
    const amenityCards = document.querySelectorAll('.amenity-card');
    if (amenityCards.length > 0) {
        gsap.from(amenityCards, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.amenities-grid',
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    }
    
    // --- Add more specific animations for other sections as needed ---
    // Example: Gallery title animation
    const galleryTitle = document.querySelector('#gallery .section-title');
    if (galleryTitle) {
        gsap.from(galleryTitle, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            scrollTrigger: {
                trigger: galleryTitle,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Example: Testimonials title animation
    const testimonialsTitle = document.querySelector('#testimonials .section-title');
    if (testimonialsTitle) {
        gsap.from(testimonialsTitle, {
            opacity: 0,
            x: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: testimonialsTitle,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    // Animate Experience Details Items (New)
    const experienceDetailItems = gsap.utils.toArray('.experience-detail-item');
    if (experienceDetailItems.length > 0) {
        experienceDetailItems.forEach(item => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%", 
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: "power1.out"
            });
        });
    }

    // Animate Amenity Cards
    // const amenityCards = gsap.utils.toArray('.amenity-card'); // This was already declared above, removing duplicate
    // Original amenityCards animation logic is assumed to be present earlier in the file and correct.
    // If it wasn't, it should be reinstated here, ensuring no redeclaration.
    // For now, assuming the existing amenity card animation is sufficient and correctly placed elsewhere.

    // Animate Gallery & Testimonials Section Titles
    const animatedSectionTitles = gsap.utils.toArray(
        // galleryTitle, // Removed galleryTitle from this array as it has its own animation above
        testimonialsTitle
    );
    if (animatedSectionTitles.length > 0) {
        animatedSectionTitles.forEach(title => {
            gsap.from(title, {
                opacity: 0,
                x: 50,
                duration: 0.8,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // Animate Subscribe Section (New)
    const subscribeSection = document.querySelector('.subscribe-section');
    if (subscribeSection) {
        gsap.from(subscribeSection.querySelectorAll('.section-title, .section-subtitle, .subscription-form'), {
            scrollTrigger: {
                trigger: subscribeSection,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
    }

    console.log('V3 animations initialized with hero parallax and new section animations.');
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
            trigger: '.amenities-grid',
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
