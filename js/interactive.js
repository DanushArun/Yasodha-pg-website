/**
 * Interactive Features and Micro-interactions
 * Enhances user experience with smooth animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth reveal animations for elements
    initScrollRevealAnimations();

    // Interactive card tilting
    initCardTiltEffect();

    // Ripple effect on buttons
    initRippleEffect();

    // Enhanced form interactions
    initFormEnhancements();

    // Magnetic buttons
    initMagneticButtons();

    // Smooth counter animations
    initCounterAnimations();
});

/**
 * Initialize scroll reveal animations
 */
function initScrollRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal class to elements
    const revealElements = document.querySelectorAll('.experience-item, .contact-info-card, .testimonial-card, .section-title');
    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

/**
 * Initialize card tilt effect
 */
function initCardTiltEffect() {
    const cards = document.querySelectorAll('.amenity-card, .experience-item, .stat-item, .contact-info-card');
    
    cards.forEach(card => {
        // Ensure initial state
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Initialize ripple effect on buttons
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .phone-link');
    
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Initialize form enhancements
 */
function initFormEnhancements() {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    formInputs.forEach(input => {
        // Enhanced focus effects without floating labels
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            input.style.borderColor = 'var(--primary-color)';
            input.style.boxShadow = '0 0 0 0.2rem rgba(244, 181, 193, 0.25)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            input.style.borderColor = '#ccc';
            input.style.boxShadow = 'none';
        });
        
        // Enhanced input styling
        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                input.style.backgroundColor = '#f8f9fa';
            } else {
                input.style.backgroundColor = '#fff';
            }
        });
    });

    // Add character counter for textarea
    const textarea = document.querySelector('.contact-form textarea');
    if (textarea) {
        const maxLength = 500;
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0 / ${maxLength}`;
        textarea.parentElement.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            counter.textContent = `${length} / ${maxLength}`;
            
            if (length > maxLength * 0.8) {
                counter.style.color = 'var(--accent-color)';
            } else {
                counter.style.color = '#999';
            }
        });
    }
}

/**
 * Initialize magnetic button effect
 */
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-primary, .phone-link');
    
    if (window.innerWidth > 768) { // Only on desktop
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `scale(1.05) translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
}

/**
 * Initialize counter animations for statistics
 */
function initCounterAnimations() {
    // Add some statistics to the about section
    const statsHTML = `
        <div class="stats-wrapper">
            <div class="stats-section">
                <div class="stat-item">
                    <span class="stat-number" data-target="1000">0</span>
                    <span class="stat-label">Happy Residents</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-target="16">0</span>
                    <span class="stat-label">Years of Service</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-target="24">0</span>
                    <span class="stat-label">Hour Security</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-target="100">0</span>
                    <span class="stat-label">% Satisfaction</span>
                </div>
            </div>
        </div>
    `;
    
    // Insert stats after experience details
    const experienceSection = document.querySelector('.experience-details-grid');
    if (experienceSection && !document.querySelector('.stats-section')) {
        experienceSection.insertAdjacentHTML('afterend', statsHTML);
    }
    
    // Animate counters
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}