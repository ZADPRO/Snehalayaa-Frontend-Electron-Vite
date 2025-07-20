import { Blocks, PackagePlus, ShoppingBag } from 'lucide-react'
import React, { useState } from 'react'
import PurchaseOrderOverview from '../../components/05-PurchaseOrderComponents/PurchaseOrderOverview/PurchaseOrderOverview'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import { Divider } from 'primereact/divider'
// import PurchaseOrderProductCreation from '../../components/05-PurchaseOrderComponents/PurchaseOrderProductCreation/PurchaseOrderProductCreation'
import PurchaseOrderCreation from '../../components/05-PurchaseOrderComponents/PurchaseOrderCreation/PurchaseOrderCreation'
import AddNewPurchaseOrder from '../../components/05-PurchaseOrderComponents/PurchaseOrderCreation/AddNewPurchaseOrder/AddNewPurchaseOrder'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <Blocks size={20} className="sidebar-icon" />,
    component: <PurchaseOrderOverview />
  },
  // {
  //   key: 'dummyProducts',
  //   label: 'PO Products',
  //   icon: <ShoppingBag size={20} className="sidebar-icon" />,
  //   component: <PurchaseOrderProductCreation />
  // },
  {
    key: 'purchaseOrder',
    label: 'Purchase Order',
    icon: <ShoppingBag size={20} className="sidebar-icon" />,
    component: <PurchaseOrderCreation />
  },
  {
    key: 'createPurchaseOrder',
    label: 'Create PO',
    icon: <PackagePlus size={20} className="sidebar-icon" />,
    component: <AddNewPurchaseOrder />
  }
]

const PurchaseOrder: React.FC = () => {
  const [activeKey, setActiveKey] = useState('createPurchaseOrder')

  return (
    <div className="settingsContainer">
      <ComponentHeader title="Settings" subtitle="Monday, Jun 15, 2025" />

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

export default PurchaseOrder
