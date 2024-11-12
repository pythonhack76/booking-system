import React, { useState } from 'react';
import { Calendar, User, CreditCard, Settings, BarChart2, Bell, CheckCircle } from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';

const BookingDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const { 
    appointments, 
    stats, 
    loading, 
    error,
    deleteAppointment 
  } = useAppointments();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Errore nel caricamento dei dati: {error}
      </div>
    );
  }

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Sei sicuro di voler cancellare questo appuntamento?')) {
      try {
        await deleteAppointment(id);
      } catch (err) {
        alert('Errore durante la cancellazione: ' + err.message);
      }
    }
  };

  // ... resto del codice del componente ...

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ... Header e Stats ... */}

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Prossimi Appuntamenti</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>{/* ... */}</thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="py-3">{appointment.client}</td>
                  <td className="py-3">{appointment.service}</td>
                  <td className="py-3">{appointment.date}</td>
                  <td className="py-3">{appointment.time}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'confermato' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(appointment)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Modifica
                      </button>
                      <button 
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Cancella
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;