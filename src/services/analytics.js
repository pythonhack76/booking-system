class AnalyticsService {
    async getRevenueReport(startDate, endDate) {
      const appointments = await dbService.getAppointmentsByDateRange(startDate, endDate);
      
      const revenueByDay = {};
      const revenueByService = {};
      let totalRevenue = 0;
  
      appointments.forEach(appointment => {
        if (appointment.status === 'completed') {
          // Revenue by day
          const day = appointment.date;
          revenueByDay[day] = (revenueByDay[day] || 0) + appointment.price;
  
          // Revenue by service
          revenueByService[appointment.service] = 
            (revenueByService[appointment.service] || 0) + appointment.price;
  
          totalRevenue += appointment.price;
        }
      });
  
      return {
        totalRevenue,
        revenueByDay,
        revenueByService,
        averageDailyRevenue: totalRevenue / Object.keys(revenueByDay).length,
        topServices: Object.entries(revenueByService)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
      };
    }
  
    async getClientAnalytics() {
      const appointments = await dbService.getAll('appointments');
      const clients = await dbService.getAll('clients');
  
      const clientStats = {};
      clients.forEach(client => {
        const clientAppointments = appointments.filter(a => a.clientId === client.id);
        
        clientStats[client.id] = {
          name: client.name,
          totalAppointments: clientAppointments.length,
          totalSpent: clientAppointments.reduce((sum, a) => sum + (a.price || 0), 0),
          averageSpent: clientAppointments.length > 0 
            ? clientAppointments.reduce((sum, a) => sum + (a.price || 0), 0) / clientAppointments.length 
            : 0,
          lastVisit: clientAppointments.length > 0 
            ? Math.max(...clientAppointments.map(a => new Date(a.date)))
            : null,
          preferredServices: this.getPreferredServices(clientAppointments),
          cancellationRate: this.calculateCancellationRate(clientAppointments),
          visitFrequency: this.calculateVisitFrequency(clientAppointments)
        };
      });
  
      return {
        clientStats,
        topClients: this.getTopClients(clientStats),
        clientRetentionRate: this.calculateRetentionRate(clientStats)
      };
    }
  
    calculateVisitFrequency(appointments) {
      if (appointments.length < 2) return null;
      
      const dates = appointments
        .map(a => new Date(a.date))
        .sort((a, b) => a - b);
      
      const intervals = [];
      for (let i = 1; i < dates.length; i++) {
        intervals.push(dates[i] - dates[i-1]);
      }
      
      return Math.average(intervals) / (1000 * 60 * 60 * 24); // Convert to days
    }
  
    async getServicePerformance() {
      const appointments = await dbService.getAll('appointments');
      const services = await dbService.getAll('services');
  
      const serviceStats = {};
      services.forEach(service => {
        const serviceAppointments = appointments.filter(a => a.service === service.name);
        
        serviceStats[service.id] = {
          name: service.name,
          totalBookings: serviceAppointments.length,
          revenue: serviceAppointments.reduce((sum, a) => sum + (a.price || 0), 0),
          utilization: this.calculateUtilization(serviceAppointments, service),
          popularTimeSlots: this.getPopularTimeSlots(serviceAppointments),
          cancellationRate: this.calculateCancellationRate(serviceAppointments),
          averageDuration: service.duration,
          revenuePerHour: this.calculateRevenuePerHour(serviceAppointments, service)
        };
      });
  
      return {
        serviceStats,
        topServices: this.getTopServices(serviceStats),
        utilizationRate: this.calculateOverallUtilization(serviceStats)
      };
    }
  
    getPopularTimeSlots(appointments) {
      const timeSlots = {};
      appointments.forEach(appointment => {
        const hour = appointment.time.split(':')[0];
        timeSlots[hour] = (timeSlots[hour] || 0) + 1;
      });
  
      return Object.entries(timeSlots)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [hour, count]) => ({
          ...obj,
          [`${hour}:00`]: count
        }), {});
    }
  
    calculateUtilization(appointments, service) {
      const totalPossibleHours = this.calculateTotalPossibleHours(service);
      const totalBookedHours = appointments.reduce((sum, a) => sum + service.duration, 0) / 60;
      
      return (totalBookedHours / totalPossibleHours) * 100;
    }
  
    calculateRevenuePerHour(appointments, service) {
      const totalHours = appointments.reduce((sum, a) => sum + service.duration, 0) / 60;
      const totalRevenue = appointments.reduce((sum, a) => sum + (a.price || 0), 0);
      
      return totalHours > 0 ? totalRevenue / totalHours : 0;
    }
  
    async getDashboardStats() {
      const today = new Date().toISOString().split('T')[0];
      const appointments = await dbService.getAll('appointments');
      
      return {
        totalAppointments: appointments.length,
        todayAppointments: appointments.filter(a => a.date === today).length,
        upcomingAppointments: appointments.filter(a => 
          a.date > today && a.status !== 'cancelled'
        ).length,
        revenueToday: appointments
          .filter(a => a.date === today && a.status === 'completed')
          .reduce((sum, a) => sum + (a.price || 0), 0),
        cancellationRate: this.calculateCancellationRate(appointments),
        busyHours: this.getPopularTimeSlots(appointments),
        revenueGraph: await this.getRevenueGraphData(),
        appointmentsByService: this.getAppointmentsByService(appointments)
      };
    }
  
    async getRevenueGraphData() {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
  
      const { revenueByDay } = await this.getRevenueReport(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
  
      return Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue
      }));
    }
  
    getAppointmentsByService(appointments) {
      const serviceCount = {};
      appointments.forEach(appointment => {
        serviceCount[appointment.service] = (serviceCount[appointment.service] || 0) + 1;
      });
  
      return Object.entries(serviceCount)
        .map(([service, count]) => ({
          service,
          count,
          percentage: (count / appointments.length) * 100
        }));
    }
  }
  
  export const analyticsService = new AnalyticsService();