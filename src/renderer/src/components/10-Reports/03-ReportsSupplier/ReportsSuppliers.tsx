import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReportsSuppliers: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <p className="text-lg font-semibold mb-4">Suppliers Reports</p>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 reportItem" onClick={() => navigate('/supplier/supplierReports')}>
          <p>Supplier Report</p>
        </div>
        <div className="flex-1 reportItem" onClick={() => navigate('/supplier/purchaseReports')}>
          <p>Supplier Purchase</p>
        </div>
        <div className="flex-1 reportItem" onClick={() => navigate('/supplier/supplierDetails')}>
          <p>Supplier Details Report</p>
        </div>
        <div className="flex-1 "></div>
      </div>
    </div>
  )
}

export default ReportsSuppliers
