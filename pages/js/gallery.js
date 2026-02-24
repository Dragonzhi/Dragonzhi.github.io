document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const docElement = document.documentElement;

    if (docElement.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        docElement.classList.toggle('dark-mode');

        if (docElement.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    AOS.init({
        duration: 800,
        once: true,
        offset: 50
    });

    async function loadGalleryImages() {
        try {
            const response = await fetch('../images/gallery-images.json');
            const images = await response.json();
            
            const gallery = document.getElementById('gallery');
            
            images.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.setAttribute('data-aos', 'fade-up');
                galleryItem.setAttribute('data-aos-delay', (index * 100).toString());
                
                galleryItem.innerHTML = `
                    <img src="../images/画廊/${image.filename}" alt="${image.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <h3>${image.title}</h3>
                            <p>${image.description}</p>
                        </div>
                        <button class="zoom-btn" aria-label="放大查看">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                `;
                
                gallery.appendChild(galleryItem);
            });

            initLightbox();
        } catch (error) {
            console.error('加载画廊图片失败:', error);
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '<p style="text-align: center; color: var(--text-secondary-color);">加载图片失败，请刷新页面重试。</p>';
        }
    }

    function initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightboxContent() {
            const item = galleryItems[currentIndex];
            const img = item.querySelector('img');
            const info = item.querySelector('.gallery-info');
            
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.querySelector('h3').textContent = info.querySelector('h3').textContent;
            lightboxCaption.querySelector('p').textContent = info.querySelector('p').textContent;
        }

        function showNextImage() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightboxContent();
        }

        function showPrevImage() {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxContent();
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', showNextImage);
        lightboxPrev.addEventListener('click', showPrevImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        });
    }

    loadGalleryImages();

    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});