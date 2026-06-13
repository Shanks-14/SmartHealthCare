import api from './api';

// ── Demo data (used when backend is offline) ──────────────────────────────────
const DEMO_APPOINTMENTS_UPCOMING = [
  { id: 1, doctor: "Dr. Michael O'Brien", specialty: 'General Practitioner', date: 'Mon 3 Mar 2026', time: '10:30 AM', type: 'Video Call', status: 'Upcoming', fee: '€65' },
  { id: 2, doctor: 'Dr. Anna Walsh',       specialty: 'Cardiologist',         date: 'Thu 6 Mar 2026', time: '2:00 PM',  type: 'In-Person', status: 'Upcoming', fee: '€90' },
  { id: 3, doctor: 'Dr. Patricia Nolan',   specialty: 'Pediatrician',         date: 'Fri 7 Mar 2026', time: '11:00 AM', type: 'Video Call', status: 'Upcoming', fee: '€55' },
];

const DEMO_APPOINTMENTS_ALL = [
  ...DEMO_APPOINTMENTS_UPCOMING,
  { id: 4, doctor: "Dr. Michael O'Brien", specialty: 'General Practitioner', date: '18 Jan 2026', time: '9:30 AM', type: 'Video Call', status: 'Completed', fee: '€65' },
  { id: 5, doctor: 'Dr. Anna Walsh',       specialty: 'Cardiologist',         date: '5 Dec 2025',  time: '2:00 PM', type: 'In-Person',  status: 'Cancelled', fee: '—'  },
];

const DEMO_REPORTS = [
  { id: 1, name: 'Blood_Test_Jan2026.pdf',      size: '1.2 MB', date: '18 Jan 2026', doctor: "Dr. M. O'Brien", type: 'Lab Report'   },
  { id: 2, name: 'Chest_Xray_Dec2025.pdf',      size: '3.8 MB', date: '12 Dec 2025', doctor: 'Dr. A. Walsh',   type: 'Imaging'      },
  { id: 3, name: 'ECG_Report_Nov2025.pdf',       size: '0.9 MB', date: '5 Nov 2025',  doctor: 'Dr. A. Walsh',   type: 'Cardiology'   },
  { id: 4, name: 'Annual_Physical_Oct2025.pdf',  size: '2.1 MB', date: '20 Oct 2025', doctor: "Dr. M. O'Brien", type: 'Physical Exam'},
  { id: 5, name: 'Allergy_Test_Sep2025.pdf',     size: '1.5 MB', date: '15 Sep 2025', doctor: 'Dr. P. Nolan',   type: 'Allergy Test' },
];

const DEMO_METRICS = [
  { label: 'Blood Pressure', value: '118/76', status: 'Normal', color: 'green'  },
  { label: 'Glucose',        value: '5.4 mmol', status: 'Normal', color: 'green'  },
  { label: 'O₂ Saturation',  value: '98%',    status: 'Normal', color: 'green'  },
  { label: 'Cholesterol',    value: '5.9 mmol', status: 'Monitor', color: 'amber' },
];

// ── Helper: try API, fall back to demo data ───────────────────────────────────
async function tryApi(fn, fallback) {
  try {
    const result = await fn();
    // If API returns empty array / null, still use demo data
    if (!result || (Array.isArray(result) && result.length === 0)) return fallback;
    return result;
  } catch {
    return fallback;
  }
}

const patientService = {
  getDashboard: async () =>
    tryApi(async () => {
      const r = await api.get('/patients/dashboard');
      return r.data;
    }, { upcomingAppointments: 3, heartRate: 72, reports: 7, lastVisit: '18 Jan 2026' }),

  getUpcomingAppointments: async () =>
    tryApi(async () => {
      const r = await api.get('/appointments/upcoming');
      return r.data;
    }, DEMO_APPOINTMENTS_UPCOMING),

  getAppointments: async () =>
    tryApi(async () => {
      const r = await api.get('/appointments/patient');
      return r.data;
    }, DEMO_APPOINTMENTS_ALL),

  bookAppointment: async (appointmentData) => {
    try {
      const r = await api.post('/appointments/book', appointmentData);
      return r.data;
    } catch {
      // Demo: simulate successful booking
      return { success: true, appointment_id: `APT-${Date.now()}`, ...appointmentData };
    }
  },

  cancelAppointment: async (appointmentId, reason) => {
    try {
      const r = await api.put(`/appointments/${appointmentId}/cancel`, { reason });
      return r.data;
    } catch {
      return { success: true };
    }
  },

  getMedicalReports: async () =>
    tryApi(async () => {
      const r = await api.get('/patients/reports');
      return r.data;
    }, DEMO_REPORTS),

  downloadReport: async (reportId) => {
    try {
      const r = await api.get(`/patients/reports/${reportId}/download`, { responseType: 'blob' });
      return r.data;
    } catch {
      return null;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const r = await api.put('/patients/profile', profileData);
      return r.data;
    } catch {
      return { success: true, ...profileData };
    }
  },

  getHealthMetrics: async () =>
    tryApi(async () => {
      const r = await api.get('/patients/health-metrics');
      return r.data;
    }, DEMO_METRICS),
};

export default patientService;
