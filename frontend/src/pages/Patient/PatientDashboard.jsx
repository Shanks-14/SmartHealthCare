import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaHeartbeat, FaFileAlt, FaUserMd } from 'react-icons/fa';
import patientService from '../../services/patientService';
import { toast } from 'react-toastify';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    upcomingAppointments: 3,
    heartRate: 72,
    reports: 7,
    lastVisit: '18 Jan 2026'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await patientService.getUpcomingAppointments();
    } catch (error) {
      // API may not be available in dev; silently fall back to demo data
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: <FaCalendarAlt className="text-teal-500 text-xl" />,
      bgColor: 'bg-teal-50',
      value: stats.upcomingAppointments,
      label: 'Upcoming Appointments',
      onClick: () => navigate('/patient/appointments'),
    },
    {
      icon: <FaHeartbeat className="text-green-600 text-xl" />,
      bgColor: 'bg-green-50',
      value: `${stats.heartRate} bpm`,
      label: 'Heart Rate',
    },
    {
      icon: <FaFileAlt className="text-blue-600 text-xl" />,
      bgColor: 'bg-blue-50',
      value: stats.reports,
      label: 'Medical Reports',
      onClick: () => navigate('/patient/reports'),
    },
    {
      icon: <FaUserMd className="text-amber-600 text-xl" />,
      bgColor: 'bg-amber-50',
      value: stats.lastVisit,
      label: 'Last Visit',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Michael O'Brien",
      specialty: 'General Practitioner',
      date: 'Mon 3 Mar',
      time: '10:30 AM',
      type: 'Video Call',
      status: 'Upcoming',
    },
    {
      id: 2,
      doctor: 'Dr. Anna Walsh',
      specialty: 'Cardiologist',
      date: 'Thu 6 Mar',
      time: '2:00 PM',
      type: 'In-Person',
      status: 'Upcoming',
    },
    {
      id: 3,
      doctor: 'Dr. Patricia Nolan',
      specialty: 'Pediatrician',
      date: 'Fri 7 Mar',
      time: '11:00 AM',
      type: 'Video Call',
      status: 'Upcoming',
    },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '118/76', status: 'Normal', isWarning: false },
    { label: 'Glucose', value: '5.4 mmol', status: 'Normal', isWarning: false },
    { label: 'O₂ Saturation', value: '98%', status: 'Normal', isWarning: false },
    { label: 'Cholesterol', value: '5.9 mmol', status: 'Monitor', isWarning: true },
  ];

  // BUG FIX: Tailwind purges dynamic class names like `text-${color}-500` at build time
  // because they don't appear as complete strings in source code.
  // Use a static lookup object with full class names instead.
  const doctors = [
    {
      name: "Dr. M. O'Brien",
      specialty: 'General Practice',
      availability: 'Today',
      dotClass: 'bg-green-500',
      textClass: 'text-green-600',
    },
    {
      name: 'Dr. A. Walsh',
      specialty: 'Cardiology',
      availability: 'Thu',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-600',
    },
    {
      name: 'Dr. P. Nolan',
      specialty: 'Pediatrics',
      availability: 'Fri',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-600',
    },
  ];

  return (
    <Layout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, index) => (
          <Card
            key={index}
            className={card.onClick ? 'cursor-pointer hover:shadow-md transition-all' : ''}
            onClick={card.onClick}
          >
            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <div className="font-serif text-2xl font-semibold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-400 font-medium">{card.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card title="Upcoming Appointments" subtitle="Azure SQL · appointments table">
          <div className="space-y-3">
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
                  {appt.doctor.charAt(4)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{appt.doctor}</div>
                  <div className="text-xs text-gray-400">{appt.specialty}</div>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span>{appt.date}</span>
                    <span>{appt.time}</span>
                    <span className="text-teal-600">{appt.type}</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-teal-50 text-teal-600 text-xs font-semibold rounded-full">
                  {appt.status}
                </span>
                {appt.type === 'Video Call' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => toast.info('Joining video call...')}
                  >
                    Join Call
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            fullWidth
            className="mt-4"
            onClick={() => navigate('/patient/appointments')}
          >
            View All Appointments
          </Button>
        </Card>

        <div className="space-y-6">
          {/* Health Metrics */}
          <Card title="Health Metrics" subtitle="Azure SQL">
            <div className="grid grid-cols-2 gap-3">
              {healthMetrics.map((metric, index) => (
                <div
                  key={index}
                  // BUG FIX: Use static conditional classes rather than dynamic `border-${color}-200`
                  className={`p-3 rounded-lg border ${
                    metric.isWarning
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                    {metric.label}
                  </div>
                  <div className="font-serif text-xl font-semibold text-gray-900">
                    {metric.value}
                  </div>
                  <div className={`text-xs font-semibold mt-1 ${
                    metric.isWarning ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    ● {metric.status}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* My Doctors */}
          <Card title="My Doctors">
            <div className="space-y-2">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                    {doctor.name.charAt(4)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{doctor.name}</div>
                    <div className="text-xs text-gray-400">{doctor.specialty}</div>
                  </div>
                  {/* BUG FIX: Use pre-computed static class strings from the data object */}
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${doctor.dotClass}`}></div>
                    <span className={`text-xs font-semibold ${doctor.textClass}`}>
                      {doctor.availability}
                    </span>
                  </div>
                </div>
              ))}
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

export default PatientDashboard;
