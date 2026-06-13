import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaCalendarAlt,
  FaUserMd,
  FaUsers,
  FaFileAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaPlusCircle,
  FaClock,
  FaChartLine,
  FaCog,
  // BUG FIX: FaAzure does not exist in react-icons/fa and causes a runtime crash.
  // Replaced with FaCloud which is available and contextually appropriate.
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (user?.role === 'patient') {
      return [
        { path: '/patient/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/patient/book', icon: <FaPlusCircle />, label: 'Book Appointment' },
        { path: '/patient/appointments', icon: <FaCalendarAlt />, label: 'My Appointments' },
        { path: '/patient/reports', icon: <FaFileAlt />, label: 'Medical Reports' },
        { path: '/patient/profile', icon: <FaUserCircle />, label: 'Profile' },
      ];
    } else if (user?.role === 'doctor') {
      return [
        { path: '/doctor/dashboard', icon: <FaHome />, label: 'Overview' },
        { path: '/doctor/schedule', icon: <FaCalendarAlt />, label: 'My Schedule' },
        { path: '/doctor/patients', icon: <FaUsers />, label: 'My Patients' },
        { path: '/doctor/availability', icon: <FaClock />, label: 'Availability' },
      ];
    } else if (user?.role === 'admin') {
      return [
        { path: '/admin/dashboard', icon: <FaChartLine />, label: 'Overview' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
        { path: '/admin/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
        // BUG FIX: Replaced non-existent <FaAzure /> with <FaCog /> (settings/services icon)
        { path: '/admin/azure', icon: <FaCog />, label: 'Azure Services' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="w-56 bg-gray-900 min-h-screen fixed top-0 left-0 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-6 mb-4">
        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M19 9h-4V5a2 2 0 00-4 0v4H7a2 2 0 000 4h4v4a2 2 0 004 0v-4h4a2 2 0 000-4z" />
          </svg>
        </div>
        <span className="font-serif text-white text-lg font-semibold">SmartCare</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Menu
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-gray-800 mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {user?.name || 'User'}
            </div>
            <div className="text-gray-500 text-xs capitalize">
              {user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all text-sm"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
