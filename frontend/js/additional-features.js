// Additional Advanced Features for World-Class Platform

// ========================================
// 1. QUICK VIEW MODAL
// ========================================

class QuickView {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="quick-view-content">
        <button class="modal-close" onclick="quickView.close()">×</button>
        <div id="quickViewBody"></div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });
  }

  async show(productId) {
    const { products } = await API.products.getAll();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const body = document.getElementById('quickViewBody');
    body.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <img src="${product.image}" alt="${product.name}" 
               style="width: 100%; border-radius: var(--border-radius);">
          ${this.renderImageGallery(product)}
        </div>
        <div>
          <span class="badge badge-${product.stock > 0 ? 'success' : 'danger'}">
            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
          <h2>${product.name}</h2>
          <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0;">
            <div style="color: #fbbf24; font-size: 1.2rem;">
              ${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}
            </div>
            <span style="color: var(--gray-600);">${product.rating} / 5</span>
          </div>
          <div class="card-price" style="font-size: 2rem; margin: 1rem 0;">
            ${formatPrice(product.price)}
          </div>
          <p style="color: var(--gray-700); line-height: 1.6; margin-bottom: 2rem;">
            ${product.description}
          </p>
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <button class="btn btn-primary" onclick="addToCart('${product.id}'); quickView.close();">
              Add to Cart
            </button>
            <button class="btn btn-outline" onclick="window.location.href='product-detail.html?id=${product.id}'">
              View Details
            </button>
          </div>
          <div style="display: flex; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--gray-200);">
            <span style="color: var(--gray-600); font-size: 0.875rem;">Share:</span>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(window.location.href)}" target="_blank" style="color: var(--gray-600); transition: color 0.3s;" onmouseover="this.style.color='#1DA1F2'" onmouseout="this.style.color='var(--gray-600)'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" style="color: var(--gray-600); transition: color 0.3s;" onmouseover="this.style.color='#4267B2'" onmouseout="this.style.color='var(--gray-600)'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </a>
            <a href="https://wa.me/?text=${encodeURIComponent(product.name + ' - ' + window.location.href)}" target="_blank" style="color: var(--gray-600); transition: color 0.3s;" onmouseover="this.style.color='#25D366'" onmouseout="this.style.color='var(--gray-600)'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    `;

    this.modal.classList.add('active');
  }

  renderImageGallery(product) {
    // Simulate multiple images
    return `
      <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
        <img src="${product.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid var(--primary);">
        <img src="${product.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; cursor: pointer; opacity: 0.5;">
        <img src="${product.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; cursor: pointer; opacity: 0.5;">
      </div>
    `;
  }

  close() {
    this.modal.classList.remove('active');
  }
}

const quickView = new QuickView();

// ========================================
// 2. BACK TO TOP BUTTON
// ========================================

class BackToTop {
  constructor() {
    this.button = null;
    this.init();
  }

  init() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = `
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 19V6M5 12l7-7 7 7"/>
      </svg>
    `;
    btn.onclick = () => this.scrollToTop();
    document.body.appendChild(btn);
    this.button = btn;

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const backToTop = new BackToTop();

// ========================================
// 3. PRODUCT AVAILABILITY INDICATOR
// ========================================

class AvailabilityChecker {
  checkStock(product) {
    if (product.stock === 0) {
      return { 
        status: 'out-of-stock', 
        message: 'Out of Stock',
        color: '#ef4444'
      };
    } else if (product.stock < 5) {
      return { 
        status: 'low-stock', 
        message: `Only ${product.stock} left!`,
        color: '#f59e0b'
      };
    } else {
      return { 
        status: 'in-stock', 
        message: 'In Stock',
        color: '#10b981'
      };
    }
  }

  renderBadge(product) {
    const availability = this.checkStock(product);
    return `
      <span class="availability-badge" style="background: ${availability.color}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
        ${availability.message}
      </span>
    `;
  }
}

const availabilityChecker = new AvailabilityChecker();

// ========================================
// 4. DISCOUNT/SALE BADGE GENERATOR
// ========================================

class DiscountBadge {
  calculate(originalPrice, salePrice) {
    const discount = ((originalPrice - salePrice) / originalPrice * 100).toFixed(0);
    return discount;
  }

