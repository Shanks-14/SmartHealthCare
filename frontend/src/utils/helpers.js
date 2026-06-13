// ── Date & Time ───────────────────────────────────────────────────────────────
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

// ── String helpers ────────────────────────────────────────────────────────────
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

export const initials = (name) =>
  name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

// ── Status badge colours ──────────────────────────────────────────────────────
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

// ── Currency ──────────────────────────────────────────────────────────────────
export const formatCurrency = (amount, currency = '€') =>
  amount != null ? `${currency}${Number(amount).toFixed(0)}` : '—';

// ── Local storage helpers ─────────────────────────────────────────────────────
export const getStorageItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently ignore
  }
};
