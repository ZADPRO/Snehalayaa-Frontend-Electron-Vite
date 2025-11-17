import React, { useState } from 'react'
import {
  FolderKanban,
  Layers3,
  // PanelsTopLeft,
  PackageCheck,
  ImageUp,
  TableOfContents
} from 'lucide-react'
import { Divider } from 'primereact/divider'

import './Inventory.css'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
// import InventoryOverview from '../../components/08-InventoryComponents/InventoryOverview/InventoryOverview'
import InventoryStockTake from '../../components/08-InventoryComponents/InventoryStockTake/InventoryStockTake'
// import InventoryTracker from '../../components/08-InventoryComponents/InventoryTracker/InventoryTracker'
import InventoryStockTransfer from '../../components/08-InventoryComponents/InventoryStockTransfer/InventoryStockTransfer'
import InventoryProducts from '../../components/08-InventoryComponents/InventoryProducts/InventoryProducts'
import InventoryBulkUpdate from '../../components/08-InventoryComponents/InventoryBulkUpdate/InventoryBulkUpdate'
import ImageBulkUpload from '../../components/08-InventoryComponents/ImageBulkUpload/ImageBulkUpload'
import ShopifyProducts from '../../components/08-InventoryComponents/ShopifyProducts/ShopifyProducts'

// Sidebar items config
const sidebarItems = [
  // {
  //   key: 'overview',
  //   label: 'Overview',
  //   icon: <PanelsTopLeft size={20} className="sidebar-icon" />,
  //   component: <InventoryOverview />
  // },
  {
    key: 'stockTransfer',
    label: 'Stock Take',
    icon: <Layers3 size={20} className="sidebar-icon" />,
    component: <InventoryStockTransfer />
  },
  {
    key: 'stockIntake',
    label: 'Stock Transfer',
    icon: <FolderKanban size={20} className="sidebar-icon" />,
    component: <InventoryStockTake />
  },
  // {
  //   key: 'inventorytracker',
  //   label: 'Inventory Tracker',
  //   icon: <BadgeInfo size={20} className="sidebar-icon" />,
  //   component: <InventoryTracker />
  // },
  {
    key: 'products',
    label: 'Products',
    icon: <PackageCheck size={20} className="sidebar-icon" />,
    component: <InventoryProducts />
  },
  {
    key: 'bulkUpload',
    label: 'Data Bulk Update',
    icon: <TableOfContents size={20} className="sidebar-icon" />,
    component: <InventoryBulkUpdate />
  },
  {
    key: 'imageUpload',
    label: 'Image Upload',
    icon: <ImageUp size={20} className="sidebar-icon" />,
    component: <ImageBulkUpload />
  },
  {
    key: 'shopify',
    label: 'Shopify Products',
    icon: <PackageCheck size={20} className="sidebar-icon" />,
    component: <ShopifyProducts />
  }
]

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('stockIntake')

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
