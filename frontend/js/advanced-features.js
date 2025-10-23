

// ========================================
// 1. WISHLIST FEATURE
// ========================================

const Wishlist = {
  // Get user-specific wishlist key
  getWishlistKey: () => {
    const user = Auth.getUser();
    return user ? `wishlist_${user.id}` : 'wishlist_guest';
  },

  // Get wishlist from localStorage
  getWishlist: () => {
    const key = Wishlist.getWishlistKey();
    return JSON.parse(localStorage.getItem(key) || "[]");
  },

  // Save wishlist to localStorage
  saveWishlist: (wishlist) => {
    const key = Wishlist.getWishlistKey();
    localStorage.setItem(key, JSON.stringify(wishlist));
    Wishlist.updateBadge();
    return wishlist;
  },

  // Add or remove product from wishlist
  toggle: (productId) => {
    console.log("Toggling wishlist for product:", productId);

    const wishlist = Wishlist.getWishlist();
    const index = wishlist.findIndex((id) => id === productId);
    const isInWishlist = index !== -1;

    if (isInWishlist) {
      wishlist.splice(index, 1);
      console.log("Removed from wishlist");
      Wishlist.showToast("Removed from wishlist", "info");
    } else {
      wishlist.push(productId);
      console.log("Added to wishlist");
      Wishlist.showToast("Added to wishlist", "success");
    }

    // Save the updated wishlist
    Wishlist.saveWishlist(wishlist);
    console.log("Wishlist saved:", wishlist);

    // Update all wishlist buttons for this product
    const buttons = document.querySelectorAll(
      `.wishlist-icon-btn[data-product-id="${productId}"]`
    );
    console.log("Found buttons to update:", buttons.length);

    buttons.forEach((button) => {
      const wasAdded = !isInWishlist;
      button.classList.toggle("active", wasAdded);
      const icon = button.querySelector("svg");
      if (icon) {
        icon.style.fill = wasAdded ? "#ef4444" : "none";
        icon.style.stroke = wasAdded ? "#ef4444" : "currentColor";
      }

      // Update button text if it exists
      const buttonText = button.querySelector("span") || button;
      if (buttonText && buttonText.textContent.includes("Wishlist")) {
        buttonText.textContent = wasAdded
          ? "Remove from Wishlist"
          : "Add to Wishlist";
      }
    });

    // Update the badge count
    Wishlist.updateBadge();
    console.log("Badge updated, count:", wishlist.length);

    // Dispatch custom event to notify about wishlist update
    document.dispatchEvent(new CustomEvent("wishlistUpdated"));

    // If we're on the wishlist page and item was removed, refresh the view
    if (window.location.pathname.includes("wishlist.html") && isInWishlist) {
      const event = new CustomEvent("wishlistRemoved", {
        detail: { productId },
      });
      document.dispatchEvent(event);
    }

    return !isInWishlist; // Return new state
  },

  // Check if product is in wishlist
  hasProduct: (productId) => Wishlist.getWishlist().includes(productId),

  // Update wishlist badge count
  updateBadge: () => {
    const badge = document.querySelector(".wishlist-badge");
    if (!badge) return;

    const count = Wishlist.getWishlist().length;
    badge.textContent = count > 0 ? count : "";
    badge.style.display = count > 0 ? "flex" : "none";
  },

  // Show toast notification
  showToast: (message, type = "info") => {
    // Create toast container if it doesn't exist
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    // Icon SVGs for different types
    const icons = {
      success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`,
      error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`,
      info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`,
      warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`
    };

    const colors = {
      success: { bg: "#10b981", border: "#059669", shadow: "rgba(16, 185, 129, 0.4)" },
      error: { bg: "#ef4444", border: "#dc2626", shadow: "rgba(239, 68, 68, 0.4)" },
      info: { bg: "#3b82f6", border: "#2563eb", shadow: "rgba(59, 130, 246, 0.4)" },
      warning: { bg: "#f59e0b", border: "#d97706", shadow: "rgba(245, 158, 11, 0.4)" }
    };

    const color = colors[type] || colors.info;
    const icon = icons[type] || icons.info;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="flex-shrink: 0; color: white;">
          ${icon}
        </div>
        <div style="flex: 1; color: white; font-weight: 500; font-size: 0.95rem; line-height: 1.4;">
          ${message}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          margin-left: 0.5rem;
          opacity: 0.8;
          transition: opacity 0.2s;
          flex-shrink: 0;
        " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div style="
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        width: 100%;
        border-radius: 0 0 10px 10px;
        overflow: hidden;
      ">
        <div class="toast-progress" style="
          height: 100%;
          background: rgba(255, 255, 255, 0.6);
          width: 100%;
          animation: toast-progress 3s linear;
        "></div>
      </div>
    `;
    
    toast.style.cssText = `
      position: relative;
      padding: 1rem 1.25rem;
      padding-bottom: 1.25rem;
      border-radius: 10px;
      background: ${color.bg};
      border-left: 4px solid ${color.border};
      box-shadow: 0 10px 25px ${color.shadow}, 0 4px 10px rgba(0, 0, 0, 0.15);
      min-width: 300px;
      max-width: 400px;
      opacity: 0;
      transform: translateX(400px);
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      pointer-events: auto;
      cursor: pointer;
    `;

    // Add progress bar animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes toast-progress {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    if (!document.querySelector('style[data-toast-animation]')) {
      style.setAttribute('data-toast-animation', 'true');
      document.head.appendChild(style);
    }

    container.appendChild(toast);

    // Trigger slide-in animation
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(400px)";
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    });

    // Click to dismiss
    toast.addEventListener('click', () => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(400px)";
      setTimeout(() => toast.remove(), 400);
    });
  },

  // Initialize wishlist functionality
  init: () => {
    console.log("Wishlist initializing...");

    // Ensure localStorage has wishlist
    if (!localStorage.getItem("wishlist")) {
      localStorage.setItem("wishlist", JSON.stringify([]));
    }

    // Update badge on page load
    Wishlist.updateBadge();

    // Remove any existing listeners to prevent duplicates
    const existingListener = document._wishlistListener;
    if (existingListener) {
      document.removeEventListener("click", existingListener);
    }

    // Create new listener
    const wishlistClickHandler = (e) => {
      const wishlistBtn = e.target.closest(".wishlist-icon-btn");
      if (!wishlistBtn) return;

      e.preventDefault();
      e.stopPropagation();

      const productId = wishlistBtn.dataset.productId;
      if (!productId) {
        console.error("No product ID found");
        return;
      }

      console.log("Wishlist button clicked for product:", productId);

      // The toggle method will handle the UI updates
      Wishlist.toggle(productId);
    };

    // Store reference and add listener
    document._wishlistListener = wishlistClickHandler;
    document.addEventListener("click", wishlistClickHandler);

    console.log("Wishlist initialized successfully");
  },
};

// Initialize Wishlist immediately when script loads
if (typeof Wishlist !== "undefined") {
  // Initialize localStorage if needed
  if (!localStorage.getItem("wishlist")) {
    localStorage.setItem("wishlist", JSON.stringify([]));
  }
  console.log("Wishlist object ready");
}

// ========================================
// 2. PRODUCT COMPARISON
// ========================================

class ProductComparison {
  constructor() {
    this.key = 'techstore_comparison';
    this.maxProducts = 4;
  }

  getAll() {
    return storage.get(this.key) || [];
  }

  add(productId) {
    const comparison = this.getAll();
    
    if (comparison.length >= this.maxProducts) {
      toast.warning(`You can only compare up to ${this.maxProducts} products`);
      return false;
    }
    
    if (!comparison.includes(productId)) {
      comparison.push(productId);
      storage.set(this.key, comparison);
      toast.success('Added to comparison');
      return true;
    }
    return false;
  }

  remove(productId) {
    let comparison = this.getAll();
    comparison = comparison.filter(id => id !== productId);
    storage.set(this.key, comparison);
  }

  clear() {
    storage.remove(this.key);
  }

  async getProducts() {
    const comparison = this.getAll();
    const { products } = await API.products.getAll();
    return products.filter(p => comparison.includes(p.id));
  }
}

const comparison = new ProductComparison();

// ========================================
// 3. ADVANCED SEARCH WITH AUTOCOMPLETE
// ========================================

class AdvancedSearch {
  constructor() {
    this.recentSearches = storage.get('recent_searches') || [];
  }

  async search(query, filters = {}) {
    // Save to recent searches
    this.addToRecent(query);
    
    // Build search parameters
    const params = {
      search: query,
      ...filters
    };
    
    // Call API
    const results = await API.products.getAll(params);
    return results;
  }

  async getAutocomplete(query) {
    if (query.length < 2) return [];
    
    const { products } = await API.products.getAll();
    
    // Filter products matching query
    const matches = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    
    return matches.slice(0, 5); // Return top 5 matches
  }

  addToRecent(query) {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(q => q !== query);
    // Add to beginning
    this.recentSearches.unshift(query);
    // Keep only last 10
    this.recentSearches = this.recentSearches.slice(0, 10);
    // Save
    storage.set('recent_searches', this.recentSearches);
  }

  getRecentSearches() {
    return this.recentSearches;
  }

  clearRecent() {
    this.recentSearches = [];
    storage.remove('recent_searches');
  }
}

const advancedSearch = new AdvancedSearch();

// ========================================
// 4. PRODUCT REVIEWS & RATINGS
// ========================================

class ReviewSystem {
  async addReview(productId, review) {
    try {
      const response = await API.products.addReview(productId, {
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        images: review.images || [],
        helpful: 0,
        verified: review.verifiedPurchase || false
      });
      
      toast.success('Review submitted successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to submit review');
      throw error;
    }
  }

  renderStars(rating, interactive = false) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      stars.push(`
        <span class="star ${filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}" 
              data-rating="${i}">
          ${filled ? '★' : '☆'}
        </span>
      `);
    }
    return stars.join('');
  }

  renderReview(review) {
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="review-author">
            <strong>${review.userName || 'Anonymous'}</strong>
            ${review.verified ? '<span class="badge badge-success">Verified Purchase</span>' : ''}
          </div>
          <div class="review-rating">${this.renderStars(review.rating)}</div>
        </div>
        ${review.title ? `<h4 class="review-title">${review.title}</h4>` : ''}
        <p class="review-comment">${review.comment}</p>
        <div class="review-footer">
          <span class="review-date">${formatDate(review.createdAt)}</span>
          <button onclick="markReviewHelpful('${review.id}')" class="btn-link">
            Helpful (${review.helpful || 0})
          </button>
        </div>
      </div>
    `;
  }
}

