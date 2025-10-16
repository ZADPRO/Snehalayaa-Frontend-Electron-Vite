import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReportsSales: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <p className="text-lg font-semibold mb-4">Sales / Purchase Reports</p>
      <div className="flex gap-3 mb-3">
        <div
          className="flex-1 reportItem"
          onClick={() => navigate('/inventoryReports/stockSummary')}
        >
          <p>Sales Invoice</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Purchase Invoice</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Receipt Report</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Agent Sales Report</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 reportItem">
          <p>Employee Report</p>
        </div>
        <div
          className="flex-1 reportItem"
          onClick={() => navigate('/inventoryReports/stockLedger')}
        >
          <p>Sales Invoice</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Purchase Invoice</p>
        </div>

        <div className="flex-1 reportItem">
          <p>Daily Settlements</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsSales
