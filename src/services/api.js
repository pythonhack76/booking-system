import { dbService } from './database';

class ApiService {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    await dbService.init();
    
    // Inizializza con dati di esempio se il database è vuoto
    const services = await dbService.getAll('services');
    if (services.length === 0) {
      await this.initializeDefaultData();
    }
    
    this.initialized = true;
  }

  async initializeDefaultData() {
    // Servizi default
    const defaultServices = [
      { name: "Taglio Capelli", duration: 30, price: 25 },
      { name: "Massaggio", duration: 60, price: 50 },
      { name: "Consulenza", duration: 45, price: 40 }
    ];

    // Clienti default
    const defaultClients = [
      { name: "Mario Rossi", email: "mario@example.com", phone: "1234567890" },
      { name: "Laura Bianchi", email: "laura@example.com", phone: "0987654321" }
    ];

    // Inserisci i dati default
    for (const service of defaultServices) {
      await dbService.add('services', service);
    }

    for (const client of defaultClients) {
      await dbService.add('clients', client);
    }
  }

  // CRUD Operations for Appointments
  async getAppointments() {
    await this.init();
    return dbService.getAll('appointments');
  }

  async createAppointment(appointmentData) {
    await this.init();
    const newAppointment = {
      ...appointmentData,
      createdAt: new Date().toISOString(),
      status: appointmentData.status || 'pending'
    };
    const id = await dbService.add('appointments', newAppointment);
    return { ...newAppointment, id };
  }

  async updateAppointment(id, updateData) {
    await this.init();
    const appointment = await dbService.get('appointments', id);
    if (!appointment) throw new Error('Appointment not found');

    const updatedAppointment = {
      ...appointment,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await dbService.update('appointments', updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id) {
    await this.init();
    return dbService.delete('appointments', id);
  }

  // Services CRUD
  async getServices() {
    await this.init();
    return dbService.getAll('services');
  }

  async createService(serviceData) {
    await this.init();
    const id = await dbService.add('services', serviceData);
    return { ...serviceData, id };
  }

  // Clients CRUD
  async getClients() {
    await this.init();
    return dbService.getAll('clients');
  }

  async createClient(clientData) {
    await this.init();
    const id = await dbService.add('clients', clientData);
    return { ...clientData, id };
  }

  // Analytics and Reports
  async getStats() {
    await this.init();
    const appointments = await this.getAppointments();
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppointments = appointments.filter(app => app.date === today);
    const completedAppointments = appointments.filter(app => app.status === 'completed');
    const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');
    
    return {
      todayAppointments: todayAppointments.length,
      weeklyBookings: appointments.length,
      monthlyRevenue: completedAppointments.reduce((sum, app) => sum + (app.price || 0), 0),
      cancelationRate: ((cancelledAppointments.length / appointments.length) * 100).toFixed(1)
    };
  }

  async getAppointmentsByDateRange(startDate, endDate) {
    await this.init();
    return dbService.getAppointmentsByDateRange(startDate, endDate);
  }

  async getClientAppointments(clientId) {
    await this.init();
    return dbService.getClientAppointments(clientId);
  }
}

export const apiService = new ApiService();