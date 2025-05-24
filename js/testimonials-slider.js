// js/testimonials-slider.js - Initializes Swiper.js for the testimonials carousel

document.addEventListener('DOMContentLoaded', () => {
    console.log('Testimonials Slider script loaded.');

    if (typeof Swiper === 'undefined') {
        console.error('Swiper.js is not loaded. Testimonials slider will not function.');
        return;
    }

    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        loop: true,
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1, // Show one testimonial card at a time by default
        spaceBetween: 30, // Space between slides (if you were to show more than 1)

        effect: 'slide', // Standard slide effect

        autoplay: {
            delay: 6000, // Autoplay every 6 seconds
            disableOnInteraction: true, // Stop autoplay if user interacts
        },

        pagination: {
            el: '.testimonials-pagination', // Use the specific class for testimonial pagination
            clickable: true,
        },

        // Navigation arrows (optional, uncomment HTML and these lines if needed)
        // navigation: {
        //     nextEl: '.testimonials-arrow.next-arrow',
        //     prevEl: '.testimonials-arrow.prev-arrow',
        // },

        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },

        a11y: {
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
            paginationBulletMessage: 'Go to testimonial {{index}}',
        },

        // Responsive breakpoints for testimonials (example)
        breakpoints: {
            // For wider screens, you might want to show more testimonials or adjust spacing
            // Example: Tablets (768px and up)
            768: {
                slidesPerView: 1, // Still 1, but you could change to 2 if cards are smaller
                // spaceBetween: 40,
            },
            // Example: Desktops (1024px and up)
            1024: {
                slidesPerView: 1, // Or perhaps 2 or 3 if design allows
                // spaceBetween: 50,
            }
        }
    });

    console.log('Testimonials Swiper initialized.', testimonialsSwiper);
}); 