import React, { useState } from 'react';
import { FaBell, FaSearch, FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// FIX: Original Header.jsx called getInitials() from utils/helpers but never
// imported it, causing "getInitials is not a function" crash on every page load.
// The logic is inlined directly — no external import needed.
const Header = ({ title, onMenuClick }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const handleNotification = () => {
    setShowNotifications(!showNotifications);
    toast.info('You have 3 new notifications');
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <FaBars className="text-gray-600" />
        </button>
        <h1 className="font-serif text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm px-2 w-40"
          />
        </div>

        <div className="relative">
          <button
            onClick={handleNotification}
            className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaBell className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white text-sm font-bold">
          {initial}
        </div>
      </div>
    </header>
  );
};

export default Header;
