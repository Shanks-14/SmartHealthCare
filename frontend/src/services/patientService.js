import api from './api';

const patientService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/patients/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load dashboard' };
    }
  },

  getUpcomingAppointments: async () => {
    try {
      const response = await api.get('/appointments/upcoming');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load appointments' };
    }
  },

  getAppointments: async () => {
    try {
      const response = await api.get('/appointments/patient');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load appointments' };
    }
  },

  bookAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments/book', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to book appointment' };
    }
  },

  cancelAppointment: async (appointmentId, reason) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to cancel appointment' };
    }
  },

  getMedicalReports: async () => {
    try {
      const response = await api.get('/patients/reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load reports' };
    }
  },

  downloadReport: async (reportId) => {
    try {
      const response = await api.get(`/patients/reports/${reportId}/download`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to download report' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/patients/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  getHealthMetrics: async () => {
    try {
      const response = await api.get('/patients/health-metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load health metrics' };
    }
  },
};

export default patientService;
