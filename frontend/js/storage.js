// LocalStorage service for offline functionality

const STORAGE_KEYS = {
  PRODUCTS: 'ecommerce_products',
  ORDERS: 'ecommerce_orders',
  CART: 'ecommerce_cart'
};

// Helper function to get data from localStorage
function getData(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error getting data from localStorage (${key}):`, error);
    return defaultValue;
  }
}

// Helper function to save data to localStorage
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error);
    return false;
  }
}

// Products
const products = {
  getAll: () => getData(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS),
  getById: (id) => products.getAll().find(p => p.id === id),
  create: (product) => {
    const products = products.getAll();
    const newProduct = { ...product, id: Date.now().toString() };
    products.push(newProduct);
    saveData(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },
  update: (id, updates) => {
    const products = products.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      saveData(STORAGE_KEYS.PRODUCTS, products);
      return products[index];
    }
    return null;
  },
  delete: (id) => {
    const products = products.getAll();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length < products.length) {
      saveData(STORAGE_KEYS.PRODUCTS, filtered);
      return true;
    }
    return false;
  }
};

// Orders
const orders = {
  getAll: () => getData(STORAGE_KEYS.ORDERS, []),
  getById: (id) => orders.getAll().find(o => o.id === id),
  create: (order) => {
    const orders = orders.getAll();
    const newOrder = { ...order, id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() };
    orders.push(newOrder);
    saveData(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },
  updateStatus: (id, status) => {
    const orders = orders.getAll();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      saveData(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  }
};

// Cart
const cart = {
  get: () => getData(STORAGE_KEYS.CART, { items: [], total: 0 }),
  update: (newCart) => saveData(STORAGE_KEYS.CART, newCart),
  clear: () => saveData(STORAGE_KEYS.CART, { items: [], total: 0 })
};

// Export the storage service
const StorageService = { products, orders, cart };

export default StorageService;
