let currentIndex = 0;
let galleryElements = [];

document.querySelectorAll('.gallery video').forEach((video) => {
    video.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent the default play behavior
        enlargeMedia(video);
    });
});

function enlargeMedia(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');

    // Find all elements in the current gallery (either photos or videos)
    galleryElements = Array.from(element.parentNode.querySelectorAll('img, video'));
    currentIndex = galleryElements.indexOf(element);

    // Hide both elements initially
    lightboxImage.classList.add('hidden');
    lightboxVideo.classList.add('hidden');

    // Show the appropriate media in the lightbox
    showLightboxContent(galleryElements[currentIndex]);

    // Show the lightbox
    lightbox.style.visibility = 'visible';

    // Add event listeners for arrow key navigation
    document.addEventListener('keydown', handleKeyNavigation);
}

function showLightboxContent(element) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');

    if (element.tagName === 'IMG') {
        lightboxImage.src = element.src;
        lightboxImage.classList.remove('hidden');
    } else if (element.tagName === 'VIDEO') {
        element.pause();  // Pause the background video immediately
        lightboxVideo.src = element.currentSrc;
        lightboxVideo.currentTime = element.currentTime;
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.play();  // Automatically play the video in the lightbox
    }
}

function navigateLightbox(direction) {
    // Update the index based on direction (-1 for left, +1 for right)
    currentIndex += direction;

    // Loop back if out of bounds
    if (currentIndex < 0) {
        currentIndex = galleryElements.length - 1;
    } else if (currentIndex >= galleryElements.length) {
        currentIndex = 0;
    }

    // Show the next or previous media
    showLightboxContent(galleryElements[currentIndex]);
}

function handleKeyNavigation(event) {
    // Navigate left with the left arrow key
    if (event.key === 'ArrowLeft') {
        navigateLightbox(-1);
    }
    // Navigate right with the right arrow key
    if (event.key === 'ArrowRight') {
        navigateLightbox(1);
    }
    // Close the lightbox with the Escape key
    if (event.key === 'Escape') {
        closeLightbox();
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');

    // Hide the lightbox and clear the media sources
    lightbox.style.visibility = 'hidden';
    lightboxImage.src = '';
    lightboxVideo.pause();  // Stop the video from playing
    lightboxVideo.src = '';

    // Remove event listeners for arrow key navigation when closing the lightbox
    document.removeEventListener('keydown', handleKeyNavigation);
}