import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Politicas from './pages/Politicas'
import LibroReclamaciones from './pages/LibroReclamaciones'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/politicas', element: <Politicas /> },
  { path: '/libro-de-reclamaciones', element: <LibroReclamaciones /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
