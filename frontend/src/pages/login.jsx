import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('sarah.murphy@gmail.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // FIX: Core logic extracted so it can be called with or without a form event.
  // Previously demoLogin() called handleLogin() without an event, which crashed on
  // e.preventDefault() — "Cannot read properties of undefined".
  const performLogin = async (emailVal, passwordVal, roleVal) => {
    setLoading(true);
    try {
      const response = await login(emailVal, passwordVal, roleVal);
      const userRole = response.user?.role || roleVal;
      if (userRole === 'doctor') navigate('/doctor/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      setToast({ message: err.error || 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(email, password, role);
  };

  const demoLogin = (demoRole) => {
    const creds = {
      patient: { email: 'sarah.murphy@gmail.com', password: 'SecurePass123!' },
      doctor:  { email: 'dr.obrien@beaumont.ie',  password: 'DoctorPass123!' },
      admin:   { email: 'admin@smartcare.com',     password: 'admin123' },
    };
    const { email: e, password: p } = creds[demoRole];
    setRole(demoRole);
    setEmail(e);
    setPassword(p);
    performLogin(e, p, demoRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-700/5 to-gray-900/10"></div>
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full border border-teal-500/20"></div>
      <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] rounded-full border border-teal-500/20"></div>

      <div className="bg-white border border-gray-200 rounded-3xl p-8 w-[440px] relative z-10 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M19 9h-4V5a2 2 0 00-4 0v4H7a2 2 0 000 4h4v4a2 2 0 004 0v-4h4a2 2 0 000-4z" />
            </svg>
          </div>
          <span className="font-serif text-xl font-semibold text-gray-900">SmartCare</span>
        </div>

        <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-2">Sign in to<br />your account</h1>
        <p className="text-sm text-gray-400 mb-7">Select your role and enter your credentials</p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {['patient', 'doctor', 'admin'].map((r) => (
            <div
              key={r}
              onClick={() => setRole(r)}
              className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-all ${
                role === r ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center ${role === r ? 'bg-white/20' : 'bg-gray-100'}`}>
                {r === 'patient' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={role === r ? 'white' : 'currentColor'} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
                {r === 'doctor'  && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={role === r ? 'white' : 'currentColor'} strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M9 7h6M12 4v6M9 15h6"/></svg>}
                {r === 'admin'   && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={role === r ? 'white' : 'currentColor'} strokeWidth="2"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/></svg>}
              </div>
              <p className={`text-xs font-bold capitalize ${role === r ? 'text-white' : 'text-gray-600'}`}>{r}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none transition-colors"
              placeholder="you@example.com" required />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none transition-colors"
              placeholder="••••••••" required />
          </div>
          <Button type="submit" variant="primary" fullWidth loading={loading}>Sign In →</Button>
        </form>

        <div className="mt-5 text-center">
          <div className="text-xs text-gray-400 mb-2">Quick demo logins:</div>
          <div className="flex gap-2">
            {[['patient','👤 Patient'],['doctor','🩺 Doctor'],['admin','🛡 Admin']].map(([r, label]) => (
              <button key={r} type="button" onClick={() => demoLogin(r)}
                className="flex-1 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 hover:border-teal-500 hover:text-teal-500 transition-all">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;
