// Enhanced UI Components for Modern Website

// Testimonials Data
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Tech Enthusiast",
    avatar: "SJ",
    rating: 5,
    text: "Amazing products and even better service! I've been shopping here for over a year and never been disappointed. Fast shipping and great quality."
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Professional Photographer",
    avatar: "MC",
    rating: 5,
    text: "The camera I purchased exceeded my expectations. The team was incredibly helpful in choosing the right equipment for my needs."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Business Owner",
    avatar: "ER",
    rating: 5,
    text: "Excellent customer support and top-notch products. TechStore is my go-to place for all electronics. Highly recommended!"
  }
];

// Trust Badges Data
const TRUST_BADGES = [
  {
    icon: "🔒",
    text: "Secure Payments"
  },
  {
    icon: "🚚",
    text: "Free Shipping Over $100"
  },
  {
    icon: "↩️",
    text: "30-Day Returns"
  },
  {
    icon: "✓",
    text: "Verified Products"
  },
  {
    icon: "⭐",
    text: "5-Star Reviews"
  }
];

// Stats Data
const STATS = [
  {
    number: "10,000+",
    label: "Happy Customers"
  },
  {
    number: "500+",
    label: "Products"
  },
  {
    number: "98%",
    label: "Satisfaction Rate"
  },
  {
    number: "24/7",
    label: "Support"
  }
];

// Render Promo Banner
function renderPromoBanner() {
  const banner = document.createElement('div');
  banner.className = 'promo-banner';
  banner.innerHTML = `
    <div class="container">
      <span class="promo-text">🎉 Special Offer: Get 20% OFF on your first order!</span>
      <span class="promo-code">Use code: <strong>WELCOME20</strong></span>
    </div>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
}

// Render Testimonials Section
function renderTestimonials() {
  const section = document.createElement('section');
  section.className = 'testimonials-section';
  section.innerHTML = `
    <div class="container">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 class="section-title">What Our Customers Say</h2>
        <p style="color: var(--gray-600); max-width: 600px; margin: 1rem auto;">
          Don't just take our word for it. Here's what our satisfied customers have to say about us.
        </p>
      </div>
      <div class="testimonials-grid">
        ${TESTIMONIALS.map(testimonial => `
          <div class="testimonial-card">
            <div class="testimonial-rating">
              ${'⭐'.repeat(testimonial.rating)}
            </div>
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-author">
              <div class="author-avatar">${testimonial.avatar}</div>
              <div class="author-info">
                <div class="author-name">${testimonial.name}</div>
                <div class="author-title">${testimonial.title}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return section;
}

// Render Trust Badges
function renderTrustBadges() {
  const section = document.createElement('section');
  section.className = 'trust-section';
  section.innerHTML = `
    <div class="container">
      <div class="trust-grid">
        ${TRUST_BADGES.map(badge => `
          <div class="trust-badge">
            <div class="trust-icon">${badge.icon}</div>
            <div class="trust-text">${badge.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return section;
}

// Render Stats Section
function renderStats() {
  const section = document.createElement('section');
  section.className = 'stats-section';
  section.innerHTML = `
    <div class="container">
      <div class="stats-grid">
        ${STATS.map(stat => `
          <div class="stat-card">
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return section;
}

// Render Newsletter Section
function renderNewsletter() {
  const section = document.createElement('section');
  section.className = 'newsletter-section';
  section.innerHTML = `
    <div class="container">
      <div class="newsletter-content">
        <h2 class="newsletter-title">Stay Updated</h2>
        <p class="newsletter-subtitle">
          Subscribe to our newsletter for exclusive deals, new arrivals, and tech tips!
        </p>
        <form class="newsletter-form" onsubmit="handleNewsletterSubmit(event)">
          <input 
            type="email" 
            class="newsletter-input" 
            placeholder="Enter your email address"
            required
          />
          <button type="submit" class="newsletter-btn">Subscribe</button>
        </form>
      </div>
    </div>
  `;
  return section;
}

// Handle Newsletter Submit
function handleNewsletterSubmit(event) {
  event.preventDefault();
  const email = event.target.querySelector('input').value;
  toast.success(`Thank you for subscribing! We'll send updates to ${email}`);
  event.target.reset();
}

// Add Scroll Reveal Animation
function addScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
}

// Add Floating Elements to Hero
function addFloatingElements() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  for (let i = 0; i < 3; i++) {
    const element = document.createElement('div');
    element.className = 'hero-floating-element';
    element.innerHTML = `
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="white" opacity="0.1"/>
      </svg>
    `;
    hero.appendChild(element);
  }
}

// Add Scroll Indicator
function addScrollIndicator() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  `;
  indicator.onclick = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  hero.appendChild(indicator);
}

// Initialize Enhanced Features
function initEnhancements() {
  // Check if we're on the home page
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname === '/' ||
                     window.location.pathname.endsWith('/');
  
  if (!isHomePage) return;
  
  // Add promo banner
  renderPromoBanner();
  
  // Find the main content area to add sections
  const mainContent = document.querySelector('main') || document.body;
  
  // Add sections before footer
  const footer = document.getElementById('footer');
  if (footer) {
    // Insert testimonials
    footer.parentNode.insertBefore(renderTestimonials(), footer);
    
    // Insert trust badges
    footer.parentNode.insertBefore(renderTrustBadges(), footer);
    
    // Insert newsletter
    footer.parentNode.insertBefore(renderNewsletter(), footer);
  }
  
  // Add visual enhancements
  addFloatingElements();
  addScrollIndicator();
  addScrollReveal();
  
  // Add navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// Add smooth scroll for all anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
  initEnhancements();
}
