import { Barcode, Blocks, PackageCheck, PackagePlus, PackageX, ShoppingBag } from 'lucide-react'
import React, { useState } from 'react'
import PurchaseOrderOverview from '../../components/05-PurchaseOrderComponents/PurchaseOrderOverview/PurchaseOrderOverview'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import { Divider } from 'primereact/divider'
// import PurchaseOrderProductCreation from '../../components/05-PurchaseOrderComponents/PurchaseOrderProductCreation/PurchaseOrderProductCreation'
// import PurchaseOrderCreation from '../../components/05-PurchaseOrderComponents/PurchaseOrderCreation/PurchaseOrderCreation'
import AddNewPurchaseOrder from '../../components/05-PurchaseOrderComponents/PurchaseOrderCreation/AddNewPurchaseOrder/AddNewPurchaseOrder'
import PurchaseOrderList from '../../components/05-PurchaseOrderComponents/PurchaseOrderList/PurchaseOrderList'
import PurchaseOrderCatalog from '../../components/05-PurchaseOrderComponents/PurchaseOrderCatalog/PurchaseOrderCatalog'
import PurchaseOrderRejectedProducts from '../../components/05-PurchaseOrderComponents/PurchaseOrderRejectedProducts/PurchaseOrderRejectedProducts'
import BarcodeCreation from '../../components/05-PurchaseOrderComponents/BarcodeCreation/BarcodeCreation'

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
    component: <PurchaseOrderList />
  },
  {
    key: 'createPurchaseOrder',
    label: 'Create PO',
    icon: <PackagePlus size={20} className="sidebar-icon" />,
    component: <AddNewPurchaseOrder />
  },
  {
    key: 'acceptedProducts',
    label: 'Products',
    icon: <PackageCheck size={20} className="sidebar-icon" />,
    component: <PurchaseOrderCatalog />
  },
  {
    key: 'rejectedProducts',
    label: 'Rejected Products',
    icon: <PackageX size={20} className="sidebar-icon" />,
    component: <PurchaseOrderRejectedProducts />
  },
  {
    key: 'barcodeCreation',
    label: 'Barcode Creation',
    icon: <Barcode size={20} className="sidebar-icon" />,
    component: <BarcodeCreation />
  }
]

const PurchaseOrder: React.FC = () => {
  const [activeKey, setActiveKey] = useState('overview')

  return (
    <div className="settingsContainer">
      <ComponentHeader title="Purchase Order" subtitle="Overall Management" />

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
