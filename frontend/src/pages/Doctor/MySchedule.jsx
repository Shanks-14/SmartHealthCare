import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const MySchedule = () => {
  const [selectedDay, setSelectedDay] = useState(0);

  const days = [
    { day: 'Mon', date: 3, count: 5 },
    { day: 'Tue', date: 4, count: 3 },
    { day: 'Wed', date: 5, count: 4 },
    { day: 'Thu', date: 6, count: 2 },
    { day: 'Fri', date: 7, count: 6 },
    { day: 'Mon', date: 10, count: 4 },
    { day: 'Tue', date: 11, count: 5 },
  ];

  const appointments = [
    { time: '9:30', patient: 'Sarah Murphy', reason: 'Recurring headaches', type: 'Video Call', status: 'Upcoming' },
    { time: '11:00', patient: 'James Foley', reason: 'Annual checkup', type: 'In-Person', status: 'Upcoming' },
    { time: '14:00', patient: 'Aoife Burke', reason: 'Follow-up blood test', type: 'Video Call', status: 'Upcoming' },
    { time: '15:30', patient: 'Ciara Daly', reason: 'Blood results review', type: 'In-Person', status: 'Completed' },
  ];

  return (
    <Layout title="My Schedule">
      <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={`flex-shrink-0 w-20 py-3 rounded-xl text-center cursor-pointer transition-all ${
              selectedDay === idx
                ? 'bg-gray-900 text-white'
                : 'border-2 border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className={`text-xs font-bold uppercase ${selectedDay === idx ? 'text-gray-300' : 'text-gray-400'}`}>
              {day.day}
            </div>
            <div className={`text-xl font-serif font-semibold ${selectedDay === idx ? 'text-white' : 'text-gray-900'}`}>
              {day.date}
            </div>
            <div className="text-xs mt-1 text-teal-400">{day.count} appts</div>
          </div>
        ))}
      </div>

      <Card title="Monday 3 March 2026" subtitle="GET /api/doctor/schedule?date=2026-03-03 · Azure SQL">
        {appointments.map((appt, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 mb-2">
            <div className="w-12 text-center font-bold text-gray-500 text-sm">{appt.time}</div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
              {appt.patient.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{appt.patient}</div>
              <div className="text-xs text-gray-400">{appt.reason} · {appt.type}</div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              appt.status === 'Upcoming' ? 'bg-teal-50 text-teal-600' : 'bg-green-50 text-green-600'
            }`}>
              {appt.status}
            </span>
            {appt.type === 'Video Call' && appt.status === 'Upcoming' && (
              <Button size="sm" variant="primary" onClick={() => toast.info('Starting call...')}>
                Call
              </Button>
            )}
          </div>
        ))}
      </Card>
    </Layout>
  );
};

export default MySchedule;
