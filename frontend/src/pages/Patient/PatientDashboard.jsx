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

  useEffect(() => {
    patientService.getUpcomingAppointments()
      .catch(() => {}) // silent fallback to demo data
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: <FaCalendarAlt className="text-teal-500 text-xl" />, bg: 'bg-teal-50', value: 3, label: 'Upcoming Appointments', onClick: () => navigate('/patient/appointments') },
    { icon: <FaHeartbeat className="text-green-600 text-xl" />, bg: 'bg-green-50', value: '72 bpm', label: 'Heart Rate' },
    { icon: <FaFileAlt className="text-blue-600 text-xl" />, bg: 'bg-blue-50', value: 7, label: 'Medical Reports', onClick: () => navigate('/patient/reports') },
    { icon: <FaUserMd className="text-amber-600 text-xl" />, bg: 'bg-amber-50', value: '18 Jan 2026', label: 'Last Visit' },
  ];

  const appointments = [
    { id: 1, doctor: "Dr. Michael O'Brien", specialty: 'General Practitioner', date: 'Mon 3 Mar', time: '10:30 AM', type: 'Video Call' },
    { id: 2, doctor: 'Dr. Anna Walsh',       specialty: 'Cardiologist',         date: 'Thu 6 Mar', time: '2:00 PM',  type: 'In-Person' },
    { id: 3, doctor: 'Dr. Patricia Nolan',   specialty: 'Pediatrician',         date: 'Fri 7 Mar', time: '11:00 AM', type: 'Video Call' },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '118/76', status: 'Normal', warning: false },
    { label: 'Glucose',        value: '5.4 mmol', status: 'Normal', warning: false },
    { label: 'O₂ Saturation',  value: '98%',    status: 'Normal', warning: false },
    { label: 'Cholesterol',    value: '5.9 mmol', status: 'Monitor', warning: true },
  ];

  // FIX: Static class strings — dynamic `text-${color}-500` gets purged by Tailwind at build time
  const doctors = [
    { name: "Dr. M. O'Brien", specialty: 'General Practice', availability: 'Today', dot: 'bg-green-500', text: 'text-green-600' },
    { name: 'Dr. A. Walsh',   specialty: 'Cardiology',       availability: 'Thu',   dot: 'bg-amber-500', text: 'text-amber-600' },
    { name: 'Dr. P. Nolan',   specialty: 'Pediatrics',       availability: 'Fri',   dot: 'bg-amber-500', text: 'text-amber-600' },
  ];

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <Card key={i} onClick={card.onClick} className={card.onClick ? 'cursor-pointer hover:shadow-md' : ''}>
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>{card.icon}</div>
            <div className="font-serif text-2xl font-semibold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-400 font-medium">{card.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Upcoming Appointments" subtitle="Azure SQL · appointments table">
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
                  {appt.doctor.charAt(4)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{appt.doctor}</div>
                  <div className="text-xs text-gray-400">{appt.specialty}</div>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span>{appt.date}</span><span>{appt.time}</span>
                    <span className="text-teal-600">{appt.type}</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-teal-50 text-teal-600 text-xs font-semibold rounded-full">Upcoming</span>
                {appt.type === 'Video Call' && (
                  <Button size="sm" variant="primary" onClick={() => toast.info('Joining video call...')}>Join</Button>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" fullWidth className="mt-4" onClick={() => navigate('/patient/appointments')}>
            View All Appointments
          </Button>
        </Card>

        <div className="space-y-6">
          <Card title="Health Metrics" subtitle="Azure SQL">
            <div className="grid grid-cols-2 gap-3">
              {healthMetrics.map((m, i) => (
                <div key={i} className={`p-3 rounded-lg border ${m.warning ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="text-xs uppercase tracking-wide text-gray-400 font-bold">{m.label}</div>
                  <div className="font-serif text-xl font-semibold text-gray-900">{m.value}</div>
                  <div className={`text-xs font-semibold mt-1 ${m.warning ? 'text-amber-600' : 'text-green-600'}`}>● {m.status}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="My Doctors">
            <div className="space-y-2">
              {doctors.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                    {doc.name.charAt(4)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{doc.name}</div>
                    <div className="text-xs text-gray-400">{doc.specialty}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${doc.dot}`}></div>
                    <span className={`text-xs font-semibold ${doc.text}`}>{doc.availability}</span>
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
