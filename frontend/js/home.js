// Home Page JavaScript

// Category icons
const categoryIcons = {
  Smartphones:
    '<path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path><line x1="12" y1="18" x2="12.01" y2="18"></line>',
  Laptops:
    '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
  Tablets:
    '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
  Headphones:
    '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>',
  Cameras:
    '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',
  Smartwatches:
    '<circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>',
  Accessories:
    '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
  Gaming: '<path d="M7 7h10v10H7z"></path>',
  Ear: '<path d="M7 7h10v10H7z"></path>',
};
// Populate Other Section

// Load categories
async function loadCategories() {
  const container = document.getElementById("categoriesGrid");
  if (!container) return;

  const categories = CATEGORIES.filter((c) => c !== "All");

  container.innerHTML = categories
    .map(
      (category) => `
        <a href="shop.html?category=${category}" class="category-card">
            <div class="category-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${
                      categoryIcons[category] ||
                      '<circle cx="12" cy="12" r="10"></circle>'
                    }
                </svg>
            </div>
            <h3>${category}</h3>
            <p>Explore ${category.toLowerCase()}</p>
        </a>
    `
    )
    .join("");
}

// Load featured products
async function loadFeaturedProducts() {
  const container = document.getElementById("featuredProducts");
  if (!container) return;

  try {
    showLoading(container);

    const { products } = await API.products.getAll();
    
    // Exclude latest products (IDs 18-33) from featured to avoid duplicates
    const latestProductIds = ['18', '19', '20', '21', '22', '23', '24', '25', 
                               '26', '27', '28', '29', '30', '31', '32', '33'];
    const nonLatestProducts = products.filter(p => !latestProductIds.includes(p.id));
    
    // Get 6 random featured products from old products only
    const shuffled = nonLatestProducts.sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 6);

    container.innerHTML = featured
      .map((product) => renderProductCard(product))
      .join("");
    
    // Update wishlist badge after rendering
    if (window.Wishlist) {
      Wishlist.updateBadge();
    }
  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML =
      '<p style="text-align: center; color: var(--gray-600);">Failed to load products</p>';
  }
}
async function loadPremiumProducts() {
  const container = document.getElementById("premiumProducts");
  if (!container) return;

  try {
    showLoading(container);

    const { products } = await API.products.getAll();
    
    // Exclude latest products (IDs 18-33) from premium to avoid duplicates
    const latestProductIds = ['18', '19', '20', '21', '22', '23', '24', '25', 
                               '26', '27', '28', '29', '30', '31', '32', '33'];
    const nonLatestProducts = products.filter(p => !latestProductIds.includes(p.id));
    
    // Get 6 random premium products from old products only
    const shuffled = nonLatestProducts.sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 6);

    container.innerHTML = featured
      .map((product) => renderProductCard(product))
      .join("");
    
    // Update wishlist badge after rendering
    if (window.Wishlist) {
      Wishlist.updateBadge();
    }
  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML =
      '<p style="text-align: center; color: var(--gray-600);">Failed to load products</p>';
  }
}

// Initialize home page
async function initHome() {
  await loadCategories();
  await loadFeaturedProducts();
  await loadPremiumProducts();
}

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", initHome);
