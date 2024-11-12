// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AppointmentProvider } from './context/AppointmentContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppointmentProvider>
      <App />
    </AppointmentProvider>
  </React.StrictMode>
)