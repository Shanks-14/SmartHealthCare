import React from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const UsersManagement = () => {
  const users = [
    { name: 'Sarah Murphy', role: 'Patient', email: 'sarah.murphy@gmail.com', status: 'Active' },
    { name: "Dr. M. O'Brien", role: 'Doctor', email: 'm.obrien@beaumont.ie', status: 'Active' },
    { name: 'Dr. A. Walsh', role: 'Doctor', email: 'a.walsh@mater.ie', status: 'Active' },
    { name: 'Admin User', role: 'Admin', email: 'admin@smartcare.ie', status: 'Active' },
  ];

  const roleClass = (role) => {
    if (role === 'Patient') return 'bg-blue-50 text-blue-600';
    if (role === 'Doctor') return 'bg-teal-50 text-teal-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <Layout title="User Management">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">User Management</h2>
            <p className="text-xs text-gray-400 mt-1">GET /api/admin/users · Azure SQL + Azure AD B2C</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => toast.info('Add user form')}>
            + Add User
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs font-bold text-gray-400">Name</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Role</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Email</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Status</th>
                <th className="text-left py-3 text-xs font-bold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 font-semibold text-sm">{user.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-semibold">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="outline" onClick={() => toast.info('Edit user')}>
                      Edit
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

export default UsersManagement;
