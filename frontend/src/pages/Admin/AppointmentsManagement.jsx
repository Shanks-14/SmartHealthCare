import React from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';

const AppointmentsManagement = () => {
  const appointments = [
    { id: 'APT-1001', patient: 'Sarah Murphy', doctor: "Dr. O'Brien", date: 'Mon 3 Mar', type: 'Video', status: 'Upcoming', fee: '€65' },
    { id: 'APT-1002', patient: 'Sarah Murphy', doctor: 'Dr. Walsh', date: 'Thu 6 Mar', type: 'In-Person', status: 'Upcoming', fee: '€90' },
    { id: 'APT-1003', patient: 'James Foley', doctor: "Dr. O'Brien", date: 'Mon 3 Mar', type: 'In-Person', status: 'Upcoming', fee: '€65' },
    { id: 'APT-0998', patient: 'Ciara Daly', doctor: "Dr. O'Brien", date: 'Mon 3 Mar', type: 'In-Person', status: 'Completed', fee: '€65' },
    { id: 'APT-0997', patient: 'Niamh Byrne', doctor: 'Dr. Nolan', date: 'Fri 7 Mar', type: 'Video', status: 'Cancelled', fee: '—' },
  ];

  const statusClass = (s) => {
    if (s === 'Upcoming') return 'bg-teal-50 text-teal-600';
    if (s === 'Completed') return 'bg-green-50 text-green-600';
    return 'bg-red-50 text-red-600';
  };

  return (
    <Layout title="All Appointments">
      <Card>
        <div className="mb-4">
          <h2 className="font-semibold text-gray-900">All Appointments</h2>
          <p className="text-xs text-gray-400 mt-1">GET /api/admin/appointments · Azure SQL</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-bold text-gray-400">ID</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Patient</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Doctor</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Date</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Type</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Status</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Fee</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-xs font-mono text-gray-500">{apt.id}</td>
                  <td className="py-3 text-sm">{apt.patient}</td>
                  <td className="py-3 text-sm">{apt.doctor}</td>
                  <td className="py-3 text-sm">{apt.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${apt.type === 'Video' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {apt.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-sm">{apt.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default AppointmentsManagement;
