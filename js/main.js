/**
 * Haber Gündem - Main JavaScript
 * Premium interactions and smooth UX
 */

(function () {
    'use strict';

    // ============================================
    // THEME TOGGLE
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Load saved theme or use system preference
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (!prefersDark.matches) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    loadTheme();

    // ============================================
    // CURRENT DATE
    // ============================================
    const dateElement = document.getElementById('currentDate');

    function updateDate() {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const now = new Date();
        const formattedDate = now.toLocaleDateString('tr-TR', options);
        if (dateElement) {
            dateElement.textContent = formattedDate;
        }
    }

    updateDate();

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.classList.add('scrolled');

            if (currentScrollY > lastScrollY) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('scrolled', 'hidden');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============================================
    // BREAKING NEWS TICKER - DUPLICATE FOR INFINITE SCROLL
    // ============================================
    const ticker = document.querySelector('.ticker');

    if (ticker) {
        // Clone content for seamless loop
        ticker.innerHTML += ticker.innerHTML;
    }

    // ============================================
    // NEWSLETTER FORM HANDLING
    // ============================================
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Show success message
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = '✓ Abone Olundu!';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                this.reset();
            }, 3000);
        });
    }

    // ============================================
    // SHARE BUTTONS
    // ============================================
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl = '';

            if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            } else if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (this.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            } else if (this.classList.contains('whatsapp')) {
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.news-card, .news-list-item, .sidebar-widget').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .header.scrolled {
            background: rgba(10, 10, 15, 0.95);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }
        [data-theme="light"] .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .header.hidden {
            transform: translateY(-100%);
        }
        .header {
            transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // READING PROGRESS BAR (for article pages)
    // ============================================
    const articleContent = document.querySelector('.article-content');

    if (articleContent) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);

        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: var(--bg-tertiary);
                z-index: 9999;
            }
            .progress-fill {
                height: 100%;
                background: var(--accent-gradient);
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(progressStyle);

        const progressFill = progressBar.querySelector('.progress-fill');

        function updateProgress() {
            const articleRect = articleContent.getBoundingClientRect();
            const articleTop = articleRect.top + window.scrollY;
            const articleHeight = articleRect.height;
            const windowHeight = window.innerHeight;
            const scrolled = window.scrollY - articleTop + windowHeight;
            const progress = Math.min(Math.max(scrolled / articleHeight * 100, 0), 100);
            progressFill.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ============================================
    // IMAGE LAZY LOADING FALLBACK
    // ============================================
    if (!('loading' in HTMLImageElement.prototype)) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    lazyObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyObserver.observe(img));
    }

    // ============================================
    // COPY LINK TO CLIPBOARD
    // ============================================
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Link kopyalandı!');
            });
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 9999;
            animation: toastIn 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes toastIn {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
    `;
    document.head.appendChild(toastStyle);

    // ============================================
    // SEARCH FUNCTIONALITY (Placeholder)
    // ============================================
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            // Could open a search modal
            showToast('Arama özelliği yakında!');
        });
    }

    // ============================================
    // PRINT ARTICLE
    // ============================================
    window.printArticle = function () {
        window.print();
    };

    console.log('🗞️ Haber Gündem - Premium News Portal Initialized');
})();
