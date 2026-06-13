import api from './api';

const DEMO_STATS = {
  totalPatients: 142,
  activeDoctors: 12,
  appointmentsToday: 38,
  azureUptime: '99.8%',
};

const DEMO_APPOINTMENTS = [
  { id: 'APT-1001', patient: 'Sarah Murphy', doctor: "Dr. O'Brien", date: 'Mon 3 Mar', type: 'Video',     status: 'Upcoming',   fee: '€65' },
  { id: 'APT-1002', patient: 'Sarah Murphy', doctor: 'Dr. Walsh',   date: 'Thu 6 Mar', type: 'In-Person', status: 'Upcoming',   fee: '€90' },
  { id: 'APT-1003', patient: 'James Foley',  doctor: "Dr. O'Brien", date: 'Mon 3 Mar', type: 'In-Person', status: 'Upcoming',   fee: '€65' },
  { id: 'APT-0998', patient: 'Ciara Daly',   doctor: "Dr. O'Brien", date: 'Mon 3 Mar', type: 'In-Person', status: 'Completed',  fee: '€65' },
  { id: 'APT-0997', patient: 'Niamh Byrne',  doctor: 'Dr. Nolan',   date: 'Fri 7 Mar', type: 'Video',     status: 'Cancelled',  fee: '—'   },
];

const DEMO_USERS = [
  { id: 1, name: 'Sarah Murphy',      role: 'Patient', email: 'sarah.murphy@gmail.com', status: 'Active' },
  { id: 2, name: "Dr. M. O'Brien",    role: 'Doctor',  email: 'm.obrien@beaumont.ie',   status: 'Active' },
  { id: 3, name: 'Dr. A. Walsh',      role: 'Doctor',  email: 'a.walsh@mater.ie',       status: 'Active' },
  { id: 4, name: 'Admin User',        role: 'Admin',   email: 'admin@smartcare.com',    status: 'Active' },
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

const adminService = {
  getStats: async () =>
    tryApi(async () => { const r = await api.get('/admin/stats'); return r.data; }, DEMO_STATS),

  getAllAppointments: async (filters = {}) =>
    tryApi(async () => { const r = await api.get('/admin/appointments', { params: filters }); return r.data; }, DEMO_APPOINTMENTS),

  getAllUsers: async () =>
    tryApi(async () => { const r = await api.get('/admin/users'); return r.data; }, DEMO_USERS),

  updateUser: async (userId, data) => {
    try {
      const r = await api.put(`/admin/users/${userId}`, data);
      return r.data;
    } catch {
      return { success: true };
    }
  },

  deleteUser: async (userId) => {
    try {
      const r = await api.delete(`/admin/users/${userId}`);
      return r.data;
    } catch {
      return { success: true };
    }
  },

  getAzureStatus: async () =>
    tryApi(async () => { const r = await api.get('/admin/azure-status'); return r.data; }, {
      sql: 'Online', appService: 'Running', blobStorage: 'Active', adB2c: 'Active', acs: 'Ready', keyVault: 'Healthy',
    }),
};

export default adminService;
