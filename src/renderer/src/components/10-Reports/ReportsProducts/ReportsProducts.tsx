import { FileSignature, FileSpreadsheet, FileText, Search } from 'lucide-react'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { DataTableStateEvent } from 'primereact/datatable'

import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { Nullable } from 'primereact/ts-helpers'
import { Toast } from 'primereact/toast'
import { FilterOptions, PurchaseOrder, Supplier } from './ReportsProducts.interface'
import { fetchInvoice, fetchSupplier, filterOptions } from './ReportsProducts.function'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear())
  return `${day}-${month}-${year}`
}

const ReportsProducts: React.FC = () => {
  const [fromdate, setFromDate] = useState<Nullable<Date>>(null)
  const [todate, setToDate] = useState<Nullable<Date>>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const [products, setProducts] = useState<any[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])

  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState<number | null>(null)

  const [exportLoading, _setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false
  })
  const toast = useRef<Toast>(null)

  const [formData, setFormData] = useState<FilterOptions>({
    fromDate: '',
    toDate: '',
    searchField: '',
    purchaseOrderId: 0,
    supplierId: 0,
    paginationOffset: '1',
    paginationLimit: '10'
  })

  // 🔹 Update formData when dates change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fromDate: formatDate(fromdate),
      toDate: formatDate(todate)
    }))
  }, [fromdate, todate])

  // 🔹 Update formData when supplier changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      supplierId: selectedSupplier ? selectedSupplier.supplierId : 0
    }))
  }, [selectedSupplier])

  const handleSearchChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      searchField: value
    }))
  }

  const handlePageChange = (event: DataTableStateEvent) => {
    const updatedForm = {
      ...formData,
      paginationOffset: String(event.page! + 1), // backend expects 1-based
      paginationLimit: String(event.rows)
    }
    setFormData(updatedForm)
  }

  const handleFetchFilteredData = async () => {
    try {
      setLoading(true)
      const response = await filterOptions(formData)
      const { data } = response

      setProducts(data.data) // current page data
      setTotalRecords(data.totalCount) // total count = 26
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to fetch data',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const load = async () => {
    try {
      const data = await fetchSupplier()
      setSuppliers(data)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load Suppliers',
        life: 3000
      })
    }
  }

  useEffect(() => {
    load()
  }, [])

  const Invoice = async () => {
    try {
      const data = await fetchInvoice()
      setPurchaseOrders(data)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load Invoice',
        life: 3000
      })
    }
  }

  useEffect(() => {
    Invoice()
  }, [])

  useEffect(() => {
    handleFetchFilteredData()
  }, [formData])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      purchaseOrderId: selectedPurchaseOrderId || 0
    }))
  }, [selectedPurchaseOrderId])

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<FileText size={16} strokeWidth={2} />}
        severity="secondary"
        tooltip="Export as CSV"
        tooltipOptions={{ position: 'left' }}
        loading={exportLoading.csv}
        disabled={exportLoading.csv}
      />
      <Button
        icon={<FileSpreadsheet size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Export as Excel"
        tooltipOptions={{ position: 'left' }}
        onClick={() => console.log('Payload:', formData)}
        loading={exportLoading.excel}
        disabled={exportLoading.excel}
      />
      <Button
        icon={<FileSignature size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Export as PDF"
        tooltipOptions={{ position: 'left' }}
        onClick={() => console.log('Payload:', formData)}
        loading={exportLoading.pdf}
        disabled={exportLoading.pdf}
      />
    </div>
  )

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <InputText
        placeholder="Search"
        className="searchinput"
        value={formData.searchField}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Button
        icon={<Search size={16} strokeWidth={2} />}
        // severity="success"
        tooltip="Search"
        tooltipOptions={{ position: 'left' }}
        // value={formData}
        onClick={handleFetchFilteredData}
      />
    </div>
  )

  const flattenedPOs = purchaseOrders.map((po) => ({
    ...po,
    poNumber: po.totalSummary?.poNumber // bring poNumber to top-level
  }))

  return (
    <div>
      <div className="flex gap-3 mb-3">
        <Calendar
          value={fromdate}
          onChange={(e) => setFromDate(e.value)}
          dateFormat="dd/mm/yyyy"
          placeholder="Select From Date "
        />
        <Calendar
          value={todate}
          onChange={(e) => setToDate(e.value)}
          dateFormat="dd/mm/yyyy"
          placeholder="Select To Date "
        />
        <Dropdown
          id="supplierName"
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.value)}
          options={suppliers}
          optionLabel="supplierName"
          placeholder="Select Suppliers"
        />

        <Dropdown
          id="poOrderList"
          value={selectedPurchaseOrderId}
          onChange={(e) => setSelectedPurchaseOrderId(e.value)}
          options={flattenedPOs}
          optionLabel="poNumber" // label shown in dropdown
          optionValue="purchaseOrderId" // value stored in state
          placeholder="Select Invoice"
        />
      </div>

      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        value={products}
        lazy
        paginator
        totalRecords={totalRecords}
        rows={+formData.paginationLimit}
        first={(+formData.paginationOffset - 1) * +formData.paginationLimit}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 20]} // 👈 user can change
        loading={loading}
        stripedRows
        showGridlines
        responsiveLayout="scroll"
      >
        <Column
          header="SNo"
          body={(_, opts) =>
            opts.rowIndex + 1 + (+formData.paginationOffset - 1) * +formData.paginationLimit
          }
        />
        <Column field="productName" header="Product" sortable />
        <Column field="HSNCode" header="HSN Code" />
        <Column field="price" header="Price" />
        <Column field="discountPercentage" header="Discount %" />
        <Column field="acceptanceStatus" header="Status" />
        <Column field="createdBy" header="Created By" />
        <Column field="createdAt" header="Created At" />
      </DataTable>
    </div>
  )
}

export default ReportsProducts
