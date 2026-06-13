import api from './api';

// ─── DEMO USERS (bypass database entirely) ───────────────────────────────────
const DEMO_USERS = {
  'sarah.murphy@gmail.com': {
    password: 'SecurePass123!',
    user: {
      user_id: 1,
      email: 'sarah.murphy@gmail.com',
      role: 'patient',
      name: 'Sarah Murphy',
      first_name: 'Sarah',
      last_name: 'Murphy',
      patient_id: 'SC-10482',
    },
  },
  'dr.obrien@beaumont.ie': {
    password: 'DoctorPass123!',
    user: {
      user_id: 2,
      email: 'dr.obrien@beaumont.ie',
      role: 'doctor',
      name: "Dr. Michael O'Brien",
      first_name: 'Michael',
      last_name: "O'Brien",
      doctor_id: 'DOC-001',
    },
  },
  'admin@smartcare.com': {
    password: 'admin123',
    user: {
      user_id: 3,
      email: 'admin@smartcare.com',
      role: 'admin',
      name: 'Admin User',
      first_name: 'Admin',
      last_name: 'User',
    },
  },
  // Also support the .ie variant shown in the HTML prototype
  'admin@smartcare.ie': {
    password: 'admin123',
    user: {
      user_id: 3,
      email: 'admin@smartcare.ie',
      role: 'admin',
      name: 'Admin User',
      first_name: 'Admin',
      last_name: 'User',
    },
  },
};

const DEMO_TOKEN = 'demo-jwt-token-smartcare-2026';

const authService = {
  // Login user — tries demo bypass first, then real API
  login: async (email, password, role) => {
    // ── DEMO BYPASS ──────────────────────────────────────────────────────────
    const demo = DEMO_USERS[email.toLowerCase().trim()];
    if (demo && demo.password === password) {
      const user = { ...demo.user, role: role || demo.user.role };
      localStorage.setItem('smartcare_token', DEMO_TOKEN);
      localStorage.setItem('smartcare_user', JSON.stringify(user));
      return { success: true, token: DEMO_TOKEN, user };
    }

    // ── REAL API (when backend is running) ───────────────────────────────────
    try {
      const response = await api.post('/auth/login', { email, password, role });
      if (response.data.token) {
        localStorage.setItem('smartcare_token', response.data.token);
        localStorage.setItem('smartcare_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // If the API is down and no demo match, give a clear message
      throw { error: 'Invalid credentials. Use demo credentials or start the backend.' };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('smartcare_token', response.data.token);
        localStorage.setItem('smartcare_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    // Return stored user for demo mode
    const stored = authService.getStoredUser();
    if (stored) return stored;
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Password change failed' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('smartcare_token');
    localStorage.removeItem('smartcare_user');
  },

  // Check if user is logged in
  isAuthenticated: () => {
    const token = localStorage.getItem('smartcare_token');
    return !!token;
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('smartcare_user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
