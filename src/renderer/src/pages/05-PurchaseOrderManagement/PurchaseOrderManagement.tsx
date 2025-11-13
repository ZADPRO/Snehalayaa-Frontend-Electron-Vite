import React, { useState } from 'react'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import { Divider } from 'primereact/divider'
import NewPurchaseOrderCreation from '../../components/05-NewPurchaseOrderComponents/NewPurchaseOrderCreation/NewPurchaseOrderCreation'
// import NewPurchaseOrderOverview from '../../components/05-NewPurchaseOrderComponents/NewPurchaseOrderOverview/NewPurchaseOrderOverview'
import { PackagePlus } from 'lucide-react'
// import NewPurchaseOrderGRN from '../../components/05-NewPurchaseOrderComponents/NewPurchaseOrderGRN/NewPurchaseOrderGRN'
// import NewPurchaseOrderCatalog from '../../components/05-NewPurchaseOrderComponents/NewPurchaseOrderCatalog/NewPurchaseOrderCatalog'
// import NewPurchaseOrderProductsAccept from '../../components/05-NewPurchaseOrderComponents/NewPurchaseOrderProductsAccept/NewPurchaseOrderProductsAccept'
import NewPurchaseOrderCatalog from '../../components/05-NewPurchaseOrderComponents/NewPurchaseOrderCatalog/NewPurchaseOrderCatalog'
import NewPurchaseOrderList from '../../components/05-NewPurchaseOrderComponents/NewPurchaseOrderList/NewPurchaseOrderList'

// Sidebar items config
const sidebarItems = [
  // {
  //   key: 'overview',
  //   label: 'Overview',
  //   icon: <Blocks size={20} className="sidebar-icon" />,
  //   component: <NewPurchaseOrderOverview />
  // },
  {
    key: 'createPurchaseOrder',
    label: 'Create PO',
    icon: <PackagePlus size={20} className="sidebar-icon" />,
    component: <NewPurchaseOrderCreation />
  },
  {
    key: 'purchaseOrderList',
    label: 'Purchase Order',
    icon: <PackagePlus size={20} className="sidebar-icon" />,
    component: <NewPurchaseOrderList />
  },
  // {
  //   key: 'goodsReceivedNotes',
  //   label: 'GRN',
  //   icon: <PackagePlus size={20} className="sidebar-icon" />,
  //   component: <NewPurchaseOrderGRN />
  // },
  {
    key: 'grnCatalog',
    label: 'Products',
    icon: <PackagePlus size={20} className="sidebar-icon" />,
    component: <NewPurchaseOrderCatalog />
  }
]

const PurchaseOrderManagement: React.FC = () => {
  const [activeKey, setActiveKey] = useState('createPurchaseOrder')

  return (
    <div>
      <div className="settingsContainer">
        <ComponentHeader
          title="Purchase Order"
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
    </div>
  )
}

export default PurchaseOrderManagement
