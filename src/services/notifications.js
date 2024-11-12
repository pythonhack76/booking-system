class NotificationService {
    constructor() {
      this.permission = false;
      this.worker = null;
    }
  
    async init() {
      if (!('Notification' in window)) {
        throw new Error('Questo browser non supporta le notifiche desktop');
      }
  
      // Richiedi il permesso per le notifiche
      const permission = await Notification.requestPermission();
      this.permission = permission === 'granted';
  
      if (this.permission) {
        // Registra il service worker per le notifiche in background
        this.worker = await navigator.serviceWorker.register('/notification-worker.js');
        
        // Sottoscrivi alle notifiche push
        const subscription = await this.worker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.VAPID_PUBLIC_KEY
        });
  
        // Salva la subscription nel database
        await dbService.update('settings', {
          id: 'pushSubscription',
          subscription
        });
      }
    }
  
    async scheduleNotification(appointment) {
      if (!this.permission) return;
  
      const notificationTime = new Date(`${appointment.date}T${appointment.time}`);
      notificationTime.setMinutes(notificationTime.getMinutes() - 30); // 30 minuti prima
  
      const notification = {
        id: appointment.id,
        title: 'Promemoria Appuntamento',
        body: `Hai un appuntamento per ${appointment.service} alle ${appointment.time}`,
        timestamp: notificationTime.getTime()
      };
  
      await dbService.add('notifications', notification);
    }
  
    async showNotification(notification) {
      if (!this.permission) return;
  
      return new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/notification-icon.png',
        badge: '/icons/notification-badge.png',
        vibrate: [200, 100, 200]
      });
    }
  
    async checkScheduledNotifications() {
      const notifications = await dbService.getAll('notifications');
      const now = Date.now();
  
      for (const notification of notifications) {
        if (notification.timestamp <= now) {
          await this.showNotification(notification);
          await dbService.delete('notifications', notification.id);
        }
      }
    }
  }
  
  export const notificationService = new NotificationService();