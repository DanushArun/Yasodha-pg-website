/**
 * Gallery Loader - Dynamically populates the gallery with media files
 * Uses the categories defined in media-categories.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the gallery with media items
    initGalleryItems();
    
    // Add loading spinner to the gallery grid
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'gallery-loading';
        loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading gallery...</span>';
        galleryGrid.appendChild(loadingSpinner);
    }
});

/**
 * Initialize gallery with items from media categories
 */
function initGalleryItems() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid || !mediaCategories) return;
    
    // Clear existing gallery items
    galleryGrid.innerHTML = '';
    
    // Add all items from each category
    let allItems = [];
    
    // Process rooms category
    if (mediaCategories.rooms) {
        mediaCategories.rooms.forEach(item => {
            allItems.push(createGalleryItem(item, 'rooms'));
        });
    }
    
    // Process dining category
    if (mediaCategories.dining) {
        mediaCategories.dining.forEach(item => {
            allItems.push(createGalleryItem(item, 'dining'));
        });
    }
    
    // Process common areas category
    if (mediaCategories.common) {
        mediaCategories.common.forEach(item => {
            allItems.push(createGalleryItem(item, 'common'));
        });
    }
    
    // Process exterior category
    if (mediaCategories.exterior) {
        mediaCategories.exterior.forEach(item => {
            allItems.push(createGalleryItem(item, 'exterior'));
        });
    }
    
    // Process facilities category
    if (mediaCategories.facilities) {
        mediaCategories.facilities.forEach(item => {
            allItems.push(createGalleryItem(item, 'facilities'));
        });
    }
    
    // Process surroundings category
    if (mediaCategories.surroundings) {
        mediaCategories.surroundings.forEach(item => {
            allItems.push(createGalleryItem(item, 'surroundings'));
        });
    }
    
    // Process special category
    if (mediaCategories.special) {
        mediaCategories.special.forEach(item => {
            allItems.push(createGalleryItem(item, 'special'));
        });
    }
    
    // Count total images for loading indicator
    const totalImages = allItems.length;
    let loadedImages = 0;
    
    // Add all items to the gallery grid
    allItems.forEach(item => {
        galleryGrid.appendChild(item);
        
        // Track image loading
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    // All images loaded, remove loading indicator
                    const loadingIndicator = document.querySelector('.gallery-loading');
                    if (loadingIndicator) {
                        loadingIndicator.remove();
                    }
                    
                    // Apply fade-in animation to all items
                    allItems.forEach(item => {
                        item.classList.add('loaded');
                    });
                }
            });
            
            // Handle failed loads
            img.addEventListener('error', () => {
                loadedImages++;
                item.classList.add('load-error');
                item.innerHTML = '<div class="error-message">Image Failed to Load</div>';
            });
        }
    });
    
    // Update the virtual tour video if available
    updateVirtualTour();
}

/**
 * Create a gallery item element
 * @param {Object} item - The media item data
 * @param {string} category - The category of the item
 * @returns {HTMLElement} - The gallery item element
 */
function createGalleryItem(item, category) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.category = category;
    galleryItem.dataset.title = item.title;
    galleryItem.dataset.description = item.description;
    
    // Create skeleton loader
    const skeletonLoader = document.createElement('div');
    skeletonLoader.className = 'item-skeleton';
    galleryItem.appendChild(skeletonLoader);
    
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    img.loading = 'lazy'; // Add lazy loading for better performance
    
    // Hide the image until loaded
    img.style.opacity = '0';
    
    // Show image when loaded
    img.onload = () => {
        skeletonLoader.style.display = 'none';
        img.style.opacity = '1';
    };
    
    galleryItem.appendChild(img);
    
    return galleryItem;
}

/**
 * Update the virtual tour video with the first video from the videos category
 */
function updateVirtualTour() {
    if (!mediaCategories.videos || mediaCategories.videos.length === 0) return;
    
    const videoElement = document.querySelector('.tour-video video');
    if (!videoElement) return;
    
    const videoSource = videoElement.querySelector('source');
    if (!videoSource) return;
    
    const firstVideo = mediaCategories.videos[0];
    
    // Update video source
    videoSource.src = firstVideo.src;
    
    // Update poster if available
    if (firstVideo.poster) {
        videoElement.poster = firstVideo.poster;
    }
    
    // Reload the video to apply changes
    videoElement.load();
}