import React from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Patients', value: '142', icon: '👥', bg: 'bg-teal-50' },
    { label: 'Active Doctors', value: '12', icon: '🩺', bg: 'bg-green-50' },
    { label: 'Appts Today', value: '38', icon: '📅', bg: 'bg-blue-50' },
    { label: 'Azure Uptime', value: '99.8%', icon: '☁️', bg: 'bg-amber-50' },
  ];

  const recentAppointments = [
    { patient: "Sarah Murphy", doctor: "Dr. O'Brien", date: '3 Mar', status: 'Upcoming' },
    { patient: 'James Foley', doctor: "Dr. O'Brien", date: '3 Mar', status: 'Upcoming' },
    { patient: 'Ciara Daly', doctor: "Dr. O'Brien", date: '3 Mar', status: 'Completed' },
    { patient: 'Patrick Ryan', doctor: 'Dr. Walsh', date: '6 Mar', status: 'Upcoming' },
  ];

  const azureServices = [
    { name: 'Azure SQL Database', status: 'Online', region: 'West Europe' },
    { name: 'App Service', status: 'Running', region: 'West Europe' },
    { name: 'Blob Storage', status: 'Active', region: 'West Europe' },
    { name: 'Azure AD B2C', status: 'Active', region: 'Global' },
    { name: 'Communication Services', status: 'Ready', region: 'West Europe' },
  ];

  const statusClass = (s) =>
    s === 'Upcoming' ? 'bg-teal-50 text-teal-600' : 'bg-green-50 text-green-600';

  return (
    <Layout title="System Overview">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3 text-xl`}>
              {stat.icon}
            </div>
            <div className="font-serif text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            <div className="text-[10px] text-blue-500 mt-2 font-semibold">⚡ Azure SQL</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Appointments" subtitle="GET /api/admin/appointments · Azure SQL">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-xs font-bold text-gray-400">Patient</th>
                <th className="text-left py-2 text-xs font-bold text-gray-400">Doctor</th>
                <th className="text-left py-2 text-xs font-bold text-gray-400">Date</th>
                <th className="text-left py-2 text-xs font-bold text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appt, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2 text-sm">{appt.patient}</td>
                  <td className="py-2 text-sm">{appt.doctor}</td>
                  <td className="py-2 text-sm">{appt.date}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClass(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Azure Services Status">
          <div className="space-y-2">
            {azureServices.map((svc, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-semibold">{svc.name}</div>
                  <div className="text-xs text-gray-400">{svc.region}</div>
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-semibold">
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
