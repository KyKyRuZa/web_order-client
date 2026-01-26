import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ApplicationsProvider } from './context/ApplicationsContext'
import { AppRouter } from './components/AppRouter'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ApplicationsProvider>
        <AppRouter />
      </ApplicationsProvider>
    </AuthProvider>
  </React.StrictMode>
)