import React from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import { MenuItem } from 'primereact/menuitem'
import { useNavigate } from 'react-router-dom'
import ComponentHeader from '../../../00-Header/ComponentHeader'

const ReportsStockLedger: React.FC = () => {
  const navigate = useNavigate()

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'Inventory Reports', command: () => navigate('/reports/inventory') },
    { label: 'Stock Ledger Reports' }
  ]

  return (
    <div>
      <ComponentHeader
        title="Stock Ledger Report"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />
      <div className="p-3">
        <BreadCrumb model={items} />
      </div>
    </div>
  )
}

export default ReportsStockLedger