  render(originalPrice, salePrice) {
    const discount = this.calculate(originalPrice, salePrice);
    return `
      <div class="sale-badge" style="position: absolute; top: 1rem; left: 1rem; z-index: 10;">
        <div style="background: linear-gradient(135deg, #ef4444, #ec4899); color: white; padding: 0.5rem 1rem; border-radius: var(--border-radius); box-shadow: var(--shadow); animation: pulse 2s infinite;">
          <div style="font-size: 1.5rem; font-weight: 700; line-height: 1;">-${discount}%</div>
          <div style="font-size: 0.75rem; text-transform: uppercase;">SALE</div>
        </div>
      </div>
    `;
  }

  renderHotDeal() {
    return `
      <div class="hot-deal-badge" style="position: absolute; top: 1rem; left: 1rem; background: linear-gradient(135deg, #ef4444, #f59e0b); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.875rem; box-shadow: var(--shadow); animation: pulse 2s infinite; z-index: 10;">
        🔥 HOT DEAL
      </div>
    `;
  }

  renderNewArrival() {
    return `
      <div style="position: absolute; top: 1rem; left: 1rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.875rem; box-shadow: var(--shadow); z-index: 10;">
        ✨ NEW
      </div>
    `;
  }
}

const discountBadge = new DiscountBadge();

// ========================================
// 5. PRODUCT FILTERS WITH TAGS
// ========================================

class FilterTags {
  constructor() {
    this.activeFilters = {};
  }

  add(type, value) {
    if (!this.activeFilters[type]) {
      this.activeFilters[type] = [];
    }
    if (!this.activeFilters[type].includes(value)) {
      this.activeFilters[type].push(value);
    }
    this.render();
  }

  remove(type, value) {
    if (this.activeFilters[type]) {
      this.activeFilters[type] = this.activeFilters[type].filter(v => v !== value);
      if (this.activeFilters[type].length === 0) {
        delete this.activeFilters[type];
      }
    }
    this.render();
  }

  clear() {
    this.activeFilters = {};
    this.render();
  }

  render() {
    const container = document.getElementById('filterTags');
    if (!container) return;

    const tags = [];
    Object.entries(this.activeFilters).forEach(([type, values]) => {
      values.forEach(value => {
        tags.push(`
          <div class="filter-tag">
            <span>${type}: ${value}</span>
            <button class="filter-tag-remove" onclick="filterTags.remove('${type}', '${value}')">×</button>
          </div>
        `);
      });
    });

    if (tags.length > 0) {
      container.innerHTML = `
        <div class="filter-tags">
          ${tags.join('')}
          <button class="btn btn-link" onclick="filterTags.clear()">Clear All</button>
        </div>
      `;
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  }

  getActive() {
    return this.activeFilters;
  }
}

const filterTags = new FilterTags();

// ========================================
// 6. RECENTLY VIEWED SECTION RENDERER
// ========================================

class RecentlyViewedSection {
  async render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = await recentlyViewed.getProducts();
    
