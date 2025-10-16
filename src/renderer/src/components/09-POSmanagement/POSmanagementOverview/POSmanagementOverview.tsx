import React, { useState, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { Card } from 'primereact/card'

import { Toast } from 'primereact/toast'
import { DollarSign, Heart, Package, ShoppingCart } from 'lucide-react'

const POSmanagementOverview: React.FC = () => {
  const toast = useRef(null)

  // Mock data
  const [customers] = useState([
    {
      refCustomerId: 1,
      refCustomerName: 'Vijay',
      refMobileNo: '9876543210',
      refAddress: '123 Main St',
      refCity: 'Mumbai',
      refPincode: '400001',
      refState: 'Maharashtra',
      refCountry: 'India',
      refMembershipNumber: 'MEM001',
      refTaxNumber: 'GST123456789'
    },
    {
      refCustomerId: 2,
      refCustomerName: 'soniya',
      refMobileNo: '9876543211',
      refAddress: '456 Oak Ave',
      refCity: 'Delhi',
      refPincode: '110001',
      refState: 'Delhi',
      refCountry: 'India',
      refMembershipNumber: 'MEM002',
      refCustomerGroup: 'Regular',
      refTaxNumber: 'GST987654321'
    }
  ])

  const [soldProducts] = useState([
    {
      refSaleCode: 'SAL001',
      customerName: 'Soniya',
      employeeName: 'Thiru',
      refTotalPrice: 79999,
      refSaleDate: '2025-08-10',
      refPaymentMode: 'Cash',
      status: 'Completed'
    },
    {
      refSaleCode: 'SAL002',
      customerName: 'Vijay',
      employeeName: 'Thiru',
      refTotalPrice: 69999,
      refSaleDate: '2025-08-11',
      refPaymentMode: 'UPI',
      status: 'Completed'
    },
    {
      refSaleCode: 'SAL003',
      customerName: 'Rahul',
      employeeName: 'Thiru',
      refTotalPrice: 18999,
      refSaleDate: '2025-08-11',
      refPaymentMode: 'Card',
      status: 'Pending'
    }
  ])

  const [activeTab, setActiveTab] = useState(0)

  const priceBodyTemplate = (rowData) => {
    return rowData.refTotalPrice
  }

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.refSaleDate).toLocaleDateString()
  }

  return (
    <div className="sales-dashboard ">
      <Toast ref={toast} />
      <div className="dashboard-header">
        {/* Dashboard Stats */}
        <div className="stats-grid">
          <Card className="stat-card purple-card">
            <div className="stat-content">
              <div className="stat-icon purple-icon">
                <ShoppingCart size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-title">Products Sold</div>
                <div className="stat-value">4565</div>
                <div className="stat-period">Jan - March 2019</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card pink-card">
            <div className="stat-content">
              <div className="stat-icon pink-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-title">Net Profit</div>
                <div className="stat-value">$ 3541</div>
                <div className="stat-period">Jan - March 2019</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card orange-card">
            <div className="stat-content">
              <div className="stat-icon orange-icon">
                <Package size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-title">New Customers</div>
                <div className="stat-value">4565</div>
                <div className="stat-period">Jan - March 2019</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card blue-card">
            <div className="stat-content">
              <div className="stat-icon blue-icon">
                <Heart size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-title">Customer Satisfaction</div>
                <div className="stat-value">99%</div>
                <div className="stat-period">Jan - March 2019</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        {/* Sales Tab */}
        <TabPanel header="Recent Sales" leftIcon="">
          <div className="flex justify-between items-center ">
            <h2 className="text-xl font-semibold">Recent Sales</h2>
          </div>

          <DataTable value={soldProducts} paginator rows={10} className="p-datatable-customers">
            <Column field="refSaleCode" header="Sale Code" sortable />
            <Column field="customerName" header="Customer" sortable />
            <Column field="employeeName" header="Employee" sortable />
            <Column field="refTotalPrice" header="Total" body={priceBodyTemplate} sortable />
            <Column field="refSaleDate" header="Date" body={dateBodyTemplate} sortable />
            <Column field="refPaymentMode" header="Payment Mode" />
          </DataTable>
        </TabPanel>

        {/* Customers Tab */}
        <TabPanel header="Recent Customer " leftIcon="">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Customer </h2>
          </div>

          <DataTable value={customers} paginator rows={10} className="p-datatable-customers">
            <Column field="refCustomerName" header="Name" sortable />
            <Column field="refMobileNo" header="Mobile" sortable />
            <Column field="refCity" header="City" sortable />
            {/* <Column field="refCustomerGroup" header="Group" body={(rowData) => <Chip label={rowData.refCustomerGroup} />} /> */}
            <Column field="refMembershipNumber" header="Membership" sortable />
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  )
}

export default POSmanagementOverview
