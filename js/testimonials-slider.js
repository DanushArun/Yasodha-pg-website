// js/testimonials-slider.js - Initializes Swiper.js for the testimonials carousel

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Swiper is loaded
    if (typeof Swiper === 'undefined') {
        console.error('Swiper is not loaded!');
        return;
    }

    const testimonialsSwiperContainer = document.querySelector('.testimonials-swiper');

    if (testimonialsSwiperContainer) {
        // Count the number of slides
        const slideCount = testimonialsSwiperContainer.querySelectorAll('.swiper-slide').length;
        
        // Determine optimal settings based on slide count
        const shouldLoop = slideCount > 3; // Only loop if we have more than 3 slides
        const slidesPerViewDesktop = Math.min(3, slideCount); // Show max 3 or total slides
        const slidesPerViewTablet = Math.min(2, slideCount); // Show max 2 or total slides
        
        const testimonialsSwiper = new Swiper(testimonialsSwiperContainer, {
            // Core functionality with dynamic loop setting
            loop: shouldLoop,
            loopedSlides: shouldLoop ? slideCount : null, // Loop all slides if looping
            loopAdditionalSlides: shouldLoop ? 1 : 0, // Clone 1 additional slide for smooth transition
            watchSlidesProgress: true, // Watch slide progress for better loop handling
            watchSlidesVisibility: true, // Watch visibility for better performance
            loopFillGroupWithBlank: false, // Don't fill with blank slides
            initialSlide: 0, // Always start from first slide
            
            grabCursor: true,
            centeredSlides: false, // Never center slides in multi-view mode
            slidesPerView: slidesPerViewDesktop,
            slidesPerGroup: 1, // Move one slide at a time
            spaceBetween: 30,
            slideToClickedSlide: false, // Disable to prevent issues
            
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                // Restart autoplay after user interaction
                waitForTransition: true,
            },

            // Speed
            speed: 600,

            // Effect
            effect: 'slide',

            // Pagination
            pagination: {
                el: '.testimonials-pagination',
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
            },

            // Navigation arrows
            navigation: {
                nextEl: '.testimonials-section .swiper-button-next',
                prevEl: '.testimonials-section .swiper-button-prev',
            },

            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },

            a11y: {
                prevSlideMessage: 'Previous testimonial',
                nextSlideMessage: 'Next testimonial',
                paginationBulletMessage: 'Go to testimonial {{index}}',
            },
            
            // Observer to watch for DOM changes
            observer: true,
            observeParents: true,
            observeSlideChildren: true,

            // Responsive breakpoints with dynamic settings
            breakpoints: {
                // Mobile
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    centeredSlides: true,
                    loop: slideCount > 1, // Loop only if more than 1 slide
                },
                // Tablet
                768: {
                    slidesPerView: slidesPerViewTablet,
                    spaceBetween: 20,
                    centeredSlides: slideCount === 1,
                    loop: slideCount > 2, // Loop only if more than 2 slides
                },
                // Desktop
                1024: {
                    slidesPerView: slidesPerViewDesktop,
                    spaceBetween: 30,
                    centeredSlides: slideCount === 1,
                    loop: shouldLoop,
                }
            },
            
            // Callbacks to ensure smooth operation
            on: {
                init: function() {
                    console.log('Testimonials Swiper initialized with', slideCount, 'slides.');
                    // Force update to ensure proper sizing
                    this.update();
                },
                slideChangeTransitionEnd: function() {
                    // Ensure loop continues working
                    if (this.params.loop) {
                        this.loopFix();
                    }
                },
                beforeInit: function() {
                    // Container is already hidden by CSS opacity: 0
                },
                afterInit: function() {
                    // Show container after proper initialization
                    setTimeout(() => {
                        if (testimonialsSwiperContainer) {
                            testimonialsSwiperContainer.classList.add('swiper-initialized');
                        }
                    }, 200);
                }
            }
        });
        
        // Additional fix for proper display
        setTimeout(() => {
            testimonialsSwiper.update();
            testimonialsSwiper.updateSlides();
            testimonialsSwiper.updateProgress();
            testimonialsSwiper.updateSlidesClasses();
            
            // Ensure navigation buttons are properly positioned
            const nextButton = testimonialsSwiperContainer.querySelector('.swiper-button-next');
            const prevButton = testimonialsSwiperContainer.querySelector('.swiper-button-prev');
            if (nextButton && prevButton) {
                testimonialsSwiper.navigation.update();
            }
        }, 300);
        
    } else {
        console.warn('Testimonials Swiper container (.testimonials-swiper) not found.');
    }
}); 