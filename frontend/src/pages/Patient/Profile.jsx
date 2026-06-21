import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import patientService from '../../services/patientService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Murphy',
    email: 'sarah.murphy@gmail.com',
    phone: '0871234567',
    dob: '1990-03-15',
    gender: 'Female',
    bloodType: 'A+',
    address: '14 Oak Street, Dublin 4, Ireland',
    allergies: 'Penicillin, Pollen',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await patientService.updateProfile(profile);
      toast.success('Profile updated successfully!');
      updateUser({ ...user, name: `${profile.firstName} ${profile.lastName}` });
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Visits', value: '12' },
    { label: 'Doctors', value: '3' },
    { label: 'Reports', value: '7' },
    { label: 'Prescriptions', value: '4' },
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // FIX: was calling getInitials() from utils/helpers which was never imported.
  // Derived inline from profile state instead.
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  return (
    <Layout title="My Profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <h2 className="font-semibold text-gray-900 mb-1">Personal Information</h2>
              <p className="text-xs text-gray-400 mb-5">PUT /api/patients/me · Azure SQL</p>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} required />
                <Input label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input label="Email" name="email" type="email" value={profile.email} onChange={handleChange} icon={<FaEnvelope />} required />
                <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} icon={<FaPhone />} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input label="Date of Birth" name="dob" type="date" value={profile.dob} onChange={handleChange} icon={<FaCalendarAlt />} />
                <Select label="Gender" name="gender" value={profile.gender} onChange={handleChange} options={genders} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Select label="Blood Type" name="bloodType" value={profile.bloodType} onChange={handleChange} options={bloodTypes} />
                <Input label="Address" name="address" value={profile.address} onChange={handleChange} icon={<FaMapMarkerAlt />} />
              </div>
              <div className="mt-4">
                <Input label="Allergies" name="allergies" value={profile.allergies} onChange={handleChange} placeholder="List any allergies" />
              </div>
              <div className="mt-6">
                <Button type="submit" variant="primary" fullWidth loading={loading}>Save Changes</Button>
              </div>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          <Card title="Account Security" subtitle="Azure AD B2C">
            <div className="space-y-3">
              {[
                { label: 'Azure AD B2C', value: 'Connected', green: true },
                { label: 'Two-Factor Auth', value: 'Enabled', green: true },
                { label: 'GDPR Consent', value: 'Granted', green: true },
                { label: 'Premium Plan', value: 'Active', green: false },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">{item.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.green ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 text-xs">
                <FaShieldAlt />
                <span>Multi-factor authentication enabled. Your account is secure.</span>
              </div>
            </div>
          </Card>

          <Card title="Statistics">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-serif text-2xl font-bold text-teal-600">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold">
                {initials}
              </div>
              <div>
                <div className="font-semibold">{profile.firstName} {profile.lastName}</div>
                <div className="text-xs text-gray-400">Patient ID: SC-10482</div>
                <div className="text-xs text-gray-400">Member since: Jan 2024</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
