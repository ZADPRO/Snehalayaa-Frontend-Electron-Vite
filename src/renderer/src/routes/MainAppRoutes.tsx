import Login from '@renderer/pages/01-Login/Login'
import React from 'react'

import { Route, Routes } from 'react-router-dom'

const MainAppRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default MainAppRoutes
