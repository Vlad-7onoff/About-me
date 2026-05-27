function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });
}

function initEmailCopy() {
    const copyButton = document.getElementById('copy-email');
    const emailValue = document.getElementById('email-value');
    
    if (!copyButton || !emailValue) return;
    
    copyButton.addEventListener('click', async () => {
        const email = emailValue.textContent;
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
                showCopySuccess(copyButton);
            } else {
                fallbackCopyText(email);
                showCopySuccess(copyButton);
            }
        } catch (err) {
            console.error('Failed to copy email:', err);
            showCopyError(copyButton);
        }
    });
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        textArea.remove();
    } catch (err) {
        console.error('Fallback copy failed:', err);
        textArea.remove();
        throw err;
    }
}

function showCopySuccess(button) {
    button.classList.add('copied');
    
    setTimeout(() => {
        button.classList.remove('copied');
    }, 2000);
}

function showCopyError(button) {
    const originalText = button.textContent;
    button.textContent = '❌ Error';
    
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

function initTypedEffect() {
    const element = document.querySelector('.home__title .highlight');
    
    if (!element) return;
    
    const originalText = element.textContent;
    const words = [originalText, 'game design', 'prototypes', 'playables'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (!isDeleting && charIndex < currentWord.length) {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, 50);
        } else if (!isDeleting && charIndex === currentWord.length) {
            isPaused = true;
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        }
    }
}

function initFormValidation() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        form.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .loader-content {
            text-align: center;
        }
        .loader-spinner {
            width: 50px;
            height: 50px;
            margin: 0 auto 20px;
            border: 4px solid rgba(172, 167, 250, 0.2);
            border-top-color: var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 300);
    });
}

function initGifLazyLoad() {
    const gifs = document.querySelectorAll('.card__gif, .game__gif, .project__gif');
    
    const gifObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gif = entry.target;
                
                if (gif.hasAttribute('data-src')) {
                    gif.src = gif.getAttribute('data-src');
                    gif.removeAttribute('data-src');
                }
                
                gif.classList.add('loaded');
                gifObserver.unobserve(gif);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    gifs.forEach(gif => gifObserver.observe(gif));
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'light') {
            theme = 'dark';
        } else {
            theme = 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

function initPerformanceMonitoring() {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    });
}

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
            }
        }
    });
}

function initSectionTracking() {
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => sectionObserver.observe(section));
}

function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
        
        if (!link.querySelector('.external-icon')) {
            const icon = document.createElement('span');
            icon.className = 'external-icon';
            icon.textContent = ' ↗';
            icon.style.fontSize = '0.8em';
            link.appendChild(icon);
        }
    });
}

function initEasterEgg() {
    console.log(
        '%c🎮 This is my Portfolio',
        'font-size: 24px; font-weight: bold; color: #ACA7FA;'
    );
    console.log(
        '%cLooking for something?',
        'font-size: 14px; color: #FAC6A7;'
    );
}

function initApp() {
    initMobileMenu();
    initEmailCopy();
    initGifLazyLoad();
    initKeyboardNavigation();
    
    initPerformanceMonitoring();
    initSectionTracking();
    initExternalLinks();
    initEasterEgg();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});