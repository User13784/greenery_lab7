const API_URL = 'http://localhost:3001';

export const api = {
  async getProducts() {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  async getProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  async addProduct(data) {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async updateProduct(id, data) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  async getCart() {
    const response = await fetch(`${API_URL}/cart`);
    return response.json();
  },

  async addToCart(item) {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return response.json();
  },

  async updateCartItem(id, quantity) {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return response.json();
  },

  async removeFromCart(id) {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  async getFavorites() {
    const response = await fetch(`${API_URL}/favorites`);
    return response.json();
  },

  async addToFavorites(item) {
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return response.json();
  },

  async removeFromFavorites(id) {
    const response = await fetch(`${API_URL}/favorites/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  async getUsers() {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  async registerUser(data) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async loginUser(email) {
    const response = await fetch(`${API_URL}/users?email=${email}`);
    const users = await response.json();
    return users[0] || null;
  },

  async getFeedback() {
    const response = await fetch(`${API_URL}/feedback`);
    return response.json();
  },

  async addFeedback(data) {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async deleteFeedback(id) {
    const response = await fetch(`${API_URL}/feedback/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
};

export default api;