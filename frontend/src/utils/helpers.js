export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });
};

export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const statusColor = (status) => {
  const map = {
    Upcoming: 'bg-teal-50 text-teal-600',
    Completed: 'bg-green-50 text-green-600',
    Cancelled: 'bg-red-50 text-red-600',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};
