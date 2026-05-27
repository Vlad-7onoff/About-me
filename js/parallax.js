
const PARALLAX_CONFIG = {
    enabled: true,
    smoothness: 0.1,
    maxOffset: 100,
};

function shouldEnableParallax() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return PARALLAX_CONFIG.enabled && !prefersReducedMotion;
}

class ParallaxElement {
    constructor(element) {
        this.element = element;
        this.speed = parseFloat(element.getAttribute('data-parallax')) || 0.1;
        this.initialOffset = 0;
        this.currentOffset = 0;
        this.targetOffset = 0;
        
        this.element.classList.add('parallax-element');
        this.updateInitialPosition();
    }
    
    updateInitialPosition() {
        const rect = this.element.getBoundingClientRect();
        this.initialOffset = rect.top + window.scrollY;
    }
    
    update(scrollY, windowHeight) {
        const elementTop = this.initialOffset;
        const elementVisible = (scrollY + windowHeight) > elementTop && scrollY < (elementTop + this.element.offsetHeight);
        
        if (elementVisible) {
            const scrollProgress = scrollY + windowHeight - elementTop;
            this.targetOffset = scrollProgress * this.speed;
            this.targetOffset = Math.max(-PARALLAX_CONFIG.maxOffset, 
                                        Math.min(PARALLAX_CONFIG.maxOffset, this.targetOffset));
        }
    }
    
    render() {
        this.currentOffset += (this.targetOffset - this.currentOffset) * PARALLAX_CONFIG.smoothness;
        this.element.style.transform = `translateY(${this.currentOffset}px)`;
    }
}

class ParallaxManager {
    constructor() {
        this.elements = [];
        this.scrollY = window.scrollY;
        this.windowHeight = window.innerHeight;
        this.isRunning = false;
        this.rafId = null;
        
        this.init();
    }
    
    init() {
        if (!shouldEnableParallax()) {
            console.log('Parallax disabled: reduced motion preference');
            return;
        }
        
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            this.elements.push(new ParallaxElement(element));
        });
        
        if (this.elements.length > 0) {
            this.start();
            this.bindEvents();
        }
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        }, { passive: true });
        
        window.addEventListener('resize', () => {
            this.windowHeight = window.innerHeight;
            
            if (!shouldEnableParallax()) {
                this.stop();
            } else if (!this.isRunning) {
                this.start();
            }
        });
        
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.elements.forEach(el => el.updateInitialPosition());
            }, 250);
        });
    }
    
    update() {
        this.elements.forEach(element => {
            element.update(this.scrollY, this.windowHeight);
        });
    }
    
    render() {
        this.elements.forEach(element => {
            element.render();
        });
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        this.rafId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}

class MouseParallax {
    constructor(selector = '.home__block') {
        this.elements = document.querySelectorAll(selector);
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isRunning = false;
        
        if (this.elements.length > 0 && shouldEnableParallax()) {
            this.init();
        }
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
        
        this.start();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.currentX += (this.mouseX - this.currentX) * 0.1;
        this.currentY += (this.mouseY - this.currentY) * 0.1;
        
        this.elements.forEach((element, index) => {
            const intensity = (index + 1) * 5;
            const x = this.currentX * intensity;
            const y = this.currentY * intensity;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
    }
}

function initImageParallax() {
    if (!shouldEnableParallax()) return;
    
}

function initCardTilt() {
    return;
}

function createParallaxBackground() {
    if (!shouldEnableParallax()) return;
    
    const homeSection = document.querySelector('.home');
    
    if (!homeSection) return;
    
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'parallax-shape';
        shape.setAttribute('data-parallax', (0.05 + i * 0.02).toString());
        
        shape.style.cssText = `
            position: absolute;
            width: ${50 + i * 30}px;
            height: ${50 + i * 30}px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(172, 167, 250, 0.1), rgba(250, 198, 167, 0.1));
            top: ${Math.random() * 80}%;
            left: ${Math.random() * 90}%;
            pointer-events: none;
            z-index: -1;
        `;
        
        homeSection.appendChild(shape);
    }
}

let parallaxManager = null;
let mouseParallax = null;

function initParallax() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            startParallax();
        });
    } else {
        startParallax();
    }
}

function startParallax() {
    parallaxManager = new ParallaxManager();
    mouseParallax = new MouseParallax('.home__block');
    
    initImageParallax();
    initCardTilt();
}

initParallax();

window.addEventListener('beforeunload', () => {
    if (parallaxManager) {
        parallaxManager.stop();
    }
    if (mouseParallax) {
        mouseParallax.stop();
    }
});