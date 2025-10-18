import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReportsAccounts: React.FC = () => {
  const navigate = useNavigate()
  console.log('navigate', navigate)

  return (
    <div>
      <p className="text-lg font-semibold mb-4">Accounts Report</p>
      <div className="flex gap-3 mb-3">
        {/* <div className="flex-1 reportItem" onClick={() => navigate('/posReports/cashRegister')}>
          <p>Cash Register</p>
        </div>
        <div className="flex-1 reportItem" onClick={() => navigate('/posReports/currentCash')}>
          <p>Current Cash</p>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1"></div> */}
      </div>
    </div>
  )
}

export default ReportsAccounts