    if (products.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <section class="recently-viewed-section">
        <div class="container">
          <h2 class="section-title">👁️ Recently Viewed</h2>
          <div class="recently-viewed-grid">
            ${products.map(product => `
              <div class="card" style="position: relative;">
                <a href="product-detail.html?id=${product.id}">
                  <img src="${product.image}" alt="${product.name}" class="card-image">
                </a>
                <div class="card-content">
                  <h4>${product.name}</h4>
                  <div class="card-price">${formatPrice(product.price)}</div>
                  <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">Add to Cart</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
    container.style.display = 'block';
  }
}

const recentlyViewedSection = new RecentlyViewedSection();

// ========================================
// 7. LIVE SEARCH WITH DEBOUNCE
// ========================================

class LiveSearch {
  constructor(inputId, resultsId) {
    this.input = document.getElementById(inputId);
    this.results = document.getElementById(resultsId);
    this.debounceTimer = null;
    
    if (this.input) {
      this.init();
    }
  }

  init() {
    this.input.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.search(e.target.value);
      }, 300);
    });

    // Close results on click outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.results.contains(e.target)) {
        this.results.style.display = 'none';
      }
    });
  }

  async search(query) {
    if (query.length < 2) {
      this.results.style.display = 'none';
      return;
    }

    const suggestions = await advancedSearch.getAutocomplete(query);
    
    if (suggestions.length === 0) {
      this.results.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--gray-600);">No results found</div>';
      this.results.style.display = 'block';
      return;
    }

    this.results.innerHTML = suggestions.map(product => `
      <div class="autocomplete-item" onclick="window.location.href='product-detail.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}">
        <div class="autocomplete-info">
          <div class="autocomplete-name">${this.highlight(product.name, query)}</div>
          <div class="autocomplete-price">${formatPrice(product.price)}</div>
        </div>
      </div>
    `).join('');
    
    this.results.style.display = 'block';
  }

  highlight(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--primary);">$1</strong>');
  }
}

// ========================================
// 8. PRODUCT RECOMMENDATIONS
// ========================================

class RecommendationEngine {
  async getRecommendations(productId, limit = 4) {
    const { products } = await API.products.getAll();
    const currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) return [];

    // Get products from same category
    let recommendations = products.filter(p => 
      p.id !== productId && 
      p.category === currentProduct.category
    );

    // If not enough, add popular products
    if (recommendations.length < limit) {
      const others = products.filter(p => 
        p.id !== productId && 
        !recommendations.includes(p)
      ).sort((a, b) => b.rating - a.rating);
      
      recommendations = [...recommendations, ...others];
    }

    return recommendations.slice(0, limit);
  }

  async renderSection(productId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = await this.getRecommendations(productId);
    
    if (products.length === 0) return;

    container.innerHTML = `
      <section class="section" style="background: var(--gray-50);">
        <div class="container">
          <h2 class="section-title">💡 You May Also Like</h2>
          <div class="products-grid">
            ${products.map(product => renderProductCard(product)).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

const recommendationEngine = new RecommendationEngine();

// ========================================
// 9. LOADING SKELETON
// ========================================

class LoadingSkeleton {
  renderProductGrid(count = 8) {
    return Array(count).fill(0).map(() => `
      <div class="card">
        <div class="skeleton skeleton-image"></div>
        <div class="card-content">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    `).join('');
  }

  show(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.renderProductGrid();
    }
  }
}

const loadingSkeleton = new LoadingSkeleton();

// ========================================
// 10. NOTIFICATION SYSTEM
// ========================================

class NotificationCenter {
  constructor() {
    this.notifications = storage.get('notifications') || [];
    this.unreadCount = 0;
  }

  add(notification) {
    notification.id = Date.now();
    notification.read = false;
    notification.timestamp = new Date().toISOString();
    
    this.notifications.unshift(notification);
    storage.set('notifications', this.notifications);
    this.updateBadge();
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      storage.set('notifications', this.notifications);
      this.updateBadge();
    }
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  updateBadge() {
    // Update notification badge in UI
    const badge = document.getElementById('notificationBadge');
    const count = this.getUnreadCount();
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'block' : 'none';
    }
  }

  renderList() {
    return this.notifications.map(n => `
      <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="notificationCenter.markAsRead(${n.id})">
        <div class="notification-icon">${n.icon || '📢'}</div>
        <div class="notification-content">
          <strong>${n.title}</strong>
          <p>${n.message}</p>
          <small>${formatDate(n.timestamp)}</small>
        </div>
      </div>
    `).join('');
  }
}

const notificationCenter = new NotificationCenter();

// ========================================
// 11. LATEST PRODUCTS SECTION
// ========================================

class LatestProducts {
  async getLatestProducts(limit = 8) {
    const { products } = await API.products.getAll();
    
    // Show only the latest products (IDs 18-33 are the new ones)
    const latestProductIds = ['18', '19', '20', '21', '22', '23', '24', '25', 
                               '26', '27', '28', '29', '30', '31', '32', '33'];
    
    // Filter to get only latest products
    const latestProducts = products.filter(p => latestProductIds.includes(p.id));
    
    // Sort by ID descending (newest first)
    const sorted = [...latestProducts].sort((a, b) => {
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);
      return idB - idA;
    });
    
    return sorted.slice(0, limit);
  }

  async renderSection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = await this.getLatestProducts();
    
    if (products.length === 0) return;

    container.innerHTML = `
      <section class="latest-products-section section">
        <div class="container">
          <div style="text-align: center; margin-bottom: 3rem;">
            <span class="badge badge-primary" style="font-size: 0.875rem; margin-bottom: 1rem;">NEW ARRIVALS</span>
            <h2 class="section-title">✨ Latest Products</h2>
            <p style="color: var(--gray-600); max-width: 600px; margin: 0 auto;">
              Check out our newest additions! Fresh products just arrived.
            </p>
          </div>
          <div class="products-grid">
            ${products.map(product => this.renderLatestProductCard(product)).join('')}
          </div>
          <div style="text-align: center; margin-top: 2rem;">
            <a href="shop.html" class="btn btn-outline">View All Products →</a>
          </div>
        </div>
      </section>
    `;
  }

  renderLatestProductCard(product) {
    const inWishlist = typeof wishlist !== 'undefined' ? wishlist.isInWishlist(product.id) : false;
    
    return `
      <div class="card latest-product-card" style="position: relative;" data-product-id="${product.id}">
        <!-- NEW Badge -->
        <div class="new-arrival-badge">
          ✨ NEW
        </div>
        
        <!-- Wishlist Button -->
        <button class="wishlist-btn ${inWishlist ? 'active' : ''}" 
                onclick="toggleWishlistBtn('${product.id}', event)" 
                title="Add to wishlist">
          <span id="wishlist-icon-${product.id}">${inWishlist ? '❤️' : '♡'}</span>
        </button>
        
        <a href="product-detail.html?id=${product.id}">
          <div class="zoom-hover">
            <img src="${product.image}" alt="${product.name}" class="card-image">
          </div>
        </a>
        
        <div class="card-content">
          <span class="badge badge-outline">${product.category}</span>
          <a href="product-detail.html?id=${product.id}">
            <h3 class="card-title">${product.name}</h3>
          </a>
          <p class="card-description">${product.description.substring(0, 80)}...</p>
          
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
            <span style="color: #fbbf24;">★</span>
            <span style="font-size: 0.875rem; color: var(--gray-600);">${product.rating}</span>
            ${availabilityChecker.renderBadge(product)}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
            <span class="card-price">${formatPrice(product.price)}</span>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">
                Add to Cart
              </button>
              <button class="btn btn-outline btn-sm" 
                      onclick="quickView.show('${product.id}')"
                      title="Quick View"
                      style="padding: 0.5rem;">
                👁️
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render compact version for sidebar
  async renderCompact(containerId, limit = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = await this.getLatestProducts(limit);
    
    if (products.length === 0) return;

    container.innerHTML = `
      <div class="latest-products-compact">
        <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>✨</span>
          <span>Latest Products</span>
        </h3>
        <div class="latest-products-list">
          ${products.map(product => `
            <div class="latest-product-item" onclick="window.location.href='product-detail.html?id=${product.id}'">
              <img src="${product.image}" alt="${product.name}" class="latest-product-thumb">
              <div class="latest-product-info">
                <div class="latest-product-name">${product.name}</div>
                <div class="latest-product-price">${formatPrice(product.price)}</div>
                <div class="latest-product-badge">NEW</div>
              </div>
            </div>
          `).join('')}
        </div>
        <a href="shop.html" class="btn btn-link" style="margin-top: 1rem; display: block;">
          View All →
        </a>
      </div>
    `;
  }
}

const latestProducts = new LatestProducts();

// Initialize on page load
console.log('Additional features loaded! 🎨');
