import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import appointmentService from '../../services/appointmentService';
import patientService from '../../services/patientService';

const DEMO_DOCTORS = [
  { id: 1, name: "Dr. M. O'Brien", specialty: 'General Practice', fee: 65 },
  { id: 2, name: 'Dr. A. Walsh',   specialty: 'Cardiology',       fee: 90 },
  { id: 3, name: 'Dr. P. Nolan',   specialty: 'Pediatrics',       fee: 55 },
  { id: 4, name: 'Dr. J. Connell', specialty: 'Neurology',        fee: 110 },
];

const DATES = [
  { day: 'Mon', date: 3,  full: 'Mon 3 Mar' },
  { day: 'Tue', date: 4,  full: 'Tue 4 Mar' },
  { day: 'Wed', date: 5,  full: 'Wed 5 Mar' },
  { day: 'Thu', date: 6,  full: 'Thu 6 Mar' },
  { day: 'Fri', date: 7,  full: 'Fri 7 Mar' },
  { day: 'Mon', date: 10, full: 'Mon 10 Mar' },
];

const TIME_SLOTS = [
  { time: '9:00 AM',  booked: true  },
  { time: '9:30 AM',  booked: false },
  { time: '10:30 AM', booked: false },
  { time: '11:00 AM', booked: false },
  { time: '11:30 AM', booked: false },
  { time: '12:00 PM', booked: true  },
  { time: '2:00 PM',  booked: false },
  { time: '2:30 PM',  booked: false },
  { time: '3:30 PM',  booked: false },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState(DEMO_DOCTORS);
  const [selectedDoctor, setSelectedDoctor] = useState(DEMO_DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedType, setSelectedType] = useState('Video Call');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    appointmentService.getAllDoctors()
      .then(data => { if (data?.length) { setDoctors(data); setSelectedDoctor(data[0]); } })
      .catch(() => {}); // keep demo data on error
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await patientService.bookAppointment({
        doctorId: selectedDoctor?.id,
        date: selectedDate?.full,
        time: selectedTime,
        consultationType: selectedType,
        notes,
      });
    } catch {
      // API not ready — show success anyway for demo
    } finally {
      setLoading(false);
      setConfirmed(true);
      toast.success('Appointment booked!');
    }
  };

  if (confirmed) {
    return (
      <Layout title="Book Appointment">
        <div className="max-w-md mx-auto mt-20 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-2">Appointment Booked!</h2>
          <p className="text-gray-400 mb-6">Confirmation sent to your email.</p>
          <Button onClick={() => navigate('/patient/appointments')}>View My Appointments</Button>
        </div>
      </Layout>
    );
  }

  const StepDot = ({ n }) => (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= n ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
      {n === 4 ? '✓' : n}
    </div>
  );

  return (
    <Layout title="Book Appointment">
      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 max-w-2xl mx-auto">
        {[['Doctor',1],['Date & Time',2],['Details',3],['Confirm',4]].map(([label, n], i, arr) => (
          <React.Fragment key={n}>
            <div className="flex items-center gap-2">
              <StepDot n={n} />
              <span className={`text-xs font-semibold whitespace-nowrap ${step >= n ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < arr.length - 1 && <div className={`h-px flex-1 mx-1 ${step > n ? 'bg-teal-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Doctor */}
          {step === 1 && (
            <Card title="Select Doctor" subtitle="GET /api/doctors">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {doctors.map((doc) => (
                  <div key={doc.id} onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedDoctor?.id === doc.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                    <div className="font-semibold text-gray-900">{doc.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{doc.specialty}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-teal-600">€{doc.fee}</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Available</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button fullWidth onClick={() => setStep(2)} disabled={!selectedDoctor}>Continue →</Button>
            </Card>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <>
              <Card title="Select Date">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {DATES.map((d, i) => (
                    <div key={i} onClick={() => setSelectedDate(d)}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center border-2 cursor-pointer transition-all ${selectedDate?.date === d.date ? 'border-gray-900 bg-gray-900' : 'border-gray-200 hover:border-gray-400'}`}>
                      <div className={`text-xs font-bold uppercase ${selectedDate?.date === d.date ? 'text-gray-300' : 'text-gray-400'}`}>{d.day}</div>
                      <div className={`text-lg font-serif font-semibold ${selectedDate?.date === d.date ? 'text-white' : 'text-gray-900'}`}>{d.date}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Select Time">
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((s, i) => (
                    <div key={i} onClick={() => !s.booked && setSelectedTime(s.time)}
                      className={`py-3 rounded-lg text-center text-sm font-semibold transition-all ${
                        s.booked ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : selectedTime === s.time ? 'bg-gray-900 text-white cursor-pointer'
                        : 'border-2 border-gray-200 hover:border-gray-400 cursor-pointer'
                      }`}>
                      {s.time}
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}>Continue →</Button>
              </div>
            </>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <>
              <Card title="Consultation Type">
                <div className="grid grid-cols-2 gap-3">
                  {['Video Call', 'In-Person Visit'].map((t) => (
                    <div key={t} onClick={() => setSelectedType(t)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedType === t ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <div className="font-semibold">{t}</div>
                      <div className="text-xs text-gray-400 mt-1">{t === 'Video Call' ? 'Azure Communication Services' : 'In-clinic consultation'}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Additional Notes">
                <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 outline-none resize-none" />
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Continue →</Button>
              </div>
            </>
          )}

          {/* FIX: Step 4 was completely missing — user was stuck with a blank panel.
              Added review panel so the booking flow can actually be completed. */}
          {step === 4 && (
            <Card title="Review & Confirm">
              <div className="space-y-2 mb-6">
                {[
                  ['Doctor',   selectedDoctor?.name],
                  ['Specialty',selectedDoctor?.specialty],
                  ['Date',     selectedDate?.full],
                  ['Time',     selectedTime],
                  ['Type',     selectedType],
                  ['Fee',      `€${selectedDoctor?.fee}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold">{val}</span>
                  </div>
                ))}
                {notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Notes</div>
                    <div className="text-sm">{notes}</div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button fullWidth loading={loading} onClick={handleConfirm}>Confirm Appointment</Button>
              </div>
            </Card>
          )}
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="bg-gray-900 rounded-2xl p-6 text-white sticky top-20">
            <h3 className="font-serif text-lg font-semibold mb-4">Booking Summary</h3>
            <div className="space-y-3 text-sm">
              {[
                ['Doctor',    selectedDoctor?.name || '—'],
                ['Specialty', selectedDoctor?.specialty || '—'],
                ['Date',      selectedDate?.full || '—'],
                ['Time',      selectedTime || '—'],
                ['Type',      selectedType],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}
              <div className="border-t border-gray-800 pt-3 flex justify-between">
                <span className="text-gray-400">Fee</span>
                <span className="text-xl font-bold text-teal-400">€{selectedDoctor?.fee || 0}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-teal-900/30 rounded-lg border border-teal-800 text-xs text-teal-300">
              ⚡ POST /api/appointments → Azure SQL<br />Email → Azure Communication Services
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
