class CalendarSyncService {
    constructor() {
      this.CALENDAR_ID = 'primary';
      this.initialized = false;
    }
  
    async init() {
      if (this.initialized) return;
  
      // Carica l'API di Google Calendar
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
  
      await new Promise((resolve) => gapi.load('client:auth2', resolve));
      
      await gapi.client.init({
        apiKey: process.env.GOOGLE_API_KEY,
        clientId: process.env.GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });
  
      this.initialized = true;
    }
  
    async syncAppointments() {
      await this.init();
      
      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await gapi.auth2.getAuthInstance().signIn();
      }
  
      const appointments = await dbService.getAll('appointments');
  
      for (const appointment of appointments) {
        await this.createOrUpdateCalendarEvent(appointment);
      }
    }
  
    async createOrUpdateCalendarEvent(appointment) {
      const event = {
        summary: `${appointment.service} - ${appointment.client}`,
        description: appointment.notes,
        start: {
          dateTime: new Date(`${appointment.date}T${appointment.time}`).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: this.calculateEndTime(appointment),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
  
      if (appointment.calendarEventId) {
        await gapi.client.calendar.events.update({
          calendarId: this.CALENDAR_ID,
          eventId: appointment.calendarEventId,
          resource: event
        });
      } else {
        const response = await gapi.client.calendar.events.insert({
          calendarId: this.CALENDAR_ID,
          resource: event
        });
        
        // Salva l'ID dell'evento del calendario
        await dbService.update('appointments', {
          ...appointment,
          calendarEventId: response.result.id
        });
      }
    }
  
    calculateEndTime(appointment) {
      const startTime = new Date(`${appointment.date}T${appointment.time}`);
      const endTime = new Date(startTime.getTime() + (appointment.duration * 60000));
      return endTime.toISOString();
    }
  }
  
  export const calendarSyncService = new CalendarSyncService();