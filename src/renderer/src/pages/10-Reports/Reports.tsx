import { Blocks, FolderClosed } from 'lucide-react'
import React, { useState } from 'react'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import { Divider } from 'primereact/divider'

import './Reports.css'
import ReportsOverview from '../../components/10-Reports/ReportsOverview/ReportsOverview'
import ReportsProducts from '../../components/10-Reports/ReportsProducts/ReportsProducts'
import ReportsSupplier from '../../components/10-Reports/ReportsSupplier/ReportsSupplier'
import ReportsInventory from '../../components/10-Reports/04-ReportsInventory/ReportsInventory'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <Blocks size={20} className="sidebar-icon" />,
    component: <ReportsOverview />
  },
  {
    key: 'orderReports',
    label: 'Order Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsProducts />
  },
  {
    key: 'salesReport',
    label: 'Sales / Purchase Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsProducts />
  },
  {
    key: 'supplierReport',
    label: 'Supplier Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsProducts />
  },
  {
    key: 'inventoryReports',
    label: 'Inventory Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsInventory />
  },
  {
    key: 'accountsReport',
    label: 'Accounts Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsSupplier />
  },
  {
    key: 'posReports',
    label: 'POS Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsProducts />
  },
  {
    key: 'miscellaneousReports',
    label: 'Miscellaneous Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsSupplier />
  }
]

const Reports: React.FC = () => {
  const [activeKey, setActiveKey] = useState('overview')

  return (
    <div className="settingsContainer">
      <ComponentHeader
        title="Reports"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />

      <div className="settingsMain">
        {/* Sidebar */}
        <div className="settingsSidebar">
          {sidebarItems.map((item) => {
            const isActive = item.key === activeKey
            return (
              <div
                key={item.key}
                onClick={() => setActiveKey(item.key)}
                className={`sidebarItem ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>

        <Divider layout="vertical" />

        {/* Main Content */}
        <div className="settingsContent">
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  )
}

export default Reports
