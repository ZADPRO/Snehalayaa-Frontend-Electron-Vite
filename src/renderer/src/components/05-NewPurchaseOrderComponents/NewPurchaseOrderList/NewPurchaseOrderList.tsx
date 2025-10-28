import React, { useEffect, useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import {
  fetchBranches,
  fetchPurchaseOrderDetails,
  fetchSuppliers
} from '../NewPurchaseOrderCreation/NewPurchaseOrderCreation.function'
import {
  Branch,
  PurchaseOrderListResponse,
  Supplier
} from '../NewPurchaseOrderCreation/NewPurchaseOrderCreation.interface'
import PurchaseOrderProductDetails from './PurchaseOrderProductDetails/PurchaseOrderProductDetails'

const NewPurchaseOrderList: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderListResponse[]>([])
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrderListResponse[]>([])

  // Filters
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [globalSearch, setGlobalSearch] = useState('')

  // Sidebar
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderListResponse | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const [branchData, supplierData, purchaseOrderData] = await Promise.all([
        fetchBranches(),
        fetchSuppliers(),
        fetchPurchaseOrderDetails()
      ])
      setBranches(branchData)
      setSuppliers(supplierData)
      setPurchaseOrders(purchaseOrderData || [])
      setFilteredOrders(purchaseOrderData || [])
    }
    loadData()
  }, [])

  // 🧠 Filter Logic
  useEffect(() => {
    let filtered = [...purchaseOrders]

    if (selectedBranch) {
      filtered = filtered.filter(
        (po) => po.branchName?.toLowerCase() === selectedBranch.refBranchName?.toLowerCase()
      )
    }

    if (selectedSupplier) {
      filtered = filtered.filter(
        (po) =>
          po.supplierName?.toLowerCase() === selectedSupplier.supplierCompanyName?.toLowerCase()
      )
    }

    if (fromDate && toDate) {
      filtered = filtered.filter((po) => {
        const poDate = new Date(po.createdAt)
        return poDate >= fromDate && poDate <= toDate
      })
    }

    if (globalSearch.trim() !== '') {
      const searchText = globalSearch.toLowerCase()
      filtered = filtered.filter((po) =>
        Object.values(po).some((val) => String(val).toLowerCase().includes(searchText))
      )
    }

    setFilteredOrders(filtered)
  }, [selectedBranch, selectedSupplier, fromDate, toDate, globalSearch, purchaseOrders])

  // 👇 Column template for clickable PO number
  const purchaseOrderTemplate = (rowData: PurchaseOrderListResponse) => (
    <span
      onClick={() => {
        setSelectedPO(rowData)
        setSidebarVisible(true)
      }}
      className="text-primary cursor-pointer hover:underline"
    >
      {rowData.purchaseOrderNumber}
    </span>
  )

  return (
    <div>
      <p className="font-bold text-lg mb-3">Purchase Orders</p>

      {/* 🔍 Filters Section */}
      <div className="flex justify-content-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-3">
          <Dropdown
            placeholder="Select Branch"
            options={branches}
            optionLabel="refBranchName"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.value)}
            className="w-15rem"
            showClear
          />
          <Dropdown
            placeholder="Select Supplier"
            options={suppliers}
            optionLabel="supplierCompanyName"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.value)}
            className="w-15rem"
            showClear
          />
          <Calendar
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.value as Date)}
            className="w-13rem"
            showIcon
          />
          <Calendar
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.value as Date)}
            className="w-13rem"
            showIcon
          />
        </div>
        <div className="flex align-items-center">
          <InputText
            placeholder="Global Search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-15rem"
          />
        </div>
      </div>

      {/* 📋 Data Table */}
      <DataTable value={filteredOrders} showGridlines scrollable paginator rows={10}>
        <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '70px' }} />
        <Column
          field="purchaseOrderNumber"
          header="Purchase Order No"
          body={purchaseOrderTemplate}
          sortable
        />
        <Column field="totalOrderedQuantity" header="No. of Products" sortable />
        <Column field="totalAcceptedQuantity" header="Accepted Qty" sortable />
        <Column field="totalRejectedQuantity" header="Rejected Qty" sortable />
        <Column field="totalAmount" header="Total Amount" sortable />
        <Column field="status" header="Status" sortable />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="supplierName" header="Supplier Name" sortable />
        <Column field="branchName" header="Branch Name" sortable />
      </DataTable>

      {/* 📦 Sidebar for PO Details */}
      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        className=""
        header="Purchase Order - GRN"
        style={{ width: '80vw' }}
      >
        {selectedPO && <PurchaseOrderProductDetails purchaseOrder={selectedPO} />}
      </Sidebar>
    </div>
  )
}

export default NewPurchaseOrderList
