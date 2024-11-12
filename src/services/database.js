class DatabaseService {
    constructor() {
      this.dbName = 'bookingSystemDB';
      this.version = 1;
      this.db = null;
    }
  
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
  
          // Crea gli object stores
          if (!db.objectStoreNames.contains('appointments')) {
            const appointmentStore = db.createObjectStore('appointments', { keyPath: 'id', autoIncrement: true });
            appointmentStore.createIndex('date', 'date');
            appointmentStore.createIndex('clientId', 'clientId');
          }
  
          if (!db.objectStoreNames.contains('clients')) {
            const clientStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
            clientStore.createIndex('email', 'email', { unique: true });
          }
  
          if (!db.objectStoreNames.contains('services')) {
            const serviceStore = db.createObjectStore('services', { keyPath: 'id', autoIncrement: true });
            serviceStore.createIndex('name', 'name', { unique: true });
          }
        };
      });
    }
  
    async add(storeName, data) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async getAll(storeName) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async get(storeName, id) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async update(storeName, data) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async delete(storeName, id) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    // Query specializzate
    async getAppointmentsByDateRange(startDate, endDate) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction('appointments', 'readonly');
        const store = transaction.objectStore('appointments');
        const dateIndex = store.index('date');
        const range = IDBKeyRange.bound(startDate, endDate);
        const request = dateIndex.getAll(range);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async getClientAppointments(clientId) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction('appointments', 'readonly');
        const store = transaction.objectStore('appointments');
        const clientIndex = store.index('clientId');
        const request = clientIndex.getAll(clientId);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const dbService = new DatabaseService();