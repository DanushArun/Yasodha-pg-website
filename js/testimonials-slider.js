// js/testimonials-slider.js - Initializes Swiper.js for the testimonials carousel

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Swiper is loaded
    if (typeof Swiper === 'undefined') {
        console.error('Swiper is not loaded!');
        return;
    }

    const testimonialsSwiperContainer = document.querySelector('.testimonials-swiper');

    if (testimonialsSwiperContainer) {
        const testimonialsSwiper = new Swiper(testimonialsSwiperContainer, {
            // Core functionality
            loop: true,
            grabCursor: true,
            centeredSlides: false,
            slidesPerView: 3,
            spaceBetween: 30,
            slideToClickedSlide: true,
            
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
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

            // Responsive breakpoints
            breakpoints: {
                // Mobile
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    centeredSlides: true
                },
                // Tablet
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false
                },
                // Desktop
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: false
                }
            }
        });
        console.log('Testimonials Swiper initialized.');
    } else {
        console.warn('Testimonials Swiper container (.testimonials-swiper) not found.');
    }
}); 