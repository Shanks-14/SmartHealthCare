import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { FaCalendarCheck, FaUsers, FaClock, FaVideo } from 'react-icons/fa';
import doctorService from '../../services/doctorService';

const DEMO_SCHEDULE = [
  { id: 1, time: '9:30 AM',  patient: 'Sarah Murphy', reason: 'Headaches',      type: 'Video Call',  status: 'Upcoming' },
  { id: 2, time: '11:00 AM', patient: 'James Foley',  reason: 'Annual checkup', type: 'In-Person',   status: 'Upcoming' },
  { id: 3, time: '2:00 PM',  patient: 'Aoife Burke',  reason: 'Follow-up',      type: 'Video Call',  status: 'Upcoming' },
  { id: 4, time: '3:30 PM',  patient: 'Ciara Daly',   reason: 'Blood results',  type: 'In-Person',   status: 'Completed' },
];

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(DEMO_SCHEDULE);

  useEffect(() => {
    doctorService.getTodayAppointments()
      .then(data => { if (data?.length) setSchedule(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: <FaCalendarCheck />, bg: 'bg-teal-50', color: 'text-teal-500', value: 5,  label: "Today's Appointments" },
    { icon: <FaUsers />,         bg: 'bg-blue-50', color: 'text-blue-500', value: 28, label: 'Total Patients' },
    { icon: <FaClock />,         bg: 'bg-green-50',color: 'text-green-500',value: 12, label: 'This Week' },
  ];

  const recentPatients = [
    { name: 'Sarah Murphy', lastVisit: '3 Mar 2026',  status: 'Active' },
    { name: 'James Foley',  lastVisit: '28 Feb 2026', status: 'Active' },
    { name: 'Aoife Burke',  lastVisit: '25 Feb 2026', status: 'Active' },
    { name: 'Ciara Daly',   lastVisit: '3 Mar 2026',  status: 'Completed' },
  ];

  return (
    <Layout title="Doctor Overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <Card key={i} className="text-center">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-3`}>
              <span className={s.color}>{s.icon}</span>
            </div>
            <div className="font-serif text-2xl font-semibold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            <div className="text-[10px] text-blue-500 mt-2 font-semibold">⚡ Azure SQL</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Schedule — Mon 3 Mar" subtitle="GET /api/doctor/appointments?date=today">
          <div className="space-y-3">
            {schedule.map((appt) => (
              <div key={appt.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${appt.status === 'Completed' ? 'opacity-60 bg-gray-50 border-gray-100' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="w-12 text-center text-xs font-bold text-gray-500">{appt.time}</div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {appt.patient.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{appt.patient}</div>
                  <div className="text-xs text-gray-400">{appt.reason} · {appt.type}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${appt.status === 'Upcoming' ? 'bg-teal-50 text-teal-600' : 'bg-green-50 text-green-600'}`}>
                  {appt.status}
                </span>
                {appt.type === 'Video Call' && appt.status === 'Upcoming' && (
                  <Button size="sm" variant="primary" onClick={() => toast.info('Starting video call...')}>
                    <FaVideo className="mr-1" /> Start
                  </Button>
                )}
                {appt.type === 'In-Person' && appt.status === 'Upcoming' && (
                  <Button size="sm" variant="outline" onClick={() => toast.info('Loading patient file...')}>View</Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Recent Patients" subtitle="GET /api/doctor/patients">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-bold text-gray-400">Patient</th>
                  <th className="text-left py-2 text-xs font-bold text-gray-400">Last Visit</th>
                  <th className="text-left py-2 text-xs font-bold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => toast.info('Loading patient record...')}>
                    <td className="py-2 font-semibold">{p.name}</td>
                    <td className="py-2 text-gray-500">{p.lastVisit}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-green-50 text-green-600'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Pending Reminders" subtitle="Azure Communication Services">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mb-3">
              <div className="text-sm font-semibold text-amber-700">📧 Reminder Due</div>
              <div className="text-xs text-gray-600 mt-1">Sarah Murphy — appointment tomorrow 10:30 AM</div>
              <button onClick={() => toast.success('Reminder sent!')} className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                Send Now
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-600">📧 Scheduled</div>
              <div className="text-xs text-gray-500 mt-1">James Foley — 24hr reminder · Auto-send 10:00 AM</div>
            </div>
          </Card>
        </div>
      </div>
      {loading && <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>}
    </Layout>
  );
};

export default DoctorDashboard;
