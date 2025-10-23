// Shop Page JavaScript

let allProducts = [];
let displayedCount = 12; // Show 12 products initially
let currentDisplayCount = 12;

let filters = {
  category: getUrlParam("category") || "All",
  search: "",
  priceRange: "all",
  sort: "default",
};

// Render categories filter
function renderCategoriesFilter() {
  const container = document.getElementById("categoriesFilter");
  if (!container) return;

  container.innerHTML = CATEGORIES.map(
    (category) => `
        <button class="category-btn ${
          filters.category === category ? "active" : ""
        }" 
                onclick="filterByCategory('${category}')">
            ${category}
        </button>
    `
  ).join("");
}

// Filter by category
window.filterByCategory = function(category) {
  filters.category = category;
  setUrlParam("category", category);
  currentDisplayCount = 12; // Reset to initial count
  renderCategoriesFilter();
  renderProducts();
}

// Apply filters
function applyFilters() {
  let filtered = [...allProducts];

  // Category filter
  if (filters.category !== "All") {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Search filter
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  // Price filter
  if (filters.priceRange !== "all") {
    filtered = filtered.filter((p) => {
      switch (filters.priceRange) {
        case "under100":
          return p.price < 100;
        case "100-500":
          return p.price >= 100 && p.price <= 500;
        case "500-1000":
          return p.price > 500 && p.price <= 1000;
        case "over1000":
          return p.price > 1000;
        default:
          return true;
      }
    });
  }

  // Sort
  switch (filters.sort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
  }

  return filtered;
}

// Render products
function renderProducts(showAll = false) {
  const container = document.getElementById("productsGrid");
  const countContainer = document.getElementById("productsCount");

  if (!container) return;

  const filtered = applyFilters();
  const totalProducts = filtered.length;

  // Determine how many to show
  const productsToShow = showAll
    ? filtered
    : filtered.slice(0, currentDisplayCount);

  // Update count with total available
  if (countContainer) {
    countContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <span>Showing ${
                  productsToShow.length
                } of ${totalProducts} product${
      totalProducts !== 1 ? "s" : ""
    }</span>
                ${
                  totalProducts > productsToShow.length
                    ? `<span style="color: var(--primary); font-weight: 600;">
                        ${totalProducts - productsToShow.length} more available
                    </span>`
                    : ""
                }
            </div>
        `;
  }

  // Render products
  if (filtered.length === 0) {
    container.innerHTML = renderEmptyState(
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem; color: var(--gray-300);"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
      "No products found",
      "Try adjusting your filters",
      "",
      ""
    );
    // Hide load more button
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
  } else {
    container.innerHTML = productsToShow
      .map((product) => renderProductCard(product))
      .join("");

    // Show/hide load more button
    updateLoadMoreButton(productsToShow.length, totalProducts);
  }
}

// Update load more button visibility
function updateLoadMoreButton(showing, total) {
  let loadMoreBtn = document.getElementById("loadMoreBtn");

  // Create button if it doesn't exist
  if (!loadMoreBtn) {
    const container = document.querySelector(".shop-container .container");
    if (container) {
      const btnContainer = document.createElement("div");
      btnContainer.id = "loadMoreContainer";
      btnContainer.style.textAlign = "center";
      btnContainer.style.marginTop = "3rem";
      btnContainer.innerHTML = `
                <button id="loadMoreBtn" class="btn btn-primary" onclick="loadMore()">
                    Load More Products
                </button>
                <button id="showAllBtn" class="btn btn-outline" onclick="showAllProducts()" style="margin-left: 1rem;">
                    Show All (${total})
                </button>
            `;
      container.appendChild(btnContainer);
      loadMoreBtn = document.getElementById("loadMoreBtn");
    }
  }

  // Update button text and visibility
  if (loadMoreBtn) {
    const remaining = total - showing;
    if (remaining > 0) {
      loadMoreBtn.textContent = `Load More (${remaining} remaining)`;
      loadMoreBtn.style.display = "inline-block";
      document.getElementById("showAllBtn").style.display = "inline-block";
    } else {
      loadMoreBtn.style.display = "none";
      document.getElementById("showAllBtn").style.display = "none";
    }
  }
}

// Load more products
window.loadMore = function() {
  currentDisplayCount += 12; // Load 12 more
  renderProducts();
}

// Show all products
window.showAllProducts = function() {
  currentDisplayCount = 99999; // Show all
  renderProducts();
  toast.success("Showing all products!");
}

// Load products
async function loadProducts() {
  const container = document.getElementById("productsGrid");

  try {
    showLoading(container);

    const { products } = await API.products.getAll();
    allProducts = products;

    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML =
      '<p style="text-align: center; color: var(--gray-600);">Failed to load products</p>';
  }
}

// Initialize shop page
async function initShop() {
  renderCategoriesFilter();
  await loadProducts();

  // Search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        filters.search = e.target.value;
        currentDisplayCount = 12; // Reset display count
        renderProducts();
      }, 300)
    );
  }

  // Sort select
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      filters.sort = e.target.value;
      currentDisplayCount = 12; // Reset display count
      renderProducts();
    });
  }

  // Price filter
  const priceFilter = document.getElementById("priceFilter");
  if (priceFilter) {
    priceFilter.addEventListener("change", (e) => {
      filters.priceRange = e.target.value;
      currentDisplayCount = 12; // Reset display count
      renderProducts();
    });
  }
}

document.addEventListener("DOMContentLoaded", initShop);
