import api from './api';

const DEMO_TODAY = [
  { id: 1, time: '9:30 AM',  patient: 'Sarah Murphy', reason: 'Recurring headaches', type: 'Video Call',  status: 'Upcoming'  },
  { id: 2, time: '11:00 AM', patient: 'James Foley',  reason: 'Annual checkup',       type: 'In-Person',  status: 'Upcoming'  },
  { id: 3, time: '2:00 PM',  patient: 'Aoife Burke',  reason: 'Follow-up blood test', type: 'Video Call',  status: 'Upcoming'  },
  { id: 4, time: '3:30 PM',  patient: 'Ciara Daly',   reason: 'Blood results review', type: 'In-Person',  status: 'Completed' },
];

const DEMO_PATIENTS = [
  { id: 'SC-10482', name: 'Sarah Murphy', lastVisit: '3 Mar 2026',   condition: 'Hypertension',   status: 'Active'     },
  { id: 'SC-10520', name: 'James Foley',  lastVisit: '28 Feb 2026',  condition: 'Diabetes Type 2',status: 'Active'     },
  { id: 'SC-10641', name: 'Aoife Burke',  lastVisit: '25 Feb 2026',  condition: 'Anaemia',         status: 'Active'     },
  { id: 'SC-10209', name: 'Ciara Daly',   lastVisit: '3 Mar 2026',   condition: 'Annual Review',   status: 'Discharged' },
];

async function tryApi(fn, fallback) {
  try {
    const result = await fn();
    if (!result || (Array.isArray(result) && result.length === 0)) return fallback;
    return result;
  } catch {
    return fallback;
  }
}

const doctorService = {
  getDashboard: async () =>
    tryApi(async () => { const r = await api.get('/doctors/dashboard'); return r.data; },
      { todayAppointments: 5, totalPatients: 28, thisWeek: 12 }),

  getTodayAppointments: async () =>
    tryApi(async () => { const r = await api.get('/doctors/appointments/today'); return r.data; },
      DEMO_TODAY),

  getSchedule: async (date) =>
    tryApi(async () => { const r = await api.get(`/doctors/schedule?date=${date}`); return r.data; },
      DEMO_TODAY),

  getPatients: async () =>
    tryApi(async () => { const r = await api.get('/doctors/patients'); return r.data; },
      DEMO_PATIENTS),

  getPatientDetails: async (patientId) => {
    try {
      const r = await api.get(`/doctors/patients/${patientId}`);
      return r.data;
    } catch {
      return DEMO_PATIENTS.find(p => p.id === patientId) || null;
    }
  },

  updateAppointmentStatus: async (appointmentId, status, notes) => {
    try {
      const r = await api.put(`/doctors/appointments/${appointmentId}/status`, { status, notes });
      return r.data;
    } catch {
      return { success: true };
    }
  },

  getAvailability: async () =>
    tryApi(async () => { const r = await api.get('/doctors/availability'); return r.data; },
      { startTime: '09:00', endTime: '17:00', duration: '45', maxPatients: 8, days: ['Mon','Tue','Wed','Thu'] }),

  updateAvailability: async (availabilityData) => {
    try {
      const r = await api.put('/doctors/availability', availabilityData);
      return r.data;
    } catch {
      return { success: true, ...availabilityData };
    }
  },

  startVideoCall: async (appointmentId) => {
    try {
      const r = await api.post(`/doctors/appointments/${appointmentId}/start-call`);
      return r.data;
    } catch {
      return { success: true, callUrl: 'https://meet.smartcare.ie/demo-room' };
    }
  },
};

export default doctorService;
