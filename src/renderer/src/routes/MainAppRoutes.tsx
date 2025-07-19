import Login from '../pages/01-Login/Login'
import React from 'react'

import { Route, Routes } from 'react-router-dom'
import ForgotPassword from '../pages/01-Login/ForgotPassword'

const MainAppRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}

export default MainAppRoutes
