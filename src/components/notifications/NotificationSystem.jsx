import React, { useState } from 'react';
import { X } from 'lucide-react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'success', 
      title: 'Nuovo Appuntamento', 
      message: 'Appuntamento confermato per Mario Rossi alle 15:00' 
    },
    { 
      id: 2, 
      type: 'warning', 
      title: 'Promemoria', 
      message: 'Appuntamento tra 1 ora con Laura Bianchi' 
    }
  ]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 w-80 space-y-2 z-50">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`
            p-4 rounded-lg shadow-lg
            ${notification.type === 'success' ? 'bg-green-50 border-green-500' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-red-50 border-red-500'}
            border-l-4
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;