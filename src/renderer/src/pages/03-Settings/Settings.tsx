import React, { useState } from 'react'
import {
  FolderKanban,
  Layers3,
  Landmark,
  PackageSearch,
  UsersRound,
  BadgeInfo,
  PanelsTopLeft,
  SlidersVertical
} from 'lucide-react'
import { Divider } from 'primereact/divider'

import './Settings.css'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import SettingsOverview from '../../components/03-SettingsComponents/SettingsOverview'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <PanelsTopLeft size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: <FolderKanban size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'subcategories',
    label: 'Sub Categories',
    icon: <Layers3 size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'branches',
    label: 'Branches',
    icon: <Landmark size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'suppliers',
    label: 'Suppliers',
    icon: <PackageSearch size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'users',
    label: 'Users Roles',
    icon: <UsersRound size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'attributes',
    label: 'Attributes',
    icon: <SlidersVertical size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: <BadgeInfo size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  }
]

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('categories')

  return (
    <div className="settings-container">
      <ComponentHeader title="Settings" subtitle="Monday, Jun 15, 2025" />

      <div className="settings-main">
        {/* Sidebar */}
        <div className="settings-sidebar">
          {sidebarItems.map((item) => {
            const isActive = item.key === activeKey
            return (
              <div
                key={item.key}
                onClick={() => setActiveKey(item.key)}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>

        <Divider layout="vertical" />

        {/* Main Content */}
        <div className="settings-content">
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  )
}

export default Settings
