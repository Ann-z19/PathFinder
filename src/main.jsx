import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import './styles/tokens.css'
import './index.css'
import App from './App.jsx'
import AssessmentProvider from './context/AssessmentProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AssessmentProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AssessmentProvider>
  </StrictMode>,
)
