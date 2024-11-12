class AvailabilityService {
    constructor() {
      this.SLOT_DURATION = 15; // minuti
    }
  
    async getAvailableSlots(date, serviceId) {
      const service = await dbService.get('services', serviceId);
      const workingHours = await this.getWorkingHours(date);
      const appointments = await this.getAppointmentsForDate(date);
      
      return this.calculateAvailableSlots(workingHours, appointments, service.duration);
    }
  
    async getWorkingHours(date) {
      // Recupera gli orari di lavoro per il giorno specificato
      const dayOfWeek = new Date(date).getDay();
      const workingHours = await dbService.get('settings', 'workingHours');
      
      return workingHours[dayOfWeek] || {
        start: '09:00',
        end: '18:00',
        breaks: [
          { start: '13:00', end: '14:00' }
        ]
      };
    }
  
    async getAppointmentsForDate(date) {
      return dbService.getAppointmentsByDateRange(
        `${date}T00:00:00`, 
        `${date}T23:59:59`
      );
    }
  
    calculateAvailableSlots(workingHours, appointments, serviceDuration) {
      const slots = [];
      const startTime = new Date(`2000-01-01T${workingHours.start}`);
      const endTime = new Date(`2000-01-01T${workingHours.end}`);
  
      // Genera tutti gli slot possibili
      for (
        let time = startTime; 
        time < endTime; 
        time = new Date(time.getTime() + this.SLOT_DURATION * 60000)
      ) {
        if (this.isSlotAvailable(time, serviceDuration, appointments, workingHours.breaks)) {
          slots.push(time.toTimeString().slice(0, 5));
        }
      }
  
      return slots;
    }
  
    isSlotAvailable(startTime, duration, appointments, breaks) {
      const endTime = new Date(startTime.getTime() + duration * 60000);
  
      // Controlla le pause
      for (const break_ of breaks) {
        const breakStart = new Date(`2000-01-01T${break_.start}`);
        const breakEnd = new Date(`2000-01-01T${break_.end}`);
  
        if (startTime < breakEnd && endTime > breakStart) {
          return false;
        }
      }
  
      // Controlla i conflitti con altri appuntamenti
      for (const appointment of appointments) {
        const appointmentStart = new Date(`2000-01-01T${appointment.time}`);
        const appointmentEnd = new Date(
          appointmentStart.getTime() + appointment.duration * 60000
        );
  
        if (startTime < appointmentEnd && endTime > appointmentStart) {
          return false;
        }
      }
  
      return true;
    }
  
    async checkConflicts(appointmentData) {
      const existingAppointments = await this.getAppointmentsForDate(appointmentData.date);
      const startTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
      const endTime = new Date(startTime.getTime() + appointmentData.duration * 60000);
  
      const conflicts = existingAppointments.filter(appointment => {
        const appointmentStart = new Date(`${appointment.date}T${appointment.time}`);
        const appointmentEnd = new Date(
          appointmentStart.getTime() + appointment.duration * 60000
        );
  
        return startTime < appointmentEnd && endTime > appointmentStart;
      });
  
      return conflicts;
    }
  }
  
  export const availabilityService = new AvailabilityService();