import { Blocks, ShoppingBag, Undo2 } from 'lucide-react'
import React, { useState } from 'react'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import { Divider } from 'primereact/divider'

import './POSmanagement.css'
import POSmanagementOverview from '../../components/09-POSmanagement/POSmanagementOverview/POSmanagementOverview'
import POSsalesOrder from '../../components/09-POSmanagement/POSmanagement/POSsalesOrder/POSsalesOrder'
import POSsalesReturn from '../../components/09-POSmanagement/POSmanagement/POSsalesReturn/POSsalesReturn'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <Blocks size={20} className="sidebar-icon" />,
    component: <POSmanagementOverview />
  },
  {
    key: 'salesOrder',
    label: 'Sales Order',
    icon: <ShoppingBag size={20} className="sidebar-icon" />,
    component: <POSsalesOrder />
  },
  {
    key: 'salesReturn',
    label: 'Sales Return',
    icon: <Undo2 size={20} className="sidebar-icon" />,
    component: <POSsalesReturn />
  }
]

const POSmanagement: React.FC = () => {
  const [activeKey, setActiveKey] = useState('salesOrder')

  return (
    <div className="settingsContainer">
      <ComponentHeader
        title="POS Management"
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

export default POSmanagement
