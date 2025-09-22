import { Blocks } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReportsInventory: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <p className="text-lg font-semibold mb-4">Inventory Reports</p>
      <div className="flex gap-3 mb-3">
        <div
          className="flex-1 reportItem"
          onClick={() => navigate('/inventoryReports/stockSummary')}
        >
          <p>Stock Summary</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Stock Valuation Summary</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Stock Ageing Summary</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Stock Location Summary</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 reportItem">
          <p>Stock Movement Summary</p>
        </div>
        <div
          className="flex-1 reportItem"
          onClick={() => navigate('/inventoryReports/stockLedger')}
        >
          <p>Stock Ledger Report</p>
        </div>
        <div className="flex-1 reportItem">
          <p>Stock Movement & Valuation</p>
        </div>

        <div className="flex-1 reportItem">
          <p>Stock / Location Summary</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsInventory
