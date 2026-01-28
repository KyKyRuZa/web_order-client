import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ApplicationsProvider } from './context/ApplicationsContext'
import { ToastProvider } from './context/ToastContext'
import { AppRouter } from './components/AppRouter'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ApplicationsProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </ApplicationsProvider>
    </AuthProvider>
  </React.StrictMode>
)