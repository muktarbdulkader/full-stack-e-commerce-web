// Reusable Components

// Toggle mobile menu
window.toggleMobileMenu = function () {
  const menu = document.querySelector(".navbar-menu");
  if (menu) {
    menu.classList.toggle("active");
  }
};

// Toggle wishlist button - Make it globally accessible
window.toggleWishlistBtn = function (productId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  console.log("Toggling wishlist for product:", productId);

  // Ensure Wishlist exists (it's defined below in this file)
  if (typeof Wishlist !== "undefined" && Wishlist) {
    Wishlist.toggle(productId);

    // Update the icon
    const iconElement = document.getElementById(`wishlist-icon-${productId}`);
    if (iconElement) {
      const isInWishlist = Wishlist.hasProduct(productId);
      iconElement.textContent = isInWishlist ? "❤️" : "♡";
    }

    // Update button active state
    const button = event?.target?.closest(".wishlist-btn");
    if (button) {
      const isInWishlist = Wishlist.hasProduct(productId);
      button.classList.toggle("active", isInWishlist);
    }
  } else {
    console.error("Wishlist not initialized yet, retrying...");
    // Retry after a short delay
    setTimeout(() => {
      if (typeof Wishlist !== "undefined") {
        window.toggleWishlistBtn(productId, event);
      }
    }, 100);
  }
};

function renderNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const isAuth = Auth.isAuthenticated();
  const user = Auth.getUser();
  const cartCount = API.cart.getCount();
  const wishlistCount = Wishlist.getWishlist().length;

  navbar.innerHTML = `
        <div class="container navbar-content">
            <a href="index.html" class="navbar-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                TechStore
            </a>
            
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Toggle menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            
            <ul class="navbar-menu">
                <li><a href="index.html" class="${
                  currentPage === "index.html" ? "active" : ""
                }">Home</a></li>
                <li><a href="shop.html" class="${
                  currentPage === "shop.html" ? "active" : ""
                }">Shop</a></li>
                <li><a href="about.html" class="${
                  currentPage === "about.html" ? "active" : ""
                }">About</a></li>
                <li><a href="contact.html" class="${
                  currentPage === "contact.html" ? "active" : ""
                }">Contact</a></li>
            </ul>
            <div class="navbar-actions">
                <a href="wishlist.html" class="icon-btn wishlist-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="wishlist-icon">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    ${
                      wishlistCount > 0
                        ? `<span class="wishlist-badge">${wishlistCount}</span>`
                        : '<span class="wishlist-badge" style="display: none;"></span>'
                    }
                </a>
                <a href="cart.html" class="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    ${
                      cartCount > 0
                        ? `<span class="cart-badge">${cartCount}</span>`
                        : ""
                    }
                </a>
                ${
                  isAuth
                    ? `
                    <a href="${
                      user.role === "admin" ? "admin.html" : "profile.html"
                    }" class="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </a>
                `
                    : `
                    <a href="login.html" class="btn btn-primary btn-sm">Login</a>
                `
                }
               
            </div>
           
    `;
}

