// Checkout Page Logic

const cart = API.cart.get();

// Check if cart is empty
if (cart.length === 0) {
  window.location.href = "cart.html";
}

// Populate form with user data if logged in
const user = Auth.getUser();
if (user) {
  document.getElementById("firstName").value = user.name.split(" ")[0] || "";
  document.getElementById("lastName").value =
    user.name.split(" ").slice(1).join(" ") || "";
  document.getElementById("email").value = user.email || "";
}

// Render order items
function renderOrderItems() {
  const orderItems = document.getElementById("orderItems");
  orderItems.innerHTML = cart
    .map(
      (item) => `
        <div class="summary-item">
            <img src="${item.product.image}" alt="${
        item.product.name
      }" class="summary-item-image" onerror="this.src='https://via.placeholder.com/60'">
            <div class="summary-item-details">
                <div class="summary-item-name">${item.product.name}</div>
                <div class="summary-item-meta">Qty: ${item.quantity}</div>
            </div>
            <div class="summary-item-price">${formatPrice(
              item.product.price * item.quantity
            )}</div>
        </div>
    `
    )
    .join("");
}

// Calculate and render totals
function renderTotals() {
  const subtotal = calculateCartTotal(cart);
  const { shipping, tax, total } = calculateOrderTotals(subtotal);

  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : formatPrice(shipping);
  document.getElementById("tax").textContent = formatPrice(tax);
  document.getElementById("total").textContent = formatPrice(total);
}

// Toggle card payment fields
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const cardPaymentFields = document.getElementById("cardPaymentFields");

paymentMethods.forEach((method) => {
  method.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      cardPaymentFields.style.display = "block";
      document.getElementById("cardNumber").required = true;
      document.getElementById("expiryDate").required = true;
      document.getElementById("cvv").required = true;
    } else {
      cardPaymentFields.style.display = "none";
      document.getElementById("cardNumber").required = false;
      document.getElementById("expiryDate").required = false;
      document.getElementById("cvv").required = false;
    }
  });
});

// Format card number
document.getElementById("cardNumber")?.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\s/g, "");
  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
  e.target.value = formattedValue;
});

// Format expiry date
document.getElementById("expiryDate")?.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  e.target.value = value;
});

// Format CVV
document.getElementById("cvv")?.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "");
});

// Handle form submission
const checkoutForm = document.getElementById("checkoutForm");
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).value;

  // Validate card fields if card payment is selected
  if (paymentMethod === "card") {
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    if (!cardNumber || cardNumber.length < 13) {
      toast.error("Please enter a valid card number");
      return;
    }

    if (!expiryDate || expiryDate.length !== 5) {
      toast.error("Please enter a valid expiry date");
      return;
    }

    if (!cvv || cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return;
    }
  }

  // Prepare order data
  const orderData = {
    shipping: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      zipCode: document.getElementById("zipCode").value,
    },
    payment: {
      method: paymentMethod,
    },
    items: cart,
    notes: document.getElementById("orderNotes").value,
    subtotal: calculateCartTotal(cart),
  };

  const { shipping, tax, total } = calculateOrderTotals(orderData.subtotal);
  orderData.shipping.cost = shipping;
  orderData.tax = tax;
  orderData.total = total;

  // Disable submit button
  const submitBtn = checkoutForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing Order...";

  try {
    // Create order
    const response = await API.orders.create(orderData);

    if (response && (response.success || response.order)) {
      // Clear cart
      API.cart.clear();

      // Get order ID from response
      const orderId =
        response.order?.id || response.id || "ORDER-" + Date.now();

      // Redirect to confirmation page
      window.location.href = `order-confirmation.html?id=${orderId}`;
    } else {
      throw new Error(response?.message || "Failed to create order");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error(error.message || "Failed to process order. Please try again.");

    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = "Place Order";
  }
});

// Initialize
renderOrderItems();
renderTotals();
