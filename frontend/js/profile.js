// ===========================
// Profile Page Logic
// ===========================

// Check authentication
if (!Auth.isAuthenticated()) {
  window.location.href = "login.html?redirect=profile.html";
}

const user = Auth.getUser();

// ===========================
// Initialize profile
// ===========================
function initProfile() {
  // Set user info
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;

  // Fill settings form
  document.getElementById("settingsName").value = user.name;
  document.getElementById("settingsEmail").value = user.email;
  document.getElementById("settingsPhone").value = user.phone || "";

  // Load user orders
  loadOrders();
}

// ===========================
// Tab Navigation
// ===========================
const tabButtons = document.querySelectorAll(".profile-nav-item[data-tab]");
tabButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const tab = button.dataset.tab;

    // Update active states
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Show/hide tabs
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tab}Tab`).classList.add("active");
  });
});

// ===========================
// Load Orders
// ===========================
async function loadOrders() {
  const ordersContent = document.getElementById("ordersContent");

  try {
    // ✅ Fixed: now works with API.orders.getByUser() added
    const response = await API.orders.getByUser(user.id);

    if (response.success && response.orders.length > 0) {
      renderOrders(response.orders);
    } else {
      ordersContent.innerHTML = `
        <div class="empty-orders">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <a href="shop.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    ordersContent.innerHTML = `
      <div class="empty-orders">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <h3>Error Loading Orders</h3>
        <p>We couldn't load your orders. Please try again later.</p>
      </div>
    `;
  }
}

// ===========================
// Render Orders
// ===========================
function renderOrders(orders) {
  const ordersContent = document.getElementById("ordersContent");

  console.log('Rendering orders:', orders); // Debug log

  const html = `
    <div class="orders-list">
      ${orders
        .map((order) => {
          const status = order.status || "processing";
          const statusText = {
            processing: "Processing",
            shipped: "Shipped",
            delivered: "Delivered",
            cancelled: "Cancelled",
          };

          const badgeClass =
            status === "delivered"
              ? "badge-success"
              : status === "cancelled"
              ? "badge-danger"
              : "badge-warning";

          // Calculate total if missing
          let orderTotal = order.total || 0;
          if (!orderTotal && order.items && order.items.length > 0) {
            orderTotal = order.items.reduce((sum, item) => {
              return sum + ((item.product?.price || 0) * (item.quantity || 1));
            }, 0);
            // Add tax and shipping if available
            if (order.tax) orderTotal += order.tax;
            if (order.shipping?.cost) orderTotal += order.shipping.cost;
          }
          
          console.log('Order:', order.id, 'Total:', orderTotal); // Debug log

          return `
            <div class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <div class="order-number">Order ${order.id}</div>
                  <div class="order-date">
                    Placed on ${formatDate(order.createdAt || new Date())}
                  </div>
                </div>
                <span class="badge ${badgeClass}">
                  ${statusText[status]}
                </span>
              </div>

              <div class="order-items-preview">
                ${order.items
                  .slice(0, 4)
                  .map(
                    (item) => `
                      <img src="${item.product.image}" alt="${item.product.name}"
                           class="order-item-thumb"
                           onerror="this.src='https://via.placeholder.com/60'">
                    `
                  )
                  .join("")}
                ${
                  order.items.length > 4
                    ? `<div style="width: 60px; height: 60px; background: var(--gray-200); 
                      border-radius: 6px; display: flex; align-items: center; 
                      justify-content: center; font-size: 0.875rem; font-weight: 600; 
                      color: var(--gray-600);">+${order.items.length - 4}</div>`
                    : ""
                }
              </div>

              <div class="order-footer">
                <div>
                  <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">
                    ${order.items.length} ${order.items.length === 1 ? 'Item' : 'Items'} • Total Amount
                  </div>
                  <div class="order-total">${formatPrice(orderTotal)}</div>
                </div>
                <div class="order-actions">
                  <a href="track-order.html?id=${
                    order.id
                  }" class="btn btn-secondary btn-sm">
                    Track Order
                  </a>
                  <a href="order-confirmation.html?id=${order.id}"
                     class="btn btn-outline btn-sm"
                     style="border: 2px solid var(--gray-300); color: var(--gray-700);">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  ordersContent.innerHTML = html;
}

// ===========================
// Settings Form
// ===========================
const settingsForm = document.getElementById("settingsForm");
settingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("settingsName").value.trim();
  const email = document.getElementById("settingsEmail").value.trim();
  const phone = document.getElementById("settingsPhone").value.trim();
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword =
    document.getElementById("confirmNewPassword").value;

  // Validation
  if (!name || !email) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (!isValidEmail(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  // Password validation
  if (newPassword || confirmNewPassword) {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
  }

  // Update user data
  const updatedUser = { ...user, name, email, phone };
  storage.set(CONFIG.USER_KEY, updatedUser);

  // Update display
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileEmail").textContent = email;

  // Clear password fields
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmNewPassword").value = "";

  toast.success("Settings updated successfully!");
  renderNavbar();
});

// ===========================
// Handle Logout
// ===========================
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    Auth.logout();
    window.location.href = "index.html";
  }
}

// ===========================
// Initialize Page
// ===========================
initProfile();