const reviewSystem = new ReviewSystem();

// ========================================
// 5. SOCIAL MEDIA SHARING
// ========================================

class SocialShare {
  share(product, platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name} - Only ${formatPrice(product.price)}!`);
    const image = encodeURIComponent(product.image);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${text}&body=Check%20this%20out:%20${url}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
      return;
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }

  renderShareButtons(product) {
    return `
      <div class="share-buttons">
        <button onclick="socialShare.share(product, 'facebook')" class="share-btn facebook">
          <svg width="20" height="20" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </button>
        <button onclick="socialShare.share(product, 'twitter')" class="share-btn twitter">
          <svg width="20" height="20" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
          </svg>
        </button>
        <button onclick="socialShare.share(product, 'whatsapp')" class="share-btn whatsapp">
          <svg width="20" height="20" fill="currentColor">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>
        <button onclick="socialShare.share(product, 'copy')" class="share-btn copy">
          <svg width="20" height="20" fill="currentColor">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
    `;
  }
}

const socialShare = new SocialShare();

// ========================================
// 6. CURRENCY CONVERTER
// ========================================

class CurrencyConverter {
  constructor() {
    this.currentCurrency = storage.get('selected_currency') || 'USD';
    this.rates = {};
    this.loadRates();
  }

  async loadRates() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      this.rates = data.rates;
    } catch (error) {
      console.error('Failed to load currency rates:', error);
      // Fallback rates
      this.rates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        INR: 74,
        CAD: 1.25,
        AUD: 1.35
      };
    }
  }

  convert(amount, from = 'USD', to = this.currentCurrency) {
    if (from === to) return amount;
    const usdAmount = amount / this.rates[from];
    return usdAmount * this.rates[to];
  }

  format(amount, currency = this.currentCurrency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  setCurrency(currency) {
    this.currentCurrency = currency;
    storage.set('selected_currency', currency);
    // Refresh page prices
    window.location.reload();
  }

  renderSelector() {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD'];
    return `
      <select class="currency-selector" onchange="currencyConverter.setCurrency(this.value)">
        ${currencies.map(curr => `
          <option value="${curr}" ${curr === this.currentCurrency ? 'selected' : ''}>
            ${curr}
          </option>
        `).join('')}
      </select>
    `;
  }
}

const currencyConverter = new CurrencyConverter();

// ========================================
// 7. FLASH SALE / COUNTDOWN TIMER
// ========================================

class FlashSale {
  createCountdown(endTime, elementId) {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = endTime - now;
      
      if (remaining <= 0) {
        document.getElementById(elementId).innerHTML = 'Sale Ended!';
        return;
      }
      
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      
      document.getElementById(elementId).innerHTML = `
        <div class="countdown">
          <div class="countdown-item">
            <span class="countdown-value">${days}</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${hours}</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${minutes}</span>
            <span class="countdown-label">Min</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${seconds}</span>
            <span class="countdown-label">Sec</span>
          </div>
        </div>
      `;
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  renderSaleBadge(discount) {
    return `
      <div class="sale-badge">
        <span class="sale-percentage">${discount}% OFF</span>
        <span class="sale-text">Flash Sale!</span>
      </div>
    `;
  }
}

const flashSale = new FlashSale();

// ========================================
// 8. LOYALTY POINTS SYSTEM
// ========================================

class LoyaltyProgram {
  constructor() {
    this.pointsKey = 'loyalty_points';
    this.tierKey = 'loyalty_tier';
  }

  getPoints() {
    return storage.get(this.pointsKey) || 0;
  }

  addPoints(amount) {
    const points = this.getPoints() + amount;
    storage.set(this.pointsKey, points);
    this.updateTier();
    toast.success(`+${amount} loyalty points earned!`);
    return points;
  }

  calculatePointsFromOrder(total) {
    return Math.floor(total * 10); // 10 points per dollar
  }

  redeemPoints(points) {
    const currentPoints = this.getPoints();
    if (currentPoints < points) {
      toast.error('Not enough points');
      return false;
    }
    
    const discount = points / 100; // $1 per 100 points
    storage.set(this.pointsKey, currentPoints - points);
    return discount;
  }

  getTier() {
    const points = this.getPoints();
    if (points >= 10000) return { name: 'Platinum', discount: 0.15 };
    if (points >= 5000) return { name: 'Gold', discount: 0.10 };
    if (points >= 1000) return { name: 'Silver', discount: 0.05 };
    return { name: 'Bronze', discount: 0 };
  }

  updateTier() {
    const tier = this.getTier();
    storage.set(this.tierKey, tier.name);
  }

  renderPointsDisplay() {
    const points = this.getPoints();
    const tier = this.getTier();
    
    return `
      <div class="loyalty-display">
        <div class="loyalty-points">
          <span class="points-value">${points.toLocaleString()}</span>
          <span class="points-label">Points</span>
        </div>
        <div class="loyalty-tier ${tier.name.toLowerCase()}">
          <span class="tier-name">${tier.name}</span>
          ${tier.discount > 0 ? `<span class="tier-discount">${tier.discount * 100}% OFF</span>` : ''}
        </div>
      </div>
    `;
  }
}

const loyaltyProgram = new LoyaltyProgram();

// ========================================
// 9. RECENTLY VIEWED PRODUCTS
// ========================================

class RecentlyViewed {
  constructor() {
    this.key = 'recently_viewed';
    this.maxItems = 10;
  }

  add(productId) {
    let recent = storage.get(this.key) || [];
    // Remove if already exists
    recent = recent.filter(id => id !== productId);
    // Add to beginning
    recent.unshift(productId);
    // Keep only last N items
    recent = recent.slice(0, this.maxItems);
    storage.set(this.key, recent);
  }

  getAll() {
    return storage.get(this.key) || [];
  }

  async getProducts() {
    const recentIds = this.getAll();
    const { products } = await API.products.getAll();
    return products.filter(p => recentIds.includes(p.id));
  }
}

const recentlyViewed = new RecentlyViewed();

// ========================================
// 10. ANALYTICS TRACKING
// ========================================

class Analytics {
  trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href
      });
    }
    console.log('Page view:', pageName);
  }

  trackEvent(category, action, label, value) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
    console.log('Event:', category, action, label, value);
  }

  trackProductView(product) {
    this.trackEvent('Product', 'View', product.name, product.price);
  }

  trackAddToCart(product) {
    this.trackEvent('Cart', 'Add', product.name, product.price);
  }

  trackPurchase(order) {
    this.trackEvent('Purchase', 'Complete', order.id, order.total);
  }
}

const analytics = new Analytics();

// Initialize all features
console.log('Advanced features loaded! 🚀');

// Initialize Wishlist on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    Wishlist.init();
  });
} else {
  Wishlist.init();
}
