import React, { useState } from 'react'
import {
  FolderKanban,
  Layers3,
  Landmark,
  PackageSearch,
  // UsersRound,
  IdCard,
  // SlidersVertical,
  LayoutDashboard,
  // UsersRound,
  SlidersVertical
} from 'lucide-react'
import { Divider } from 'primereact/divider'

import './Settings.css'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import SettingsOverview from '../../components/03-SettingsComponents/SettingsOverview/SettingsOverview'
import SettingsCategories from '../../components/03-SettingsComponents/SettingsCategories/SettingsCategories'
import SettingsSubCategories from '../../components/03-SettingsComponents/SettingsSubCategories/SettingsSubCategories'
import SettingsSuppliers from '../../components/03-SettingsComponents/SettingsSuppliers/SettingsSuppliers'
import SettingsBranch from '../../components/03-SettingsComponents/SettingsBranch/SettingsBranch'
import SettingsEmployees from '../../components/03-SettingsComponents/SettingsEmployees/SettingsEmployees'
// import SettingsAttribute from '../../components/03-SettingsComponents/SettingsAttribute/SettingsAttribute'
import SettingsAttributes from '../../components/03-SettingsComponents/SettingsAttributes/SettingsAttributes'
// import SettingsUserRoles from '../../components/03-SettingsComponents/SettingsUserRoles/SettingsUserRoles'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard size={20} className="sidebar-icon" />,
    component: <SettingsOverview />
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: <FolderKanban size={20} className="sidebar-icon" />,
    component: <SettingsCategories />
  },
  {
    key: 'subcategories',
    label: 'Sub Categories',
    icon: <Layers3 size={20} className="sidebar-icon" />,
    component: <SettingsSubCategories />
  },
  {
    key: 'branches',
    label: 'Branches',
    icon: <Landmark size={20} className="sidebar-icon" />,
    component: <SettingsBranch />
  },
  {
    key: 'suppliers',
    label: 'Suppliers',
    icon: <PackageSearch size={20} className="sidebar-icon" />,
    component: <SettingsSuppliers />
  },
  // {
  //   key: 'users',
  //   label: 'Users Roles',
  //   icon: <UsersRound size={20} className="sidebar-icon" />,
  //   component: <SettingsUserRoles />
  // },
  {
    key: 'attributes',
    label: 'Attributes',
    icon: <SlidersVertical size={20} className="sidebar-icon" />,
    component: <SettingsAttributes />
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: <IdCard size={20} className="sidebar-icon" />,
    component: <SettingsEmployees />
  }
]

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('attributes')

  return (
    <div className="settingsContainer">
      <ComponentHeader
        title="Settings"
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
