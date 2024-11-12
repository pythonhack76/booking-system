import React, { useState } from 'react';
import { Calendar, User, CreditCard, Settings, BarChart2, Bell, CheckCircle } from 'lucide-react';

const BookingDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  
  const appointmentsData = [
    { id: 1, client: "Mario Rossi", service: "Taglio Capelli", date: "2024-11-12", time: "10:00", status: "confermato" },
    { id: 2, client: "Laura Bianchi", service: "Massaggio", date: "2024-11-12", time: "11:30", status: "in attesa" },
    { id: 3, client: "Giuseppe Verdi", service: "Consulenza", date: "2024-11-13", time: "14:00", status: "confermato" }
  ];

  const statsData = {
    todayAppointments: 5,
    weeklyBookings: 28,
    monthlyRevenue: "€2,450",
    cancelationRate: "4.2%"
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestione Appuntamenti</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2">
            <Bell size={20} />
            Notifiche
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            Nuovo Appuntamento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-gray-500">Appuntamenti Oggi</h3>
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{statsData.todayAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-gray-500">Prenotazioni Settimanali</h3>
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{statsData.weeklyBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-gray-500">Fatturato Mensile</h3>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{statsData.monthlyRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-gray-500">Tasso Cancellazioni</h3>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{statsData.cancelationRate}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === 'calendar' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={20} />
          Calendario
        </button>
        <button 
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === 'clients' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('clients')}
        >
          <User size={20} />
          Clienti
        </button>
        <button 
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === 'services' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('services')}
        >
          <Settings size={20} />
          Servizi
        </button>
        <button 
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('reports')}
        >
          <BarChart2 size={20} />
          Report
        </button>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Prossimi Appuntamenti</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2 font-medium">Cliente</th>
                <th className="pb-2 font-medium">Servizio</th>
                <th className="pb-2 font-medium">Data</th>
                <th className="pb-2 font-medium">Ora</th>
                <th className="pb-2 font-medium">Stato</th>
                <th className="pb-2 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsData.map((appointment) => (
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
                      <button className="text-blue-500 hover:text-blue-700">Modifica</button>
                      <button className="text-red-500 hover:text-red-700">Cancella</button>
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