// Admin Dashboard JavaScript

let allProducts = [];
let allOrders = [];

// Check admin access
function checkAdminAccess() {
  const user = Auth.getUser();
  if (!user || user.role !== "admin") {
    toast.error("Access denied. Admin only.");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
    return false;
  }
  return true;
}

// Show admin tab
function showAdminTab(tabName) {
  // Update nav
  document.querySelectorAll(".admin-nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  event.target.closest(".admin-nav-item").classList.add("active");

  // Update tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.getElementById(`${tabName}Tab`).classList.add("active");

  // Load tab data
  if (tabName === "products") {
    loadProductsTable();
  } else if (tabName === "orders") {
    loadOrdersTable();
  } else if (tabName === "analytics") {
    loadAnalytics();
  }
}

// Load dashboard stats
async function loadDashboardStats() {
  try {
    const { products } = await API.products.getAll();
    const { orders } = await API.orders.getAll();

    allProducts = products || [];
    allOrders = orders || [];

    const totalRevenue = allOrders.reduce((sum, order) => {
      if (order.status !== "cancelled") {
        return sum + (order.totalPrice || 0);
      }
      return sum;
    }, 0);

    const pendingOrders = allOrders.filter(
      (o) => o.status === "pending" || o.status === "processing"
    ).length;

    // Update quick stats
    document.getElementById("totalProducts").textContent = allProducts.length;
    document.getElementById("totalOrders").textContent = allOrders.length;
    document.getElementById("totalRevenue").textContent =
      formatPrice(totalRevenue);

    // Update dashboard stats
    document.getElementById("dashTotalProducts").textContent =
      allProducts.length;
    document.getElementById("dashTotalOrders").textContent = allOrders.length;
    document.getElementById("dashTotalRevenue").textContent =
      formatPrice(totalRevenue);
    document.getElementById("dashPendingOrders").textContent = pendingOrders;

    // Load recent orders
    loadRecentOrders();
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
  }
}

// Load recent orders
function loadRecentOrders() {
  const container = document.getElementById("recentOrdersList");
  if (!container) return;

  const recentOrders = allOrders.slice(0, 5);

  if (recentOrders.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--gray-500);">No orders yet</p>';
    return;
  }

  container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${recentOrders
                  .map(
                    (order) => `
                    <tr>
                        <td>#${
                          order._id
                            ? order._id.slice(-8).toUpperCase()
                            : order.id
                        }</td>
                        <td>${order.shippingAddress?.name || "N/A"}</td>
                        <td>${formatPrice(order.totalPrice)}</td>
                        <td><span class="badge badge-${getStatusColor(
                          order.status
                        )}">${order.status}</span></td>
                        <td>${formatDate(order.createdAt)}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

// Load products table
function loadProductsTable() {
  const container = document.getElementById("productsTableContainer");
  if (!container) return;

  if (allProducts.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--gray-500);">No products yet</p>';
    return;
  }

  container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allProducts
                  .map(
                    (product) => `
                    <tr>
                        <td><img src="${product.image}" alt="${
                      product.name
                    }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                        <td>${product.name}</td>
                        <td><span class="badge badge-outline">${
                          product.category
                        }</span></td>
                        <td>${formatPrice(product.price)}</td>
                        <td>${product.stock}</td>
                        <td>⭐ ${product.rating || 0}</td>
                        <td>
                            <button class="btn-icon" onclick="editProduct('${
                              product.id || product._id
                            }')" title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="btn-icon btn-danger" onclick="deleteProduct('${
                              product.id || product._id
                            }')" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

// Load orders table
function loadOrdersTable() {
  const container = document.getElementById("ordersTableContainer");
  if (!container) return;

  if (allOrders.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--gray-500);">No orders yet</p>';
    return;
  }

  container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allOrders
                  .map(
                    (order) => `
                    <tr>
                        <td>#${
                          order._id
                            ? order._id.slice(-8).toUpperCase()
                            : order.id
                        }</td>
                        <td>
                            <div>${order.shippingAddress?.name || "N/A"}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500);">${
                              order.shippingAddress?.email || ""
                            }</div>
                        </td>
                        <td>${order.orderItems?.length || 0} items</td>
                        <td>${formatPrice(order.totalPrice)}</td>
                        <td>
                            <select class="status-select" onchange="updateOrderStatus('${
                              order._id || order.id
                            }', this.value)">
                                <option value="pending" ${
                                  order.status === "pending" ? "selected" : ""
                                }>Pending</option>
                                <option value="processing" ${
                                  order.status === "processing"
                                    ? "selected"
                                    : ""
                                }>Processing</option>
                                <option value="shipped" ${
                                  order.status === "shipped" ? "selected" : ""
                                }>Shipped</option>
                                <option value="delivered" ${
                                  order.status === "delivered" ? "selected" : ""
                                }>Delivered</option>
                                <option value="cancelled" ${
                                  order.status === "cancelled" ? "selected" : ""
                                }>Cancelled</option>
                            </select>
                        </td>
                        <td>${formatDate(order.createdAt)}</td>
                        <td>
                            <button class="btn-icon" onclick="viewOrderDetail('${
                              order._id || order.id
                            }')" title="View">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

// Load analytics
function loadAnalytics() {
  const categoryChart = document.getElementById("categoryChart");
  const statusChart = document.getElementById("statusChart");

  if (!categoryChart || !statusChart) return;

  // Category sales
  const categorySales = {};
  allOrders.forEach((order) => {
    if (order.status !== "cancelled") {
      order.orderItems?.forEach((item) => {
        const product = allProducts.find(
          (p) => (p.id || p._id) === item.product
        );
        if (product) {
          const category = product.category;
          categorySales[category] =
            (categorySales[category] || 0) + item.price * item.quantity;
        }
      });
    }
  });

  categoryChart.innerHTML =
    Object.entries(categorySales)
      .map(
        ([category, sales]) => `
        <div class="chart-bar">
            <div class="chart-label">${category}</div>
            <div class="chart-bar-container">
                <div class="chart-bar-fill" style="width: ${
                  (sales / Math.max(...Object.values(categorySales))) * 100
                }%"></div>
            </div>
            <div class="chart-value">${formatPrice(sales)}</div>
        </div>
    `
      )
      .join("") || "<p>No data available</p>";

  // Order status distribution
  const statusCount = {};
  allOrders.forEach((order) => {
    statusCount[order.status] = (statusCount[order.status] || 0) + 1;
  });

  statusChart.innerHTML =
    Object.entries(statusCount)
      .map(
        ([status, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${
              status.charAt(0).toUpperCase() + status.slice(1)
            }</div>
            <div class="chart-bar-container">
                <div class="chart-bar-fill badge-${getStatusColor(
                  status
                )}" style="width: ${(count / allOrders.length) * 100}%"></div>
            </div>
            <div class="chart-value">${count}</div>
        </div>
    `
      )
      .join("") || "<p>No data available</p>";
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
  try {
    const result = await API.orders.updateStatus(orderId, newStatus);
    if (result.success) {
      toast.success("Order status updated");
      await loadDashboardStats();
    } else {
      toast.error("Failed to update status");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update status");
  }
}

