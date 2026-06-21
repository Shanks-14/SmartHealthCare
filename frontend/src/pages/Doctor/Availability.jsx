import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const Availability = () => {
  const [settings, setSettings] = useState({
    startTime: '09:00',
    endTime: '17:00',
    duration: '45',
    maxPatients: 8,
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day) => {
    setSettings(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  return (
    <Layout title="Set Availability">
      <Card>
        <h2 className="font-semibold text-gray-900 mb-1">Set My Availability</h2>
        <p className="text-xs text-gray-400 mb-5">PATCH /api/doctor/availability · Azure SQL · availability table</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Working Hours — Start</label>
            <input
              type="time"
              value={settings.startTime}
              onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Working Hours — End</label>
            <input
              type="time"
              value={settings.endTime}
              onChange={(e) => setSettings({ ...settings, endTime: e.target.value })}
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Consultation Duration</label>
          <select
            value={settings.duration}
            onChange={(e) => setSettings({ ...settings, duration: e.target.value })}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Days Available</label>
          <div className="flex gap-2 flex-wrap">
            {weekDays.map((day) => (
              <div
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                  settings.days.includes(day) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Max Patients Per Day</label>
          <input
            type="number"
            value={settings.maxPatients}
            onChange={(e) => setSettings({ ...settings, maxPatients: parseInt(e.target.value) })}
            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
          />
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4 text-xs text-blue-700">
          ⚡ PATCH /api/doctor/availability → Azure SQL · availability table · Triggers slot recalculation
        </div>

        <Button variant="primary" fullWidth onClick={() => toast.success('Availability saved to Azure SQL')}>
          Save Availability
        </Button>
      </Card>
    </Layout>
  );
};

export default Availability;
