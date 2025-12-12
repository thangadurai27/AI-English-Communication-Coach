import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/mobile.css'
import './i18n'
import { initMobileOptimizations } from './utils/mobile'
import { measureWebVitals, optimizeFontLoading } from './utils/performance'

// Initialize mobile optimizations
initMobileOptimizations();

// Optimize font loading
optimizeFontLoading();

// Measure web vitals in development
if (import.meta.env.DEV) {
  measureWebVitals();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
