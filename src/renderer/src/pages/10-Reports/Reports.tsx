import { Blocks, FolderClosed } from 'lucide-react'
import React, { useState } from 'react'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import { Divider } from 'primereact/divider'

import './Reports.css'
import ReportsOverview from '../../components/10-Reports/ReportsOverview/ReportsOverview'
import ReportsProducts from '../../components/10-Reports/ReportsProducts/ReportsProducts'
// import ReportsSales from '../../components/10-Reports/ReportsSales/ReportsSales'
import ReportsSupplier from '../../components/10-Reports/ReportsSupplier/ReportsSupplier'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <Blocks size={20} className="sidebar-icon" />,
    component: <ReportsOverview />
  },
  {
    key: 'productReports',
    label: 'Product Reports',
    icon: <FolderClosed size={20} className="sidebar-icon" />,
    component: <ReportsProducts />
  },
  // {
  //   key: 'salesReport',
  //   label: 'Sales Reports',
  //   icon: <FolderClosed size={20} className="sidebar-icon" />,
  //   component: <ReportsSales />
  // },
  {
    key: 'supplierReport',
    label: 'Supplier Reports',
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
