import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica i dati iniziali
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, servicesData, statsData] = await Promise.all([
          apiService.getAppointments(),
          apiService.getServices(),
          apiService.getStats()
        ]);
        
        setAppointments(appointmentsData);
        setServices(servicesData);
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Gestione Appuntamenti
  const createAppointment = useCallback(async (appointmentData) => {
    try {
      const newAppointment = await apiService.createAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateAppointment = useCallback(async (id, updateData) => {
    try {
      const updatedAppointment = await apiService.updateAppointment(id, updateData);
      setAppointments(prev => 
        prev.map(app => app.id === id ? updatedAppointment : app)
      );
      return updatedAppointment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteAppointment = useCallback(async (id) => {
    try {
      await apiService.deleteAppointment(id);
      setAppointments(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Refresh dei dati
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [appointmentsData, statsData] = await Promise.all([
        apiService.getAppointments(),
        apiService.getStats()
      ]);
      
      setAppointments(appointmentsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    appointments,
    services,
    stats,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshData
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider');
  }
  return context;
};