// js/gallery-slider.js - Initializes Swiper.js for the gallery carousel

document.addEventListener('DOMContentLoaded', () => {
    console.log('Gallery Slider script loaded.');

    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
        console.error('Swiper.js is not loaded. Gallery will not function.');
        return;
    }

    const gallerySwiper = new Swiper('.gallery-swiper', {
        // Optional parameters
        loop: true, // Enables continuous loop mode
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 0,

        // Effect (Default is 'slide', can be 'fade', 'cube', 'coverflow', 'flip')
        effect: 'slide', // You can experiment with 'fade' for a different feel
        // fadeEffect: {
        // crossFade: true
        // },

        // Autoplay
        // autoplay: {
        // delay: 5000, // 5 seconds
        // disableOnInteraction: false, // Continue autoplay after user interaction
        // },

        // Pagination (Dots)
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Allows clicking on dots to navigate
            dynamicBullets: true, // If you have many slides, this makes pagination nicer
        },

        // Navigation Arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Keyboard navigation
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        
        // Accessibility - Swiper generally has good defaults
        a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            paginationBulletMessage: 'Go to slide {{index}}',
        },

        // Responsive breakpoints (example)
        /*
        breakpoints: {
            // when window width is >= 640px
            640: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 1, // Or adjust to show partial next/prev slides
                spaceBetween: 30
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 1, 
                spaceBetween: 40
            }
        }
        */
    });

    console.log('Gallery Swiper initialized.', gallerySwiper);
}); 