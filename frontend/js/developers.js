// Developers Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Render navbar and footer
    renderNavbar();
    renderFooter();
    
    // Initialize components
    initNavigation();
    initAnimations();
    initSmoothScroll();
    initMetricsAnimation();
});

// Initialize navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Update cart badge
    updateCartBadge();

    // Update profile link based on auth status
    updateProfileLink();
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

// Update profile link based on authentication status
function updateProfileLink() {
    const profileLink = document.getElementById('profileLink');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (profileLink) {
        if (user) {
            profileLink.href = 'profile.html';
            profileLink.innerHTML = `<span style="color: #2563eb;">●</span> Profile`;
        } else {
            profileLink.href = 'login.html';
            profileLink.textContent = 'Login';
        }
    }
}

// Initialize scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards, tech items, and API groups
    const animatedElements = document.querySelectorAll(
        '.feature-card, .arch-layer, .tech-category, .api-group, .metric-card, .setup-step'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate metrics on scroll
function initMetricsAnimation() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.metric-fill');
                if (fill) {
                    // Trigger animation by adding a class
                    setTimeout(() => {
                        fill.style.transition = 'width 1.5s ease-out';
                    }, 200);
                }
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    metricCards.forEach(card => {
        metricsObserver.observe(card);
    });
}

// Copy code to clipboard
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
}

// Add copy buttons to code blocks (optional enhancement)
document.querySelectorAll('.code-block').forEach(block => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.textContent = 'Copy';
    copyButton.onclick = function() { copyCode(this); };
    
    // Style the copy button
    copyButton.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 6px 12px;
        background: rgba(37, 99, 235, 0.8);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
    `;
    
    block.style.position = 'relative';
    block.appendChild(copyButton);
});

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// Add interactive hover effects
document.querySelectorAll('.api-endpoint').forEach(endpoint => {
    endpoint.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(4px)';
    });
    
    endpoint.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Progress bar animation on scroll
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.metric-fill');
    
    progressBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }
    });
}

window.addEventListener('scroll', animateProgressBars);
animateProgressBars(); // Run on load

// Add floating animation to hero badge
const heroBadge = document.querySelector('.dev-hero-badge');
if (heroBadge) {
    setInterval(() => {
        heroBadge.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            heroBadge.style.transform = 'translateY(0)';
        }, 500);
    }, 2000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.dev-hero-content');
    
    if (heroContent && scrolled < 500) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }
});

console.log('Developers page initialized successfully');
