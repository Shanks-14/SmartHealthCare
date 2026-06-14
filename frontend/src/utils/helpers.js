// Date & Time
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

// String helpers─
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

export const initials = (name) =>
  name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

// Status badge colours 
export const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'upcoming':   return 'bg-teal-50 text-teal-600';
    case 'completed':  return 'bg-green-50 text-green-600';
    case 'cancelled':  return 'bg-red-50 text-red-600';
    case 'active':     return 'bg-teal-50 text-teal-600';
    case 'discharged': return 'bg-gray-100 text-gray-500';
    default:           return 'bg-gray-100 text-gray-500';
  }
};

// Currency 
export const formatCurrency = (amount, currency = '€') =>
  amount != null ? `${currency}${Number(amount).toFixed(0)}` : '—';

// Local storage helpers
export const getStorageItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const statusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'no-show':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const typeClasses = (type) => {
  switch (type?.toLowerCase()) {
    case 'consultation':
      return 'bg-indigo-100 text-indigo-800';
    case 'follow-up':
      return 'bg-teal-100 text-teal-800';
    case 'surgery':
      return 'bg-purple-100 text-purple-800';
    case 'check-up':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently ignore
  }
};
