import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { FaCalendarCheck, FaUsers, FaClock, FaVideo } from 'react-icons/fa';
import doctorService from '../../services/doctorService';
import authService from '../../services/authService';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todayAppointments: 0, totalPatients: 0, thisWeek: 0 });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // ── Try cached demo data first ─────────────────────
      const cached = authService.getDashboardData();
      if (cached) {
        setStats(cached.stats || { todayAppointments: 0, totalPatients: 0, thisWeek: 0 });
        setTodaySchedule(cached.todayAppointments || []);
        setRecentPatients(cached.recentPatients || []);
        setLoading(false);
        return;
      }

      // ── Real API call ───────────────────────────────────
      const data = await doctorService.getTodayAppointments();
      setTodaySchedule(data || []);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { icon: <FaCalendarCheck />, bg: 'bg-teal-50',  value: stats.todayAppointments, label: "Today's Appointments", color: 'teal'  },
    { icon: <FaUsers />,         bg: 'bg-blue-50',  value: stats.totalPatients,      label: 'Total Patients',       color: 'blue'  },
    { icon: <FaClock />,         bg: 'bg-green-50', value: stats.thisWeek,           label: 'This Week',            color: 'green' },
  ];

  return (
    <Layout title="Doctor Overview">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statsCards.map((stat, idx) => (
          <Card key={idx} className="text-center">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
              <span className={`text-${stat.color}-500`}>{stat.icon}</span>
            </div>
            <div className="font-serif text-2xl font-semibold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            <div className="text-[10px] text-blue-500 mt-2 font-semibold">⚡ Azure SQL</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card title="Today's Schedule — Mon 3 Mar" subtitle="GET /api/doctor/appointments?date=today · Azure SQL">
          <div className="space-y-3">
            {todaySchedule.length === 0 && !loading && (
              <p className="text-sm text-gray-400 text-center py-4">No appointments today</p>
            )}
            {todaySchedule.map((appt) => (
              <div
                key={appt.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  appt.status === 'Completed'
                    ? 'opacity-60 bg-gray-50 border-gray-100'
                    : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200'
                }`}
              >
                <div className="w-12 text-center">
                  <div className="text-xs font-bold text-gray-500">{appt.time}</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                  {appt.patient?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{appt.patient}</div>
                  <div className="text-xs text-gray-400">{appt.reason} · {appt.type}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  appt.status === 'Upcoming' ? 'bg-teal-50 text-teal-600' : 'bg-green-50 text-green-600'
                }`}>
                  {appt.status}
                </span>
                {appt.type === 'Video Call' && appt.status === 'Upcoming' && (
                  <Button size="sm" variant="primary" onClick={() => toast.info('Starting video call…')}>
                    <FaVideo className="mr-1" /> Start Call
                  </Button>
                )}
                {appt.type === 'In-Person' && appt.status === 'Upcoming' && (
                  <Button size="sm" variant="outline" onClick={() => toast.info('Loading patient file…')}>
                    View File
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {/* Recent Patients */}
          <Card title="Recent Patients" subtitle="GET /api/doctor/patients · Azure SQL">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-bold text-gray-400">Patient</th>
                  <th className="text-left py-2 text-xs font-bold text-gray-400">Last Visit</th>
                  <th className="text-left py-2 text-xs font-bold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                    onClick={() => toast.info('Loading patient record… · Azure SQL')}
                  >
                    <td className="py-2 font-semibold">{patient.name}</td>
                    <td className="py-2 text-gray-500">{patient.lastVisit}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        patient.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Pending Reminders */}
          <Card title="Pending Reminders" subtitle="Azure Communication Services">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mb-3">
              <div className="text-sm font-semibold text-amber-700">📧 Reminder Due</div>
              <div className="text-xs text-gray-600 mt-1">Sarah Murphy — appointment tomorrow 10:30 AM</div>
              <Button
                size="sm"
                className="mt-2 bg-amber-600 text-white hover:bg-amber-700 border-none"
                onClick={() => toast.success('✓ Reminder sent · Azure Communication Services')}
              >
                Send Now
              </Button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-600">📧 Scheduled</div>
              <div className="text-xs text-gray-500 mt-1">James Foley — 24hr reminder · Auto-send 10:00 AM</div>
            </div>
          </Card>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      )}
    </Layout>
  );
};

export default DoctorDashboard;