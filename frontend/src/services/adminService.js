import api from './api';

const adminService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load users' };
    }
  },

  getAllAppointments: async (filters = {}) => {
    try {
      const response = await api.get('/appointments', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load appointments' };
    }
  },
};

export default adminService;
