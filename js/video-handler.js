/**
 * Video Handler - Manages video loading and playback
 * Improves performance and prevents loading issues
 */

document.addEventListener('DOMContentLoaded', () => {
    initVideoHandling();
});

/**
 * Initialize video handling functionality
 */
function initVideoHandling() {
    const videoElements = document.querySelectorAll('video');
    const loadingIndicators = document.querySelectorAll('.video-loading-indicator');
    
    if (videoElements.length === 0) return;
    
    videoElements.forEach((video, index) => {
        const loadingIndicator = loadingIndicators[index];
        const videoParent = video.parentElement;
        const playPauseBtn = videoParent.querySelector('.play-pause-btn');
        const fullscreenBtn = videoParent.querySelector('.fullscreen-btn');
        
        // Only load video when in viewport or close to it
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When video is near or in viewport
                if (entry.isIntersecting) {
                    // Check if there's a source element or if the video has a src attribute
                    const videoSource = video.querySelector('source');
                    
                    if (videoSource && !videoSource.getAttribute('data-loaded')) {
                        // Get the original source URL
                        const originalSrc = videoSource.getAttribute('src');
                        
                        // If there's a loading indicator, show it
                        if (loadingIndicator) {
                            loadingIndicator.style.display = 'flex';
                        }
                        
                        // Load the video in chunks to prevent broken pipe
                        loadVideoInChunks(originalSrc)
                            .then(objectUrl => {
                                // Update source with safely loaded video
                                videoSource.src = objectUrl;
                                videoSource.setAttribute('data-loaded', 'true');
                                video.load();
                                
                                // Hide loading indicator
                                if (loadingIndicator) {
                                    loadingIndicator.style.display = 'none';
                                }
                            })
                            .catch(error => {
                                console.error('Error loading video:', error);
                                // Hide loading indicator and show error
                                if (loadingIndicator) {
                                    loadingIndicator.textContent = 'Video could not be loaded. Try again later.';
                                }
                            });
                    }
                    
                    // Stop observing once loaded
                    observer.disconnect();
                }
            });
        }, {
            root: null,
            rootMargin: '100px 0px',
            threshold: 0.1
        });
        
        // Start observing the video element
        observer.observe(video);
        
        // Add click handler to play/pause
        video.addEventListener('click', togglePlayPause);
        
        // Add custom control handlers
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlayPause);
            
            // Update play/pause button based on video state
            video.addEventListener('play', () => {
                const icon = playPauseBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-pause';
                }
            });
            
            video.addEventListener('pause', () => {
                const icon = playPauseBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-play';
                }
            });
        }
        
        // Fullscreen button
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                toggleFullscreen(video);
            });
        }
        
        // Function to toggle play/pause
        function togglePlayPause() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    });
}

/**
 * Toggle fullscreen for a video element
 * @param {HTMLVideoElement} videoElement - The video element to toggle fullscreen
 */
function toggleFullscreen(videoElement) {
    if (!document.fullscreenElement) {
        if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
        } else if (videoElement.webkitRequestFullscreen) { /* Safari */
            videoElement.webkitRequestFullscreen();
        } else if (videoElement.msRequestFullscreen) { /* IE11 */
            videoElement.msRequestFullscreen();
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

/**
 * Load video in chunks to prevent broken pipe errors
 * @param {string} url - Original video URL
 * @returns {Promise<string>} - Object URL for safely loaded video
 */
async function loadVideoInChunks(url) {
    // Fetch the video with chunks
    const response = await fetch(url);
    const reader = response.body.getReader();
    const contentLength = response.headers.get('Content-Length');
    const chunks = [];
    let receivedLength = 0;
    
    while(true) {
        const {done, value} = await reader.read();
        
        if (done) {
            break;
        }
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Calculate and log progress if needed
        if (contentLength) {
            const progress = Math.round((receivedLength / parseInt(contentLength)) * 100);
            console.log(`Video loading progress: ${progress}%`);
        }
    }
    
    // Combine chunks into a single Uint8Array
    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for(let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
    }
    
    // Create blob and object URL
    const blob = new Blob([chunksAll]);
    return URL.createObjectURL(blob);
}