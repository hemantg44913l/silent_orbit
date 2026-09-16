/**
 * API Service Client - 100% MongoDB & Real Data Driven
 */

const API_BASE = '/api';

export const api = {
  /**
   * Register User in MongoDB
   */
  async registerUser(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || json.message || `HTTP ${res.status}`);
    }
    return json.data;
  },

  /**
   * Login User against MongoDB
   */
  async loginUser(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || json.message || `HTTP ${res.status}`);
    }
    return json.data;
  },

  /**
   * Get Current User Profile from MongoDB
   */
  async getMe(emailOrId) {
    const res = await fetch(`${API_BASE}/auth/me?email=${encodeURIComponent(emailOrId)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  /**
   * Fetch available materials from MongoDB
   */
  async fetchMaterials() {
    try {
      const res = await fetch(`${API_BASE}/materials`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[API Client] Error fetching materials from database:', err.message);
      return [];
    }
  },

  /**
   * Fetch vendors from MongoDB
   */
  async fetchVendors(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/vendors${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[API Client] Error fetching vendors from database:', err.message);
      return [];
    }
  },

  /**
   * Fetch reuse recommendations from MongoDB
   */
  async fetchReuseOptions(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/reuse-options${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[API Client] Error fetching reuse options from database:', err.message);
      return [];
    }
  },

  /**
   * Fetch disposal and recovery routes from MongoDB
   */
  async fetchDisposalOptions(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/disposal-options${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[API Client] Error fetching disposal options from database:', err.message);
      return [];
    }
  },

  /**
   * Fetch municipal collection points from MongoDB
   */
  async fetchCollectionPoints() {
    try {
      const res = await fetch(`${API_BASE}/collection-points`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[API Client] Error fetching collection points:', err.message);
      return [];
    }
  },

  /**
   * Submit textile batch to MongoDB
   */
  async submitTextile(payload) {
    const res = await fetch(`${API_BASE}/textiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Run candidate matching against MongoDB vendors
   */
  async matchTextile(criteria) {
    const res = await fetch(`${API_BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  },

  /**
   * Create a new Order in MongoDB
   */
  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Get Order by Tracking ID / Consignment Number from MongoDB
   */
  async getOrderById(orderId) {
    if (!orderId) throw new Error('Order ID is required');
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId.trim())}`);
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || 'Order not found');
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Submit Contact Us inquiry to MongoDB
   */
  async submitContact(payload) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Submit Feedback to MongoDB
   */
  async submitFeedback(payload) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Ask AI Chatbot for Doubts & Queries
   */
  async askAIChatbot(message, history = []) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch All Previous Orders from MongoDB Database
   */
  async fetchAllOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[API Client] Error fetching all orders from database:', err.message);
      return [];
    }
  }
};
