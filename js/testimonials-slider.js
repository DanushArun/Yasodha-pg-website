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
            centeredSlides: true,
            slidesPerView: 3,
            spaceBetween: 30,
            
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },

            // Speed
            speed: 600,

            // Effect
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },

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
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                    coverflowEffect: {
                        rotate: 30,
                        depth: 60,
                    }
                },
                // Tablet
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    coverflowEffect: {
                        rotate: 40,
                        depth: 80,
                    }
                },
                // Desktop
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    coverflowEffect: {
                        rotate: 50,
                        depth: 100,
                    }
                }
            }
        });
        console.log('Testimonials Swiper initialized.');
    } else {
        console.warn('Testimonials Swiper container (.testimonials-swiper) not found.');
    }
}); 