// Render Footer
function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="navbar-logo" style="margin-bottom: 1rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        TechStore
                    </div>
                    <p>Your trusted destination for the latest technology products and gadgets.</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="shop.html">Shop</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="track-order.html">Track Order</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Customer Service</h3>
                    <p>For any inquiries or assistance, please contact us:</p>
                    <ul class="footer-links">
                        <li><a href="contact.html">Help & FAQ</a></li>
                        <li><a href="contact.html">Returns</a></li>
                        <li><a href="contact.html">Shipping Info</a></li>
                        <li><a href="profile.html">My Account</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                      <ul class="footer-links">
                        <li><a href="mailto:contact@techstore.com">contact@techstore.com</a></li>
                        <li><a href="tel:+251916662982">+251916662982</a></li>
                        <li>123 Tech Street<br> Addis Ababa, Ethiopia</li>
                        
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">

                <p>&copy; 2025 TechStore. All rights reserved.</p>
            </div>
        </div>
    `;
}

// NOTE: Wishlist module has been moved to advanced-features.js for better organization

// ==============================
// Wishlist Page Integration
// ==============================
function renderWishlistPage(products) {
  const wishlistGrid = document.getElementById("wishlistGrid");
  const wishlistCount = document.getElementById("wishlistCount");
  const emptyWishlist = document.getElementById("emptyWishlist");
  const wishlistActions = document.getElementById("wishlistActions");

  if (!wishlistGrid) return;

  try {
    // Get wishlist IDs from localStorage
    const wishlistIds = Wishlist.getWishlist();

    // Filter products that are in the wishlist
    const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

    // Update UI
    wishlistCount.textContent = `(${wishlistProducts.length}) items`;

    if (wishlistProducts.length === 0) {
      emptyWishlist.style.display = "block";
      wishlistActions.style.display = "none";
      wishlistGrid.innerHTML = "";
    } else {
      emptyWishlist.style.display = "none";
      wishlistActions.style.display = "block";
      wishlistGrid.innerHTML = wishlistProducts
        .map((product) => renderProductCard(product))
        .join("");
    }

    // Update badge in navbar
    Wishlist.updateBadge();
  } catch (error) {
    console.error("Error rendering wishlist:", error);
    Wishlist.showToast("Error loading wishlist", "error");
  }
}

// Initialize wishlist page
document.addEventListener("DOMContentLoaded", async () => {
  // Only run on wishlist.html
  if (!document.getElementById("wishlistGrid")) return;

  try {
    // Load products
    const { products } = await API.products.getAll();

    // Initial render
    renderWishlistPage(products);

    // Listen for storage changes to update the UI
    window.addEventListener("storage", () => {
      renderWishlistPage(products);
    });

    // Also listen for custom wishlist update event
    document.addEventListener("wishlistUpdated", () => {
      renderWishlistPage(products);
    });
  } catch (error) {
    console.error("Error initializing wishlist:", error);
    Wishlist.showToast("Failed to load products", "error");
  }
});

// ✅ Clear Wishlist Function
window.clearWishlist = function () {
  if (!confirm("Are you sure you want to clear your wishlist?")) return;
  localStorage.removeItem("wishlist");
  Wishlist.updateBadge();
  location.reload();
};

// Render Product Card
function renderProductCard(product) {
  const isWishlisted = Wishlist.hasProduct(product.id);
  const isWishlistPage = window.location.pathname.includes("wishlist.html");

  return `
        <div class="card">
            <div class="card-image-container">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${
                      product.image ||
                      "https://via.placeholder.com/400?text=Product+Image"
                    }" alt="${product.name}" class="card-image">
                </a>
                <button class="wishlist-icon-btn ${
                  isWishlistPage || isWishlisted ? "active" : ""
                }" 
                        data-product-id="${product.id}"
                        style="${
                          isWishlistPage
                            ? "background: rgba(255, 255, 255, 0.9);"
                            : ""
                        }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                         fill="${
                           isWishlistPage || isWishlisted ? "#ef4444" : "none"
                         }" 
                         stroke="${
                           isWishlistPage || isWishlisted
                             ? "#ef4444"
                             : "currentColor"
                         }" 
                         stroke-width="2"
                         class="wishlist-icon">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="card-content">
                <span class="badge badge-outline">${product.category}</span>
                <a href="product-detail.html?id=${product.id}">
                    <h3 class="card-title">${product.name}</h3>
                </a>
                <p class="card-description">${truncate(
                  product.description,
                  80
                )}</p>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                    <span style="color: #f59e0b;">★</span>
                    <span style="font-size: 0.875rem; color: var(--gray-600);">${
                      product.rating
                    }</span>
                    <span style="font-size: 0.875rem; color: var(--gray-500);">(${
                      product.stock
                    } in stock)</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="card-price">${formatPrice(
                      product.price
                    )}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${
                      product.id
                    }')">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// Load premium products for carousel
async function loadPremiumProducts() {
  try {
    const { products } = await API.products.getAll();
    const premiumProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes("premium") ||
        (product.description &&
          product.description.toLowerCase().includes("premium"))
    );

    const carousel = document.getElementById("carousel");
    if (carousel) {
      carousel.innerHTML = premiumProducts
        .map((product) => renderProductCard(product))
        .join("");

      // Update wishlist badge after rendering products
      if (window.Wishlist) {
        Wishlist.updateBadge();
      }
    }
  } catch (error) {
    console.error("Error loading premium products:", error);
  }
}

// Initialize premium products when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait for Wishlist to be initialized first
  setTimeout(() => {
    loadPremiumProducts();
  }, 100);
});
// Render Empty State
function renderEmptyState(icon, title, description, buttonText, buttonLink) {
  return `
        <div style="text-align: center; padding: 4rem 1rem;">
            ${icon}
            <h2 style="font-size: 2rem; margin: 1rem 0;">${title}</h2>
            <p style="color: var(--gray-600); margin-bottom: 2rem;">${description}</p>
            ${
              buttonText
                ? `<a href="${buttonLink}" class="btn btn-primary btn-lg">${buttonText}</a>`
                : ""
            }
        </div>
    `;
}

// Add to Cart function
window.addToCart = async function (productId) {
  try {
    const { products } = await API.products.getAll();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      toast.error("Product not found");
      return;
    }

    if (product.stock < 1) {
      toast.error("Product is out of stock");
      return;
    }

    API.cart.add(product, 1);
    toast.success(`${product.name} added to cart!`);

    // Update cart badge
    renderNavbar();
  } catch (error) {
    console.error("Add to cart error:", error);
    toast.error("Failed to add to cart");
  }
};

// Initialize page
function initPage() {
  renderNavbar();
  renderFooter();
}

// Run on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initPage();
    // Wishlist.init() is now called in advanced-features.js
  });
} else {
  initPage();
  // Wishlist.init() is now called in advanced-features.js
}
