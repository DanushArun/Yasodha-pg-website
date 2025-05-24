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
            // Optional parameters
            loop: true,
            grabCursor: true,
            slidesPerView: 1, // Usually show one testimonial at a time
            spaceBetween: 30, // Space if you ever have more than one slide visible
            
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },

            // Pagination
            pagination: {
                el: '.testimonials-pagination',
                clickable: true,
            },

            // No navigation arrows for testimonials by default, but can be added if needed
            // navigation: {
            //     nextEl: '.testimonial-button-next',
            //     prevEl: '.testimonial-button-prev',
            // },

            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },

            a11y: {
                prevSlideMessage: 'Previous testimonial',
                nextSlideMessage: 'Next testimonial',
                paginationBulletMessage: 'Go to testimonial {{index}}',
            },

            // Responsive breakpoints (mostly to adjust spaceBetween or if more slides are shown)
            breakpoints: {
                // when window width is >= 768px
                768: {
                    slidesPerView: 1,
                    spaceBetween: 40
                },
                // when window width is >= 1024px
                1024: {
                    slidesPerView: 1, // Still 1, but maybe adjust space or other params
                    spaceBetween: 50
                }
            }
        });
        console.log('Testimonials Swiper initialized.');
    } else {
        console.warn('Testimonials Swiper container (.testimonials-swiper) not found.');
    }
}); 