import React, { useState } from 'react'
import {
  FolderKanban,
  Layers3,

  BadgeInfo,
  PanelsTopLeft,
} from 'lucide-react'
import { Divider } from 'primereact/divider'

import './Inventory.css'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import InventoryOverview from '../../components/08-InventoryComponents/InventoryOverview/InventoryOverview'
import InventoryStockTake from '../../components/08-InventoryComponents/InventoryStockTake/InventoryStockTake'
import InventoryTracker from '../../components/08-InventoryComponents/InventoryTracker/InventoryTracker'


// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <PanelsTopLeft size={20} className="sidebar-icon" />,
    component: <InventoryOverview />
  },
  {
    key: 'stockIntake',
    label: 'Stock Take',
    icon: <FolderKanban size={20} className="sidebar-icon" />,
    component: <InventoryStockTake />
  },
  {
    key: 'stock Transfer',
    label: 'Stock Return',
    icon: <Layers3 size={20} className="sidebar-icon" />,
    component: <InventoryOverview />
  },
  {
    key: 'inventorytracker',
    label: 'Inventory Tracker',
    icon: <BadgeInfo size={20} className="sidebar-icon" />,
    component: <InventoryTracker />
  },
  
]

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('categories')

  return (
    <div className="settingsContainer">
<ComponentHeader 
  title="Inventory" 
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

export default Settings
