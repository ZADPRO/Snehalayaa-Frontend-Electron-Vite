import React, { useEffect, useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
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

    // Branch filter
    if (selectedBranch) {
      filtered = filtered.filter(
        (po) => po.branch_name?.toLowerCase() === selectedBranch.refBranchName?.toLowerCase()
      )
    }

    // Supplier filter
    if (selectedSupplier) {
      filtered = filtered.filter(
        (po) =>
          po.supplier_name?.toLowerCase() === selectedSupplier.supplierCompanyName?.toLowerCase()
      )
    }

    // Date range filter
    if (fromDate && toDate) {
      filtered = filtered.filter((po) => {
        const poDate = new Date(po.created_at)
        return poDate >= fromDate && poDate <= toDate
      })
    }

    // Global search
    if (globalSearch.trim() !== '') {
      const searchText = globalSearch.toLowerCase()
      filtered = filtered.filter((po) =>
        Object.values(po).some((val) => String(val).toLowerCase().includes(searchText))
      )
    }

    setFilteredOrders(filtered)
  }, [selectedBranch, selectedSupplier, fromDate, toDate, globalSearch, purchaseOrders])

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
      <DataTable
        value={filteredOrders}
        showGridlines
        scrollable
        className="mt-4"
        paginator
        rows={10}
        emptyMessage="No Purchase Orders Found"
      >
        <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '70px' }} />
        <Column field="purchase_order_number" header="Purchase Order No" sortable />
        <Column field="total_ordered_quantity" header="No. of Products" sortable />
        <Column field="total_accepted_quantity" header="Accepted Qty" sortable />
        <Column field="total_rejected_quantity" header="Rejected Qty" sortable />
        <Column field="total_amount" header="Total Amount" sortable />
        <Column field="status" header="Status" sortable />
        <Column field="created_at" header="Created At" sortable />
        <Column field="supplier_name" header="Supplier Name" sortable />
        <Column field="branch_name" header="Branch Name" sortable />
      </DataTable>
    </div>
  )
}

export default NewPurchaseOrderList
