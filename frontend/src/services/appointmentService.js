import api from './api';

const appointmentService = {
  getAllAppointments: async (filters = {}) => {
    try {
      const response = await api.get('/appointments', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load appointments' };
    }
  },

  getAppointmentDetails: async (appointmentId) => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load appointment details' };
    }
  },

  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/slots`, { params: { date } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load available slots' };
    }
  },

  getAllDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load doctors' };
    }
  },
};

export default appointmentService;