// View order detail
function viewOrderDetail(orderId) {
  window.location.href = `order-detail.html?id=${orderId}`;
}

// Show add product modal
function showAddProductModal() {
  document.getElementById("addProductModal").classList.add("active");
}

// Close add product modal
function closeAddProductModal() {
  document.getElementById("addProductModal").classList.remove("active");
  document.getElementById("addProductForm").reset();
}

// Handle add product
async function handleAddProduct(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const productData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price")),
    stock: parseInt(formData.get("stock")),
    category: formData.get("category"),
    brand: formData.get("brand") || "",
    image: formData.get("image"),
    rating: 0,
    numReviews: 0,
    isActive: true,
  };

  try {
    const result = await API.products.create(productData);
    if (result.success) {
      toast.success("Product added successfully");
      closeAddProductModal();
      await loadDashboardStats();
      loadProductsTable();
    } else {
      toast.error("Failed to add product");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    toast.error("Failed to add product");
  }
}

// Edit product
function editProduct(productId) {
  toast.info("Edit functionality coming soon");
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    const result = await API.products.delete(productId);
    if (result.success) {
      toast.success("Product deleted successfully");
      await loadDashboardStats();
      loadProductsTable();
    } else {
      toast.error("Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error("Failed to delete product");
  }
}

// Get status color
function getStatusColor(status) {
  const colors = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };
  return colors[status] || "secondary";
}

// Initialize admin dashboard
async function initAdmin() {
  // Render navbar and footer
  renderNavbar();
  renderFooter();

  if (!checkAdminAccess()) {
    return;
  }

  await loadDashboardStats();
}

// Close modal on outside click
window.onclick = function (event) {
  const modal = document.getElementById("addProductModal");
  if (event.target === modal) {
    closeAddProductModal();
  }
};

document.addEventListener("DOMContentLoaded", initAdmin);
