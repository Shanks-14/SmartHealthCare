import api from './api';

const DEMO_DOCTORS = [
  { id: 1, name: "Dr. M. O'Brien", specialty: 'General Practice', fee: 65,  available: true },
  { id: 2, name: 'Dr. A. Walsh',   specialty: 'Cardiology',        fee: 90,  available: true },
  { id: 3, name: 'Dr. P. Nolan',   specialty: 'Pediatrics',        fee: 55,  available: true },
  { id: 4, name: 'Dr. J. Connell', specialty: 'Neurology',         fee: 110, available: true },
];

const DEMO_SLOTS = ['9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'];

async function tryApi(fn, fallback) {
  try {
    const result = await fn();
    if (!result || (Array.isArray(result) && result.length === 0)) return fallback;
    return result;
  } catch {
    return fallback;
  }
}

const appointmentService = {
  getAllAppointments: async (filters = {}) =>
    tryApi(async () => { const r = await api.get('/appointments', { params: filters }); return r.data; }, []),

  getAppointmentDetails: async (appointmentId) => {
    try {
      const r = await api.get(`/appointments/${appointmentId}`);
      return r.data;
    } catch {
      return null;
    }
  },

  getAvailableSlots: async (doctorId, date) =>
    tryApi(async () => {
      const r = await api.get(`/doctors/${doctorId}/slots`, { params: { date } });
      return r.data;
    }, DEMO_SLOTS),

  getAllDoctors: async () =>
    tryApi(async () => { const r = await api.get('/doctors'); return r.data; }, DEMO_DOCTORS),
};

export default appointmentService;
