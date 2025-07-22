import Login from '../pages/01-Login/Login'
import React from 'react'

import { Route, Routes } from 'react-router-dom'
import ForgotPassword from '../pages/01-Login/ForgotPassword'
import Dashboard from '../pages/02-Dashboard/Dashboard'
import Settings from '../pages/03-Settings/Settings'
import Header from '../components/00-Header/Header'
import PurchaseOrder from '../pages/05-PurchaseOrder/PurchaseOrder'

const MainAppRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="*"
          element={
            <Header>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/pomgmt" element={<PurchaseOrder />} />
              </Routes>
            </Header>
          }
        />
      </Routes>
    </div>
  )
}

export default MainAppRoutes
