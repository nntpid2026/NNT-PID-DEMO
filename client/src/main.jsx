import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MockStoreProvider } from './context/MockStore.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MockStoreProvider>
      <App />
    </MockStoreProvider>
  </StrictMode>,
)
