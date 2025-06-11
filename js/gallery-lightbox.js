// Gallery Lightbox Functionality
document.addEventListener('DOMContentLoaded', () => {
    let galleryImages = [];
    let currentImageIndex = 0;
    
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const currentImageSpan = document.getElementById('currentImage');
    const totalImagesSpan = document.getElementById('totalImages');
    
    // Function to update gallery images array
    function updateGalleryImages() {
        const images = document.querySelectorAll('.gallery-section .swiper-slide img');
        galleryImages = Array.from(images).map(img => ({
            src: img.src,
            alt: img.alt
        }));
        if (totalImagesSpan) {
            totalImagesSpan.textContent = galleryImages.length;
        }
    }
    
    // Function to update counter
    function updateCounter() {
        if (currentImageSpan) {
            currentImageSpan.textContent = currentImageIndex + 1;
        }
    }
    
    // Function to show image at specific index
    function showImage(index) {
        if (galleryImages.length === 0) return;
        
        // Wrap around if necessary
        if (index < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (index >= galleryImages.length) {
            currentImageIndex = 0;
        } else {
            currentImageIndex = index;
        }
        
        const image = galleryImages[currentImageIndex];
        if (lightboxImage && image) {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || 'Gallery Image';
            updateCounter();
        }
    }
    
    // Function to open lightbox
    function openLightbox(imageSrc, imageAlt) {
        if (lightbox && lightboxImage) {
            // Find the index of the clicked image
            const index = galleryImages.findIndex(img => img.src === imageSrc);
            if (index !== -1) {
                currentImageIndex = index;
            }
            
            showImage(currentImageIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        }
    }
    
    // Function to close lightbox
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            // Clear image source after animation
            setTimeout(() => {
                if (lightboxImage) {
                    lightboxImage.src = '';
                }
            }, 300);
        }
    }
    
    // Navigate to previous image
    function previousImage() {
        showImage(currentImageIndex - 1);
    }
    
    // Navigate to next image
    function nextImage() {
        showImage(currentImageIndex + 1);
    }
    
    // Initialize gallery images
    updateGalleryImages();
    
    // Add click event to navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            previousImage();
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });
    }
    
    // Close lightbox when clicking the close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Handle dynamic gallery images (for Swiper slides that are created dynamically)
    const observeGallery = () => {
        const galleryContainer = document.querySelector('.gallery-section .swiper-wrapper');
        if (galleryContainer) {
            const observer = new MutationObserver(() => {
                // Update gallery images array
                updateGalleryImages();
                
                // Re-query gallery images and add click events
                const newImages = document.querySelectorAll('.gallery-section .swiper-slide img');
                newImages.forEach(img => {
                    // Remove existing listener to avoid duplicates
                    img.removeEventListener('click', imageClickHandler);
                    img.addEventListener('click', imageClickHandler);
                });
            });
            
            observer.observe(galleryContainer, {
                childList: true,
                subtree: true
            });
        }
    };
    
    // Image click handler
    function imageClickHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(this.src, this.alt);
    }
    
    // Add initial click events to gallery images
    const addClickEvents = () => {
        const images = document.querySelectorAll('.gallery-section .swiper-slide img');
        images.forEach(img => {
            img.addEventListener('click', imageClickHandler);
        });
    };
    
    // Initialize
    addClickEvents();
    observeGallery();
    
    // Re-initialize when gallery images are loaded dynamically
    document.addEventListener('galleryImagesLoaded', () => {
        setTimeout(() => {
            updateGalleryImages();
            addClickEvents();
        }, 200);
    });
});