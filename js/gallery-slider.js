// js/gallery-slider.js - Initializes Swiper.js for the gallery carousel

document.addEventListener('DOMContentLoaded', () => {
    let gallerySwiper = null;
    
    // Function to initialize gallery swiper
    function initializeGallerySwiper() {
        // Ensure Swiper is loaded
        if (typeof Swiper === 'undefined') {
            console.error('Swiper is not loaded!');
            return;
        }

        const gallerySwiperContainer = document.querySelector('.gallery-swiper');

        if (gallerySwiperContainer && !gallerySwiper) {
            gallerySwiper = new Swiper(gallerySwiperContainer, {
            // Optional parameters
            loop: true,
            grabCursor: true,
            centeredSlides: false, // Set to true if you want the active slide centered, good for slidesPerView: 'auto' or > 1
            slidesPerView: 'auto', // Show as many slides as fit, or set a number like 1, 2, 3
            spaceBetween: 20, // Space between slides
            
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },

            // If we need pagination
            pagination: {
                el: '.gallery-pagination',
                clickable: true,
                dynamicBullets: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: '.gallery-button-next',
                prevEl: '.gallery-button-prev',
            },

            // Keyboard navigation
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },

            // Accessibility
            a11y: {
                prevSlideMessage: 'Previous image',
                nextSlideMessage: 'Next image',
                paginationBulletMessage: 'Go to image {{index}}',
            },

            // Responsive breakpoints
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                // when window width is >= 1024px
                1024: {
                    slidesPerView: 3, // Or 'auto' if you want variable widths and number of slides
                    spaceBetween: 30
                }
            }
            });
            console.log('Gallery Swiper initialized.');
            return gallerySwiper;
        } else if (gallerySwiper) {
            // Update existing swiper
            gallerySwiper.update();
            return gallerySwiper;
        } else {
            console.warn('Gallery Swiper container (.gallery-swiper) not found.');
            return null;
        }
    }
    
    // Listen for custom event when images are loaded
    document.addEventListener('galleryImagesLoaded', (event) => {
        console.log('Gallery images loaded, initializing/updating Swiper...');
        setTimeout(() => {
            const swiper = initializeGallerySwiper();
            if (swiper) {
                swiper.update();
                swiper.slideTo(0, 0); // Go to first slide
            }
        }, 100);
    });
    
    // Try to initialize on load (in case images are already there)
    initializeGallerySwiper();
}); 