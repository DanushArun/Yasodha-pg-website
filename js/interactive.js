/**
 * Yasodha Residency - Interactive JavaScript
 * Handles interactive elements like gallery, testimonials, etc.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive elements
    initGallery();
    initTestimonialSlider();
    initSmoothScroll();
});

/**
 * Initialize gallery functionality
 */
function initGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.querySelector('.modal-caption');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    
    let currentIndex = 0;
    let filteredItems = [...galleryItems];
    
    // Filter gallery items based on category
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab
            tabBtns.forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Filter items
            galleryItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update filtered items array
            filteredItems = [...galleryItems].filter(item => 
                category === 'all' || item.dataset.category === category
            );
            
            // Trigger layout recalculation for animations
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        });
    });
    
    // Open modal when clicking on gallery item (full screen view)
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImageInModal(item, filteredItems.indexOf(item));
        });
    });
    
    // Function to show an image in the modal
    function showImageInModal(item, index) {
        const imgSrc = item.querySelector('img').src;
        const imgAlt = item.querySelector('img').alt;
        const itemTitle = item.dataset.title;
        const itemDescription = item.dataset.description;
        
        // Preload image to ensure smooth transition
        const preloadImg = new Image();
        preloadImg.src = imgSrc;
        
        preloadImg.onload = () => {
            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            modalCaption.innerHTML = `<h3>${itemTitle}</h3><p>${itemDescription}</p>`;
            
            galleryModal.style.display = 'block';
            // Add a small delay before adding the active class for smooth transition
            setTimeout(() => {
                galleryModal.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';
            
            // Set current index
            currentIndex = index;
            
            // Focus on modal for keyboard navigation
            galleryModal.focus();
        };
    }
    
    // Close modal with smooth transition
    function closeGalleryModal() {
        galleryModal.classList.remove('active');
        setTimeout(() => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300); // Match the transition duration in CSS
    }
    
    // Close modal when clicking the close button
    closeModal.addEventListener('click', closeGalleryModal);
    
    // Close modal when clicking outside the image
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });
    
    // Navigate to previous image
    prevBtn.addEventListener('click', () => {
        navigate(-1);
    });
    
    // Navigate to next image
    nextBtn.addEventListener('click', () => {
        navigate(1);
    });
    
    // Navigation function
    function navigate(direction) {
        currentIndex = (currentIndex + direction + filteredItems.length) % filteredItems.length;
        const newItem = filteredItems[currentIndex];
        
        if (newItem) {
            // Fade out
            modalImage.style.opacity = 0;
            modalCaption.style.opacity = 0;
            
            setTimeout(() => {
                showImageInModal(newItem, currentIndex);
                // Fade in
                modalImage.style.opacity = 1;
                modalCaption.style.opacity = 1;
            }, 300);
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (galleryModal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                navigate(-1);
            } else if (e.key === 'ArrowRight') {
                navigate(1);
            } else if (e.key === 'Escape') {
                closeGalleryModal();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        }
    });
    
    // Toggle fullscreen mode
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (galleryModal.requestFullscreen) {
                galleryModal.requestFullscreen();
            } else if (galleryModal.webkitRequestFullscreen) { /* Safari */
                galleryModal.webkitRequestFullscreen();
            } else if (galleryModal.msRequestFullscreen) { /* IE11 */
                galleryModal.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    }
    
    // Fullscreen button event listener
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const testimonialContainer = document.querySelector('.testimonial-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const dots = document.querySelectorAll('.dot');
    
    if (!testimonialContainer || testimonialCards.length === 0) return;
    
    let currentIndex = 0;
    const cardWidth = 100; // 100% width
    
    // Set initial position
    updateSliderPosition();
    
    // Create click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSliderPosition();
        });
    });
    
    // Create click handlers for buttons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = testimonialCards.length - 1;
        }
        updateSliderPosition();
    });
    
    nextButton.addEventListener('click', () => {
        if (currentIndex < testimonialCards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSliderPosition();
    });
    
    // Auto slide functionality
    let slideInterval = setInterval(autoSlide, 5000);
    
    // Pause auto-slide on hover
    testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    testimonialContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(autoSlide, 5000);
    });
    
    // Update slider position based on current index
    function updateSliderPosition() {
        testimonialContainer.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Auto slide function
    function autoSlide() {
        if (currentIndex < testimonialCards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSliderPosition();
    }
}

/**
 * Initialize smooth scroll functionality
 */
function initSmoothScroll() {
    // Check if Locomotive Scroll is available
    if (typeof LocomotiveScroll !== 'undefined') {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]') || document.body,
            smooth: true,
            smoothMobile: false,
            inertia: 0.8
        });
        
        // Update scroll animations when the page changes
        scroll.on('scroll', () => {
            ScrollTrigger.update();
        });
        
        // Set up ScrollTrigger to work with Locomotive Scroll
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
            },
            pinType: document.body.style.transform ? "transform" : "fixed"
        });
        
        // Update ScrollTrigger when Locomotive Scroll updates
        ScrollTrigger.addEventListener('refresh', () => scroll.update());
        
        // Refresh ScrollTrigger after setup
        ScrollTrigger.refresh();
    }
}

/**
 * Initialize virtual tour modal
 */
function initVirtualTour() {
    const tourVideo = document.querySelector('.tour-video video');
    
    if (tourVideo) {
        tourVideo.addEventListener('click', () => {
            // Play/pause video on click
            if (tourVideo.paused) {
                tourVideo.play();
            } else {
                tourVideo.pause();
            }
        });
    }
}
