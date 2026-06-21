import api from './api';

const doctorService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/doctors/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load dashboard' };
    }
  },

  getTodayAppointments: async () => {
    try {
      const response = await api.get('/doctors/appointments/today');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load appointments' };
    }
  },

  getSchedule: async (date) => {
    try {
      const response = await api.get(`/doctors/schedule?date=${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load schedule' };
    }
  },

  getPatients: async () => {
    try {
      const response = await api.get('/doctors/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load patients' };
    }
  },

  getPatientDetails: async (patientId) => {
    try {
      const response = await api.get(`/doctors/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load patient details' };
    }
  },

  updateAppointmentStatus: async (appointmentId, status, notes) => {
    try {
      const response = await api.put(`/doctors/appointments/${appointmentId}/status`, { status, notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update appointment' };
    }
  },

  getAvailability: async () => {
    try {
      const response = await api.get('/doctors/availability');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to load availability' };
    }
  },

  updateAvailability: async (availabilityData) => {
    try {
      const response = await api.put('/doctors/availability', availabilityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update availability' };
    }
  },

  startVideoCall: async (appointmentId) => {
    try {
      const response = await api.post(`/doctors/appointments/${appointmentId}/start-call`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to start video call' };
    }
  },
};

export default doctorService;
