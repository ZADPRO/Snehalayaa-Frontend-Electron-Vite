import Login from '../pages/01-Login/Login'
import React from 'react'

import { Route, Routes } from 'react-router-dom'
import ForgotPassword from '../pages/01-Login/ForgotPassword'
import Dashboard from '../pages/02-Dashboard/Dashboard'
import Settings from '../pages/03-Settings/Settings'
import Header from '../components/00-Header/Header'
import PurchaseOrder from '../pages/05-PurchaseOrder/PurchaseOrder'
import Inventory from '../pages/06-Inventory/Inventory'
import Profile from '../pages/04-Profile/Profile'
import POSmanagement from '../pages/07-POSmanagement/POSmanagement'
import Reports from '../pages/10-Reports/Reports'

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
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pos" element={<POSmanagement />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Header>
          }
        />
      </Routes>
    </div>
  )
}

export default MainAppRoutes
