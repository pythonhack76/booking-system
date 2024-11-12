// src/context/AppointmentContext.jsx
import React, { createContext, useContext, useState } from 'react'

const AppointmentContext = createContext()

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([])
  
  return (
    <AppointmentContext.Provider value={{ appointments, setAppointments }}>
      {children}
    </AppointmentContext.Provider>
  )
}

export function useAppointments() {
  return useContext(AppointmentContext)
}