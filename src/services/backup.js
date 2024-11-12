class BackupService {
    constructor() {
      this.VERSION = '1.0';
    }
  
    async exportData() {
      try {
        const appointments = await dbService.getAll('appointments');
        const clients = await dbService.getAll('clients');
        const services = await dbService.getAll('services');
  
        const backup = {
          version: this.VERSION,
          timestamp: new Date().toISOString(),
          data: {
            appointments,
            clients,
            services
          }
        };
  
        // Crea e scarica il file di backup
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-system-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
  
        return true;
      } catch (error) {
        console.error('Export error:', error);
        throw new Error('Errore durante l\'esportazione dei dati');
      }
    }
  
    async importData(file) {
      try {
        const text = await file.text();
        const backup = JSON.parse(text);
  
        // Verifica versione
        if (!backup.version || backup.version !== this.VERSION) {
          throw new Error('Versione del backup non compatibile');
        }
  
        // Pulisci il database esistente
        await dbService.clearAll();
  
        // Importa i dati
        for (const service of backup.data.services) {
          await dbService.add('services', service);
        }
        for (const client of backup.data.clients) {
          await dbService.add('clients', client);
        }
        for (const appointment of backup.data.appointments) {
          await dbService.add('appointments', appointment);
        }
  
        return true;
      } catch (error) {
        console.error('Import error:', error);
        throw new Error('Errore durante l\'importazione dei dati');
      }
    }
  }
  
  export const backupService = new BackupService();