import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createHashRouter, RouterProvider } from "react-router-dom"
import HomePage from "./HomePage.jsx";
import ReservationsPage from "./ReservationsPage.jsx";
import SamplesPage from "./SamplesPage.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/reservations",
        element: <ReservationsPage />
      },
      {
        path: "/samples",
        element: <SamplesPage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
