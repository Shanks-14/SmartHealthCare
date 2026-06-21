import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import patientService from '../../services/patientService';

const DEMO = [
  { id: 1, doctor: "Dr. M. O'Brien", specialty: 'General Practice', date: 'Mon 3 Mar 2026',  time: '10:30 AM', type: 'Video Call',  status: 'Upcoming',  fee: '€65' },
  { id: 2, doctor: 'Dr. A. Walsh',   specialty: 'Cardiology',       date: 'Thu 6 Mar 2026',  time: '2:00 PM',  type: 'In-Person',   status: 'Upcoming',  fee: '€90' },
  { id: 3, doctor: 'Dr. P. Nolan',   specialty: 'Pediatrics',       date: 'Fri 7 Mar 2026',  time: '11:00 AM', type: 'Video Call',  status: 'Upcoming',  fee: '€55' },
  { id: 4, doctor: "Dr. M. O'Brien", specialty: 'General Practice', date: '18 Jan 2026',      time: '9:30 AM',  type: 'Video Call',  status: 'Completed', fee: '€65' },
  { id: 5, doctor: 'Dr. A. Walsh',   specialty: 'Cardiology',       date: '5 Dec 2025',       time: '2:00 PM',  type: 'In-Person',   status: 'Cancelled', fee: '—' },
];

const statusClass = { Upcoming: 'bg-teal-50 text-teal-600', Completed: 'bg-green-50 text-green-600', Cancelled: 'bg-red-50 text-red-600' };
const typeClass   = { 'Video Call': 'bg-blue-50 text-blue-600', 'In-Person': 'bg-gray-100 text-gray-600' };

const MyAppointments = () => {
  const [appointments, setAppointments] = useState(DEMO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getAppointments()
      .then(data => { if (data?.length) setAppointments(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="My Appointments">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">All Appointments</h2>
            <p className="text-xs text-gray-400 mt-1">GET /api/appointments/patient · Azure SQL</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => window.location.href = '/patient/book'}>+ New</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['Doctor','Date','Time','Type','Status','Fee','Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-bold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="font-semibold text-sm">{a.doctor}</div>
                    <div className="text-xs text-gray-400">{a.specialty}</div>
                  </td>
                  <td className="py-3 px-2 text-sm">{a.date}</td>
                  <td className="py-3 px-2 text-sm">{a.time}</td>
                  <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeClass[a.type]}`}>{a.type}</span></td>
                  <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass[a.status]}`}>{a.status}</span></td>
                  <td className="py-3 px-2 font-semibold text-sm">{a.fee}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      {a.status === 'Upcoming' && a.type === 'Video Call' && (
                        <Button size="sm" variant="primary" onClick={() => toast.info('Joining video call...')}>Join</Button>
                      )}
                      {a.status === 'Upcoming' && (
                        <Button size="sm" variant="outline" onClick={() => toast.info('Rescheduling...')}>Reschedule</Button>
                      )}
                      {a.status === 'Completed' && (
                        <Button size="sm" variant="outline" onClick={() => toast.info('Loading report...')}>Report</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {loading && <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>}
    </Layout>
  );
};

export default MyAppointments;
