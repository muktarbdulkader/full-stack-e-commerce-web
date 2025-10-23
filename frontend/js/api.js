// API Service

const API = {
  // Helper method for making requests
  async request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // =========================
  // PRODUCTS
  // =========================
  products: {
    async getAll(params = {}) {
      try {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/products${queryString ? "?" + queryString : ""}`;
        return await API.request(endpoint);
      } catch (error) {
        // Return mock data if API fails
        console.log("Using mock products data");
        return {
          success: true,
          products: MOCK_PRODUCTS,
          count: MOCK_PRODUCTS.length,
        };
      }
    },

    async getById(id) {
      try {
        return await API.request(`/products/${id}`);
      } catch (error) {
        // Return mock data
        const product = MOCK_PRODUCTS.find((p) => p.id === id);
        if (product) {
          return { success: true, product };
        }
        throw error;
      }
    },

    async create(productData) {
      return await API.request("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
    },

    async update(id, productData) {
      return await API.request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });
    },

    async delete(id) {
      return await API.request(`/products/${id}`, {
        method: "DELETE",
      });
    },

    async addReview(id, reviewData) {
      return await API.request(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewData),
      });
    },
  },

  // =========================
  // ORDERS
  // =========================
  orders: {
    async create(orderData) {
      try {
        return await API.request("/orders", {
          method: "POST",
          body: JSON.stringify(orderData),
        });
      } catch (error) {
        // Mock order creation
        console.log("Using mock order creation");
        const user = Auth.getUser();
        const order = {
          id: generateId(),
          userId: user?.id,
          ...orderData,
          status: "pending",
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };

        // Save to storage
        const orders = storage.get("orders") || [];
        orders.push(order);
        storage.set("orders", orders);

        console.log("Order created:", order);
        return { success: true, order };
      }
    },

    async getAll() {
      try {
        return await API.request("/orders");
      } catch (error) {
        // Return mock orders
        const orders = storage.get("orders") || [];
        return { success: true, orders, count: orders.length };
      }
    },

    async getById(id) {
      try {
        return await API.request(`/orders/${id}`);
      } catch (error) {
        // Return mock order
        const orders = storage.get("orders") || [];
        const order = orders.find((o) => o.id === id);
        if (order) {
          return { success: true, order };
        }
        throw error;
      }
    },

    // ✅ NEW FUNCTION: get orders by user
    async getByUser(userId) {
      try {
        return await API.request(`/orders/user/${userId}`);
      } catch (error) {
        // Return mock orders for this user
        console.log("Using mock user orders");
        const orders = storage.get("orders") || [];
        const userOrders = orders.filter((o) => o.userId === userId);
        return { success: true, orders: userOrders, count: userOrders.length };
      }
    },

    async updateStatus(id, status) {
      try {
        return await API.request(`/orders/${id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status }),
        });
      } catch (error) {
        // Mock update
        const orders = storage.get("orders") || [];
        const order = orders.find((o) => o.id === id);
        if (order) {
          order.status = status;
          storage.set("orders", orders);
          return { success: true, order };
        }
        throw error;
      }
    },
  },

  // =========================
  // CART
  // =========================
  cart: {
    // Get user-specific cart key
    getCartKey() {
      const user = Auth.getUser();
      return user ? `cart_${user.id}` : CONFIG.CART_KEY;
    },

    get() {
      return storage.get(this.getCartKey()) || [];
    },

    add(product, quantity = 1) {
      const cart = this.get();
      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          productId: product.id,
          product: product,
          quantity: quantity,
        });
      }

      storage.set(this.getCartKey(), cart);
      return cart;
    },

    update(productId, quantity) {
      const cart = this.get();
      const item = cart.find((item) => item.product.id === productId);

      if (item) {
        item.quantity = quantity;
        storage.set(this.getCartKey(), cart);
      }

      return cart;
    },

    remove(productId) {
      let cart = this.get();
      cart = cart.filter((item) => item.product.id !== productId);
      storage.set(this.getCartKey(), cart);
      return cart;
    },

    clear() {
      storage.remove(this.getCartKey());
      return [];
    },

    getCount() {
      const cart = this.get();
      return cart.reduce((count, item) => count + item.quantity, 0);
    },

    getTotal() {
      return calculateCartTotal(this.get());
    },
  },
};
