import React from 'react';
import BookingDashboard from './components/BookingDashboard';
import NotificationSystem from './components/notifications/NotificationSystem';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSystem />
      <BookingDashboard />
    </div>
  );
}

export default App;