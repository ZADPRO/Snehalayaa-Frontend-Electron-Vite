import Login from '../pages/01-Login/Login'
import React from 'react'

import { Route, Routes } from 'react-router-dom'
import ForgotPassword from '../pages/01-Login/ForgotPassword'
import Dashboard from '../pages/02-Dashboard/Dashboard'
import Settings from '../pages/03-Settings/Settings'
import Header from '../components/00-Header/Header'
import PurchaseOrder from '../pages/05-PurchaseOrder/PurchaseOrder'
import Inventory from '../pages/06-Inventory/Inventory'
import Profile from '../pages/04-Profile/Profile'
import POSmanagement from '../pages/07-POSmanagement/POSmanagement'
import Reports from '../pages/10-Reports/Reports'
import ReportsStockSummary from '../components/10-Reports/04-ReportsInventory/ReportsStockSummary/ReportsStockSummary'
import ReportsStockLedger from '../components/10-Reports/04-ReportsInventory/ReportsStockLedger/ReportsStockLedger'
import ReportsCashRegister from '../components/10-Reports/06-ReportsPOS/ReportsCashRegister/ReportsCashRegister'
import ReportsCurrentCash from '../components/10-Reports/06-ReportsPOS/ReportsCurrentCash/ReportsCurrentCash'
import ReportsStockValudationSummary from '../components/10-Reports/04-ReportsInventory/ReportsStockValudationSummary'
import StockAgeing from '../components/10-Reports/04-ReportsInventory/StockAgeing'
import ReportsSupplier from '../components/10-Reports/03-ReportsSupplier/ReportsSupplier/ReportsSupplier'
import ReportsSupplierPurchase from '../components/10-Reports/03-ReportsSupplier/ReportsSupplierPurchase/ReportsSupplierPurchase'
import ReportsSupplierDetails from '../components/10-Reports/03-ReportsSupplier/ReportsSupplierDetails/ReportsSupplierDetails'

const MainAppRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="*"
          element={
            <Header>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/pomgmt" element={<PurchaseOrder />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pos" element={<POSmanagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/inventoryReports/stockSummary" element={<ReportsStockSummary />} />
                <Route
                  path="/inventoryReports/stockValuation"
                  element={<ReportsStockValudationSummary />}
                />
                <Route path="/inventoryReports/stockAgeing" element={<StockAgeing />} />

                <Route path="/inventoryReports/stockLedger" element={<ReportsStockLedger />} />

                <Route path="/supplier/supplierReports" element={<ReportsSupplier />} />
                <Route path="/supplier/purchaseReports" element={<ReportsSupplierPurchase />} />
                <Route path="/supplier/supplierDetails" element={<ReportsSupplierDetails />} />

                <Route path="/posReports/cashRegister" element={<ReportsCashRegister />} />
                <Route path="/posReports/currentCash" element={<ReportsCurrentCash />} />
              </Routes>
            </Header>
          }
        />
      </Routes>
    </div>
  )
}

export default MainAppRoutes
