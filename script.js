let currentIndex = 0;
let galleryElements = [];

function enlargeMedia(element, event) {
    if (element.tagName === 'VIDEO') {
        event.preventDefault();
        element.pause();
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');

    galleryElements = Array.from(element.parentNode.querySelectorAll('img, video'));
    currentIndex = galleryElements.indexOf(element);

    lightboxImage.classList.add('hidden');
    lightboxVideo.classList.add('hidden');

    showLightboxContent(galleryElements[currentIndex]);

    lightbox.style.visibility = 'visible';

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
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = galleryElements.length - 1;
    } else if (currentIndex >= galleryElements.length) {
        currentIndex = 0;
    }

    showLightboxContent(galleryElements[currentIndex]);
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

    lightbox.style.visibility = 'hidden';
    lightboxImage.src = '';
    lightboxVideo.pause();
    lightboxVideo.src = '';

    document.removeEventListener('keydown', handleKeyNavigation);
}

const videos = document.querySelectorAll('video');

videos.forEach(video => {
    video.removeAttribute('controls');

    video.addEventListener('mouseenter', () => {
        video.setAttribute('controls', 'controls');
    });

    video.addEventListener('mouseleave', () => {
        video.removeAttribute('controls');
    });

    video.addEventListener('touchstart', (event) => {
        enlargeMedia(video, event);
    });
});