import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './styles/index.css'

axios.defaults.baseURL = 'https://gpf-backend.vercel.app/api'
// axios.defaults.baseURL = 'http://localhost:5000/api'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
