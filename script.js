let currentIndex = 0;
let galleryElements = [];
let isNavigating = false; // Variable for debouncing

function enlargeMedia(element, event) {
    // Prevent the default behavior of the video playing on click/tap
    if (element.tagName === 'VIDEO' && event) {
        event.preventDefault();
        element.pause();
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');

    // Find all elements in the current gallery (images or videos)
    galleryElements = Array.from(element.parentNode.querySelectorAll('img, video'));
    currentIndex = galleryElements.indexOf(element);

    // Hide both elements initially
    lightboxImage.classList.add('hidden');
    lightboxVideo.classList.add('hidden');

    // Show the appropriate media in the lightbox
    showLightboxContent(galleryElements[currentIndex]);

    // Show the lightbox with fade-in effect
    lightbox.classList.add('visible');
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
        lightboxVideo.src = element.src;
        lightboxVideo.currentTime = element.currentTime;
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.play();
    }
}

function navigateLightbox(direction) {
    // Debounce navigation to prevent rapid changes
    if (isNavigating) return;
    isNavigating = true;

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

    // Allow navigation after a small delay (e.g., 300ms)
    setTimeout(() => {
        isNavigating = false;
    }, 300);
}

function handleKeyNavigation(event) {
    if (event.key === 'ArrowLeft') {
        navigateLightbox(-1);
    }
    if (event.key === 'ArrowRight') {
        navigateLightbox(1);
    }
    if (event.key === 'Escape') {
        closeLightbox();
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');

    // Fade out the lightbox
    lightbox.classList.remove('visible'); // Remove visible class to start fade-out

    // Listen for the transition to finish before hiding
    lightbox.addEventListener('transitionend', function onTransitionEnd() {
        lightbox.style.visibility = 'hidden';
        lightboxImage.src = '';
        lightboxVideo.pause();
        lightboxVideo.src = '';
        document.removeEventListener('keydown', handleKeyNavigation);
        lightbox.removeEventListener('transitionend', onTransitionEnd); // Clean up the event listener
    });
}

const videos = document.querySelectorAll('video');

videos.forEach(video => {
    // Hide controls by default
    video.removeAttribute('controls');

    // Show controls when the mouse hovers over the video or when touch starts
    video.addEventListener('pointerenter', () => {
        video.setAttribute('controls', 'controls');
    });

    // Hide controls when the mouse leaves the video or when touch ends
    video.addEventListener('pointerleave', () => {
        video.removeAttribute('controls');
    });

    // Handle touch events for mobile devices
    video.addEventListener('touchstart', (event) => {
        enlargeMedia(video, event);
    });
});
