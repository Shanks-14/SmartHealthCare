import React from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const MyPatients = () => {
  const patients = [
    { id: 'SC-10482', name: 'Sarah Murphy', lastVisit: '3 Mar 2026', condition: 'Hypertension', status: 'Active' },
    { id: 'SC-10520', name: 'James Foley', lastVisit: '28 Feb 2026', condition: 'Diabetes Type 2', status: 'Active' },
    { id: 'SC-10641', name: 'Aoife Burke', lastVisit: '25 Feb 2026', condition: 'Anaemia', status: 'Active' },
    { id: 'SC-10209', name: 'Ciara Daly', lastVisit: '3 Mar 2026', condition: 'Annual Review', status: 'Discharged' },
  ];

  return (
    <Layout title="My Patients">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">My Patients (28)</h2>
            <p className="text-xs text-gray-400 mt-1">GET /api/doctor/patients · Azure SQL</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-bold text-gray-400">Patient</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Patient ID</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Last Visit</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Condition</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Status</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toast.info('Loading patient record...')}
                >
                  <td className="py-3 font-semibold text-sm">{p.name}</td>
                  <td className="py-3 text-xs font-mono text-gray-500">{p.id}</td>
                  <td className="py-3 text-sm">{p.lastVisit}</td>
                  <td className="py-3 text-sm">{p.condition}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toast.info('Loading patient record...'); }}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default MyPatients;
