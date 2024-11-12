import React, { useState, useEffect } from 'react';
import { Calendar, Settings, BarChart2, Bell, Download, Upload, RefreshCw } from 'lucide-react';
import BookingDashboard from './components/BookingDashboard';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import NotificationSystem from './components/notifications/NotificationSystem';
import { backupService } from './services/backup';
import { calendarSyncService } from './services/calendarSync';
import { notificationService } from './services/notifications';

function App() {
  const [activeTab, setActiveTab] = useState('booking');
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      await notificationService.init();
      // Check for scheduled notifications every minute
      setInterval(() => {
        notificationService.checkScheduledNotifications();
      }, 60000);
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  };

  const handleBackup = async () => {
    try {
      await backupService.exportData();
    } catch (error) {
      console.error('Backup error:', error);
      alert('Errore durante il backup: ' + error.message);
    }
  };

  const handleRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await backupService.importData(file);
      window.location.reload();
    } catch (error) {
      console.error('Restore error:', error);
      alert('Errore durante il ripristino: ' + error.message);
    }
  };

  const handleCalendarSync = async () => {
    try {
      setSyncStatus('syncing');
      await calendarSyncService.syncAppointments();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSystem />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sistema di Prenotazione</h1>
            
            {/* Azioni Globali */}
            <div className="flex items-center space-x-4">
              {/* Backup/Restore */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackup}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <Download size={16} className="mr-2" />
                  Backup
                </button>
                <label className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                  <Upload size={16} className="mr-2" />
                  Ripristina
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestore}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sync Calendar */}
              <button
                onClick={handleCalendarSync}
                className={`flex items-center px-3 py-2 rounded text-white ${
                  syncStatus === 'syncing' ? 'bg-blue-400' :
                  syncStatus === 'success' ? 'bg-green-500' :
                  syncStatus === 'error' ? 'bg-red-500' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={syncStatus === 'syncing'}
              >
                <RefreshCw size={16} className={`mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {syncStatus === 'syncing' ? 'Sincronizzazione...' :
                 syncStatus === 'success' ? 'Sincronizzato!' :
                 syncStatus === 'error' ? 'Errore' :
                 'Sincronizza Calendario'}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mt-4 space-x-4 border-b">
            <button
              onClick={() => setActiveTab('booking')}
              className={`pb-2 px-1 ${
                activeTab === 'booking'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={20} className="inline mr-2" />
              Prenotazioni
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 px-1 ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart2 size={20} className="inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 px-1 ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings size={20} className="inline mr-2" />
              Impostazioni
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'booking' && <BookingDashboard />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'settings' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Impostazioni</h2>
            {/* Aggiungi qui le impostazioni del sistema */}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Sistema di Prenotazione v1.0 - © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;