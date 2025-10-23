// Authentication Management

const Auth = {
  // Login
  async login(email, password) {
    if (typeof email === "object" && email !== null) {
      const obj = email;
      email = obj.email;
      password = obj.password;
    }
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      storage.set(CONFIG.TOKEN_KEY, data.token);
      storage.set(CONFIG.USER_KEY, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      // Mock login
      if (email === "admin@store.com" && password === "admin123") {
        const mockUser = {
          id: "admin",
          email,
          name: "Admin User",
          role: "admin",
        };
        storage.set(CONFIG.TOKEN_KEY, "mock-token-admin");
        storage.set(CONFIG.USER_KEY, mockUser);
        return { success: true, user: mockUser };
      } else if (password.length >= 6) {
        const mockUser = {
          id: Date.now().toString(),
          email,
          name: email.split("@")[0],
          role: "customer",
        };
        storage.set(CONFIG.TOKEN_KEY, "mock-token-" + Date.now());
        storage.set(CONFIG.USER_KEY, mockUser);
        return { success: true, user: mockUser };
      }
      throw error;
    }
  },

  // Register
  async register(name, email, password) {
    if (typeof name === "object" && name !== null) {
      const obj = name;
      name = obj.name;
      email = obj.email;
      password = obj.password;
    }
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      storage.set(CONFIG.TOKEN_KEY, data.token);
      storage.set(CONFIG.USER_KEY, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Register error:", error);
      // Mock registration
      if (password.length >= 6) {
        const mockUser = {
          id: Date.now().toString(),
          email,
          name,
          role: "customer",
        };
        storage.set(CONFIG.TOKEN_KEY, "mock-token-" + Date.now());
        storage.set(CONFIG.USER_KEY, mockUser);
        return { success: true, user: mockUser };
      }
      throw error;
    }
  },

  logout() {
    const user = this.getUser();
    
    // Clear user authentication
    storage.remove(CONFIG.TOKEN_KEY);
    storage.remove(CONFIG.USER_KEY);
    
    // Clear user-specific data
    if (user) {
      storage.remove(`cart_${user.id}`);
      storage.remove(`wishlist_${user.id}`);
    }
    
    // Also clear any legacy global keys
    storage.remove(CONFIG.CART_KEY);
    storage.remove('wishlist');
    
    // Redirect to home page
    window.location.href = "index.html";
  },

  getToken() {
    return storage.get(CONFIG.TOKEN_KEY);
  },

  getUser() {
    return storage.get(CONFIG.USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === "admin";
  },
};
