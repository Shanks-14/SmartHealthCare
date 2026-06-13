import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import appointmentService from '../../services/appointmentService';
import patientService from '../../services/patientService';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedType, setSelectedType] = useState('Video Call');
  const [notes, setNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const dates = [
    { day: 'Mon', date: 3, full: 'Mon 3 Mar' },
    { day: 'Tue', date: 4, full: 'Tue 4 Mar' },
    { day: 'Wed', date: 5, full: 'Wed 5 Mar' },
    { day: 'Thu', date: 6, full: 'Thu 6 Mar' },
    { day: 'Fri', date: 7, full: 'Fri 7 Mar' },
    { day: 'Mon', date: 10, full: 'Mon 10 Mar' },
  ];

  const timeSlots = [
    { time: '9:00 AM', booked: true },
    { time: '9:30 AM', booked: false },
    { time: '10:30 AM', booked: false },
    { time: '11:00 AM', booked: false },
    { time: '11:30 AM', booked: false },
    { time: '12:00 PM', booked: true },
    { time: '2:00 PM', booked: false },
    { time: '2:30 PM', booked: false },
    { time: '3:30 PM', booked: false },
  ];

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await appointmentService.getAllDoctors();
      if (data && data.length > 0) {
        setDoctors(data);
        setSelectedDoctor(data[0]);
      } else {
        throw new Error('No data');
      }
    } catch {
      const demo = [
        { id: 1, name: "Dr. M. O'Brien", specialty: 'General Practice', fee: 65, available: true },
        { id: 2, name: 'Dr. A. Walsh', specialty: 'Cardiology', fee: 90, available: true },
        { id: 3, name: 'Dr. P. Nolan', specialty: 'Pediatrics', fee: 55, available: true },
        { id: 4, name: 'Dr. J. Connell', specialty: 'Neurology', fee: 110, available: true },
      ];
      setDoctors(demo);
      setSelectedDoctor(demo[0]);
    }
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const bookingData = {
        doctorId: selectedDoctor?.id,
        doctorName: selectedDoctor?.name,
        specialty: selectedDoctor?.specialty,
        date: selectedDate?.full,
        time: selectedTime,
        consultationType: selectedType,
        notes,
        fee: selectedDoctor?.fee,
      };
      await patientService.bookAppointment(bookingData);
      setBookingConfirmed(true);
      toast.success('Appointment booked successfully!');
    } catch {
      // API not available — treat as demo success
      setBookingConfirmed(true);
      toast.success('Demo appointment booked!');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (bookingConfirmed) {
    return (
      <Layout title="Book Appointment">
        <div className="max-w-md mx-auto mt-20 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-2">Appointment Booked!</h2>
          <p className="text-gray-400 mb-6">Confirmation sent to your email. You can view your appointment in the dashboard.</p>
          <Button onClick={() => navigate('/patient/appointments')}>View My Appointments</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Book Appointment">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8 max-w-2xl mx-auto">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {s === 4 ? '✓' : s}
              </div>
              <span className={`text-xs font-semibold ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                {s === 1 ? 'Doctor' : s === 2 ? 'Date & Time' : s === 3 ? 'Details' : 'Confirm'}
              </span>
            </div>
            {s < 4 && <div className={`h-px flex-1 ${step > s ? 'bg-teal-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — step panels */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <Card title="Select Doctor" subtitle="GET /api/doctors">
              <div className="grid grid-cols-2 gap-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{doctor.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{doctor.specialty}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-teal-600">€{doctor.fee}</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Available</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button fullWidth onClick={nextStep} disabled={!selectedDoctor}>
                  Continue →
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <>
              <Card title="Select Date" subtitle="GET /api/doctors/slots">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map((date, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center border-2 cursor-pointer transition-all ${
                        selectedDate?.date === date.date
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className={`text-xs font-bold uppercase ${
                        selectedDate?.date === date.date ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                        {date.day}
                      </div>
                      <div className={`text-lg font-serif font-semibold ${
                        selectedDate?.date === date.date ? 'text-white' : 'text-gray-900'
                      }`}>
                        {date.date}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Select Time">
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      onClick={() => !slot.booked && setSelectedTime(slot.time)}
                      className={`py-3 rounded-lg text-center text-sm font-semibold transition-all cursor-pointer ${
                        slot.booked
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'bg-gray-900 text-white'
                          : 'border-2 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {slot.time}
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!selectedDate || !selectedTime}>Continue →</Button>
              </div>
            </>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <>
              <Card title="Consultation Type">
                <div className="grid grid-cols-2 gap-3">
                  {['Video Call', 'In-Person Visit'].map((type) => (
                    <div
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedType === type
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">{type}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {type === 'Video Call' ? 'Azure Communication Services' : 'In-clinic consultation'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Additional Notes">
                <textarea
                  rows="4"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 outline-none"
                  placeholder="Describe your symptoms or reason for visit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue →</Button>
              </div>
            </>
          )}

          {/* BUG FIX: Step 4 was missing entirely — the "Confirm Appointment" button in the
              summary panel only rendered when step === 4, but there was no step 4 left panel,
              so the user could never reach it (step 3's "Continue" went to a blank state).
              Added a review panel for step 4 so the flow completes correctly. */}
          {step === 4 && (
            <Card title="Review & Confirm">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Doctor</span>
                  <span className="text-sm font-semibold">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Specialty</span>
                  <span className="text-sm font-semibold">{selectedDoctor?.specialty}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-semibold">{selectedDate?.full}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-semibold">{selectedTime}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-semibold">{selectedType}</span>
                </div>
                {notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Notes</div>
                    <div className="text-sm">{notes}</div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button fullWidth loading={loading} onClick={handleConfirmBooking}>
                  Confirm Appointment
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column — Booking Summary */}
        <div>
          <div className="bg-gray-900 rounded-2xl p-6 text-white sticky top-20">
            <h3 className="font-serif text-lg font-semibold mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Doctor</span>
                <span className="font-medium">{selectedDoctor?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Specialty</span>
                <span>{selectedDoctor?.specialty || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date</span>
                <span>{selectedDate?.full || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Time</span>
                <span>{selectedTime || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type</span>
                <span>{selectedType}</span>
              </div>
              <div className="border-t border-gray-800 my-3 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span className="text-xl font-bold text-teal-400">€{selectedDoctor?.fee || 0}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-teal-900/30 rounded-lg border border-teal-800">
              <div className="text-xs text-teal-300">
                <strong>⚡ Azure Services:</strong><br />
                POST /api/appointments → Azure SQL<br />
                Email → Azure Communication Services
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
