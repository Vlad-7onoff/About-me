function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navMenu = document.getElementById('nav-menu');
                const navToggle = document.getElementById('nav-toggle');
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    navToggle.classList.remove('active');
                }
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');
    
    function updateActiveLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition + windowHeight >= docHeight - 50) {
            currentSection = 'contacts';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    let isThrottled = false;
    window.addEventListener('scroll', () => {
        if (!isThrottled) {
            updateActiveLink();
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, 100);
        }
    });
    
    updateActiveLink();
}

function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-fade-in, .animate-fade-up, ' +
        '.animate-slide-left, .animate-slide-right, .animate-scale'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    const sectionsToAnimate = document.querySelectorAll('.section');
    sectionsToAnimate.forEach(section => {
        const elements = section.querySelectorAll(
            '.neo-card, .block__title, .block__text, ' +
            '.section__title, .about__subtitle, .about__description'
        );
        
        elements.forEach(element => {
            if (!element.classList.contains('animated')) {
                observer.observe(element);
            }
        });
    });
}

function initScrollProgress() {
    let progressBar = document.querySelector('.scroll-indicator');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-indicator';
        document.body.appendChild(progressBar);
    }
    
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    }
    
    let isThrottled = false;
    window.addEventListener('scroll', () => {
        if (!isThrottled) {
            updateScrollProgress();
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, 50);
        }
    });
    
    updateScrollProgress();
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    function updateHeaderStyle() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 8px 24px rgba(197, 193, 217, 0.4), 0 -2px 8px rgba(255, 255, 255, 0.8)';
        } else {
            header.style.boxShadow = '0 8px 16px rgba(197, 193, 217, 0.2), 0 -2px 8px rgba(255, 255, 255, 0.8)';
        }
    }
    
    let isThrottled = false;
    window.addEventListener('scroll', () => {
        if (!isThrottled) {
            updateHeaderStyle();
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, 100);
        }
    });
}

function initStaggeredAnimations() {
    const worksGrid = document.querySelector('.works__grid');
    
    if (!worksGrid) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.work-card');
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(worksGrid);
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserverOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0
    };
    
    const imageObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                
                observer.unobserve(img);
            }
        });
    };
    
    const imageObserver = new IntersectionObserver(imageObserverCallback, imageObserverOptions);
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top neo-button';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        z-index: 999;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    function toggleScrollButton() {
        if (window.scrollY > 500) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
    
    window.addEventListener('scroll', toggleScrollButton);
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initScrollFeatures() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initSmoothScroll();
            initActiveNavigation();
            initScrollAnimations();
            initScrollProgress();
            initHeaderScroll();
            initStaggeredAnimations();
            initLazyLoading();
        });
    } else {
        initSmoothScroll();
        initActiveNavigation();
        initScrollAnimations();
        initScrollProgress();
        initHeaderScroll();
        initStaggeredAnimations();
        initLazyLoading();
    }
}

initScrollFeatures();