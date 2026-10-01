// Centralized API service for the Amazon Green backend
const API_BASE = '/api';

// Helper for making requests
async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // send cookies
    ...options,
  };

  const response = await fetch(`${API_BASE}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ==================== AUTH ====================
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  getMe: () =>
    request('/auth/me'),
};

// ==================== PRODUCTS ====================
export const productAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return request(`/products?${searchParams}`);
  },

  getById: (id) =>
    request(`/products/${id}`),

  getByCategory: (slug) =>
    request(`/products/category/${slug}`),

  search: (query) =>
    request(`/products/search?q=${encodeURIComponent(query)}`),

  // Seller only
  create: (productData) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),

  getSellerProducts: () =>
    request('/products/seller/mine'),
};

// ==================== CATEGORIES ====================
export const categoryAPI = {
  getAll: () => request('/categories'),
};

// ==================== CART ====================
export const cartAPI = {
  get: () => request('/cart'),

  addItem: (productId, quantity = 1) =>
    request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  updateItem: (productId, quantity) =>
    request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    }),

  removeItem: (productId) =>
    request(`/cart/remove/${productId}`, { method: 'DELETE' }),

  clear: () =>
    request('/cart/clear', { method: 'DELETE' }),
};

// ==================== ORDERS ====================
export const orderAPI = {
  create: (shippingAddress, greenPointsUsed = 0) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, greenPointsUsed }),
    }),

  getAll: () => request('/orders'),

  getById: (id) => request(`/orders/${id}`),

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  initiateReturn: (id, returnType, returnReason) =>
    request(`/orders/${id}/return`, {
      method: 'POST',
      body: JSON.stringify({ returnType, returnReason }),
    }),

  getSellerOrders: () => request('/orders/seller'),
};

// ==================== REVIEWS ====================
export const reviewAPI = {
  getForProduct: (productId) =>
    request(`/reviews/product/${productId}`),

  create: (reviewData) =>
    request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  markHelpful: (id, isHelpful) =>
    request(`/reviews/${id}/helpful`, {
      method: 'PUT',
      body: JSON.stringify({ isHelpful }),
    }),

  delete: (id) =>
    request(`/reviews/${id}`, { method: 'DELETE' }),
};

// ==================== QUIZZES ====================
export const quizAPI = {
  getAll: (category) => {
    const params = category ? `?category=${category}` : '';
    return request(`/quizzes${params}`);
  },

  getById: (id) => request(`/quizzes/${id}`),

  submit: (id, answers) =>
    request(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getProgress: () => request('/quizzes/progress'),
};

// ==================== USERS ====================
export const userAPI = {
  getProfile: () => request('/users/profile'),

  updateProfile: (data) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getGreenPoints: () => request('/users/green-points'),

  getLeaderboard: (scope = 'global') =>
    request(`/users/leaderboard?scope=${scope}`),
};

// ==================== MARKETPLACE ====================
export const marketplaceAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return request(`/marketplace?${searchParams}`);
  },

  getById: (id) => request(`/marketplace/${id}`),

  create: (listingData) =>
    request('/marketplace', {
      method: 'POST',
      body: JSON.stringify(listingData),
    }),

  update: (id, listingData) =>
    request(`/marketplace/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    }),

  delete: (id) =>
    request(`/marketplace/${id}`, { method: 'DELETE' }),

  getMyListings: () => request('/marketplace/mine'),
};
