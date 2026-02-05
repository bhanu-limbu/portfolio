/* ==========================================
   THEME TOGGLE FUNCTIONALITY
   ========================================== */

// Get theme from localStorage or default to light
const getTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
};

// Set theme on document
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// Initialize theme on page load
const initTheme = () => {
    const currentTheme = getTheme();
    setTheme(currentTheme);
};

// Toggle theme function
const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
};

// Theme toggle button event listener
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

/* ==========================================
   MOBILE NAVIGATION
   ========================================== */

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
};

// Close mobile menu when clicking nav link
const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
};

// Event listeners
if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

/* ==========================================
   SMOOTH SCROLLING
   ========================================== */

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for non-section links
        if (href === '#') {
            return;
        }
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ==========================================
   NAVBAR SCROLL EFFECT
   ========================================== */

const navbar = document.getElementById('navbar');
let lastScroll = 0;

const handleNavbarScroll = () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
};

window.addEventListener('scroll', handleNavbarScroll);

/* ==========================================
   ACTIVE NAVIGATION LINK
   ========================================== */

const sections = document.querySelectorAll('section[id]');

const highlightNavigation = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', highlightNavigation);

/* ==========================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ========================================== */

// Create intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe elements for animation
const observeElements = () => {
    const elementsToAnimate = document.querySelectorAll('.skill-card, .project-card, .about-text, .resume-block, .contact-info-centered');
    
    elementsToAnimate.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Observe element
        observer.observe(element);
    });
};

/* ==========================================
   SCROLL TO TOP BUTTON
   ========================================== */

// Create scroll to top button (optional enhancement)
const createScrollToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--accent-primary);
        color: var(--bg-primary);
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: var(--shadow-md);
    `;
    
    // Show/hide based on scroll position
    const toggleButton = () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    };
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
    
    window.addEventListener('scroll', toggleButton);
    document.body.appendChild(button);
};

/* ==========================================
   INITIALIZATION
   ========================================== */

// Initialize all features when DOM is loaded
const init = () => {
    initTheme();
    observeElements();
    createScrollToTopButton();
    
    // Add loaded class to body for any additional animations
    document.body.classList.add('loaded');
};

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ==========================================
   PERFORMANCE OPTIMIZATIONS
   ========================================== */

// Debounce function for performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Optimize scroll event listeners
window.addEventListener('scroll', throttle(highlightNavigation, 100));
window.addEventListener('scroll', throttle(handleNavbarScroll, 100));

/* ==========================================
   CONSOLE MESSAGE (Optional Easter Egg)
   ========================================== */

console.log('%c👋 Hello, curious developer!', 'font-size: 20px; font-weight: bold; color: #b45309;');
console.log('%cLike what you see? Let\'s work together!', 'font-size: 14px; color: #57534e;');
console.log('%c📧 your.email@example.com', 'font-size: 12px; color: #78716c;');