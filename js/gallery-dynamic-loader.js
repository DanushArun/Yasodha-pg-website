// Dynamic Gallery Loader for Swiper
document.addEventListener('DOMContentLoaded', () => {
    let isGalleryInitialized = false;
    
    // Function to load gallery images from server
    async function loadGalleryImages() {
        try {
            // Determine the correct URL based on current location
            const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://127.0.0.1:5001' 
                : '';
            
            const response = await fetch(`${baseUrl}/api/gallery-images`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.images.length > 0) {
                return data.images;
            } else {
                console.warn('No images found in gallery');
                return getDefaultImages();
            }
        } catch (error) {
            console.error('Error loading gallery images:', error);
            // Fallback to default images if API fails
            return getDefaultImages();
        }
    }
    
    // Fallback default images
    function getDefaultImages() {
        // Return images that we know exist in the pg-photos folder
        const defaultImages = [];
        const imageFiles = [
            'WhatsApp Image 2025-05-04 at 10.35.11 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.11.jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.12 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.12 (2).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.12.jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.13 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.13 (2).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.13.jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.14 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.14 (2).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.14.jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.15 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.15 (2).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.15.jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.16 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.16.jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.30.jpeg',
            'WhatsApp Image 2025-05-04 at 10.35.31.jpeg',
            'WhatsApp Image 2025-05-04 at 10.36.55 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.36.55.jpeg',
            'WhatsApp Image 2025-05-04 at 10.37.32.jpeg',
            'WhatsApp Image 2025-05-04 at 10.37.33 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 10.37.33.jpeg',
            'WhatsApp Image 2025-05-04 at 12.24.33 (1).jpeg',
            'WhatsApp Image 2025-05-04 at 12.24.33.jpeg'
        ];
        
        imageFiles.forEach(filename => {
            defaultImages.push({
                url: `pg-photos/${filename}`,
                alt: `Yasodha Residency - ${filename.replace(/WhatsApp Image \d{4}-\d{2}-\d{2} at /, '').replace('.jpeg', '').replace(/[()]/g, '')}`
            });
        });
        
        return defaultImages;
    }
    
    // Function to create slide HTML
    function createSlideHTML(image) {
        return `<img src="${image.url}" 
                     alt="${image.alt}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.style.display='none';">`;
    }
    
    // Function to initialize gallery
    async function initializeGallery() {
        const galleryWrapper = document.getElementById('galleryWrapper');
        const gallerySwiperContainer = document.querySelector('.gallery-swiper');
        
        if (!galleryWrapper || !gallerySwiperContainer || isGalleryInitialized) return;
        
        console.log('Initializing dynamic gallery...');
        
        // Load images
        const images = await loadGalleryImages();
        console.log(`Loaded ${images.length} images for gallery`);
        
        // Clear loading state
        galleryWrapper.innerHTML = '';
        
        if (images.length === 0) {
            galleryWrapper.innerHTML = `
                <div class="swiper-slide">
                    <div class="gallery-loader">
                        <i class="fas fa-image"></i>
                        <p>No images available</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Add image slides
        images.forEach(image => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = createSlideHTML(image);
            galleryWrapper.appendChild(slide);
        });
        
        // Notify gallery-slider.js that images are loaded
        const event = new CustomEvent('galleryImagesLoaded', { 
            detail: { imageCount: images.length } 
        });
        document.dispatchEvent(event);
        
        // Also trigger window resize to ensure Swiper updates
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
        
        isGalleryInitialized = true;
    }
    
    // Wait a bit for other scripts to load, then initialize
    setTimeout(initializeGallery, 500);
    
    // Also initialize when gallery becomes visible
    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isGalleryInitialized) {
                    initializeGallery();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(gallerySection);
    }
});