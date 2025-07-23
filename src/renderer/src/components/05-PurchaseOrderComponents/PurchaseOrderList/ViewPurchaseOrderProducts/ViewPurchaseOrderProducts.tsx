import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { RadioButton } from 'primereact/radiobutton'
import { Dropdown } from 'primereact/dropdown'
import { Check, X, Undo2 } from 'lucide-react'
import { fetchDummyProductsByPOId } from './ViewPurchaseOrderProducts.function'

interface Product {
  productName: string
  refCategoryid: number
  refSubCategoryId: number
  HSNCode: string
  purchaseQuantity: string
  purchasePrice: string
  discountAmount: string
  totalAmount: string
  isReceived: boolean
  acceptanceStatus: string
}

interface SupplierDetails {
  supplierId: number
  supplierName: string
  supplierCompanyName: string
  supplierGSTNumber: string
  supplierAddress: string
  supplierPaymentTerms: string
  supplierEmail: string
  supplierContactNumber: string
}

interface BranchDetails {
  branchId: number
  branchName: string
  branchEmail: string
  branchAddress: string
}

interface ProductDetails {
  productName: string
  refCategoryid: number
  refSubCategoryId: number
  HSNCode: string
  purchaseQuantity: string
  purchasePrice: string
  discountPrice: string
  discountAmount: string
  totalAmount: string
  isReceived: boolean
  acceptanceStatus: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
}

interface TotalSummary {
  poNumber: string
  supplierId: number
  branchId: number
  status: number
  expectedDate: string
  modeOfTransport: string
  subTotal: string
  discountOverall: string
  payAmount: string
  isTaxApplied: boolean
  taxPercentage: string
  taxedAmount: string
  totalAmount: string
  totalPaid: string
  paymentPending: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
}

interface PurchaseOrder {
  supplierDetails: SupplierDetails
  branchDetails: BranchDetails
  productDetails: ProductDetails[]
  totalSummary: TotalSummary
  purchaseOrderId: number
}

interface TableRow extends Product {
  id: number
  status: 'Pending' | 'Accepted' | 'Rejected - Mismatch' | 'Rejected - Missing'
  categoryName: string
  subCategoryName: string
}

const categoryMap: Record<number, string> = {
  24: 'Sarees',
  25: 'Designer Wear'
}

const subCategoryMap: Record<number, string> = {
  1: 'Cotton',
  4: 'Silk',
  5: 'Banarasi'
}

const ViewPurchaseOrderProducts: React.FC<PurchaseOrder> = ({ rowData }) => {
  console.log('rowData', rowData)
  const [rows, setRows] = useState<TableRow[]>([])
  const [selectedRows, setSelectedRows] = useState<TableRow[]>([])
  const [rejectionDialog, setRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState<'Mismatch' | 'Missing'>('Mismatch')
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)

  const [filterCategory, setFilterCategory] = useState<number | null>(null)
  const [filterSubcategory, setFilterSubcategory] = useState<number | null>(null)

  // Construct rows on mount/update
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDummyProductsByPOId(rowData.purchaseOrderId)

      let idCounter = 1
      const rows: TableRow[] = data.map((item: any) => ({
        id: idCounter++,
        productName: item.ProductName,
        refCategoryid: item.RefCategoryID,
        refSubCategoryId: item.RefSubCategoryID,
        HSNCode: item.HSNCode,
        purchaseQuantity: '1', // Single dummy item
        purchasePrice: item.Price,
        discountAmount: item.DiscountAmount,
        totalAmount: item.Price,
        isReceived: item.IsReceived === 'true',
        acceptanceStatus: item.AcceptanceStatus,
        status: item.IsReceived === 'true' ? 'Accepted' : item.AcceptanceStatus || 'Pending',
        categoryName: categoryMap[item.RefCategoryID] || 'Unknown',
        subCategoryName: subCategoryMap[item.RefSubCategoryID] || 'Unknown'
      }))

      setRows(rows)
    }

    if (rowData.purchaseOrderId) {
      loadData()
    }
  }, [rowData.purchaseOrderId])

  // Serial Number Column
  const serialBodyTemplate = (_rowData: TableRow, options: any) => options.rowIndex + 1

  // Status Display
  const statusColumn = (row: TableRow) => {
    return (
      <span
        className={`font-semibold ${
          row.status.includes('Rejected')
            ? 'text-red-500'
            : row.status === 'Accepted'
              ? 'text-green-600'
              : 'text-gray-500'
        }`}
      >
        {row.status}
      </span>
    )
  }

  const actionBodyTemplate = (_: any, options: any) => {
    const row = rows[options.rowIndex]

    if (row.status === 'Pending') {
      return (
        <div className="flex gap-4">
          {/* <Button
            icon={<Check />}
            className="p-button-success"
            onClick={() => handleAccept(row.id)}
          />
          <Button
            icon={<X />}
            className="p-button-danger"
            onClick={() => openRejectionDialog(row.id)}
          /> */}
          <Button
            text
            style={{ padding: '0' }}
            onClick={() => handleAccept(row.id)}
            severity="success"
          >
            Accept
          </Button>
          <Button
            text
            style={{ padding: '0' }}
            onClick={() => openRejectionDialog(row.id)}
            severity="danger"
          >
            Reject
          </Button>
        </div>
      )
    } else {
      return (
        <Button
          icon={<Undo2 size={16} />}
          tooltip="Undo"
          tooltipOptions={{ position: 'bottom' }}
          style={{ padding: '0px' }}
          className="p-button-secondary"
          onClick={() => undoAction(row.id)}
        />
      )
    }
  }

  const handleAccept = (id: number) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status: 'Accepted' } : row)))
  }

  const openRejectionDialog = (id: number) => {
    setActiveRowIndex(id)
    setRejectionDialog(true)
  }

  const confirmRejection = () => {
    if (activeRowIndex) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === activeRowIndex ? { ...row, status: `Rejected - ${rejectionReason}` } : row
        )
      )
    }
    setActiveRowIndex(null)
    setRejectionDialog(false)
  }

  const undoAction = (id: number) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status: 'Pending' } : row)))
  }

  // Bulk Actions
  const handleBulkAction = (type: 'Accept' | 'Reject') => {
    if (!selectedRows.length) return
    setRows((prev) =>
      prev.map((row) =>
        selectedRows.some((sel) => sel.id === row.id)
          ? { ...row, status: type === 'Accept' ? 'Accepted' : `Rejected - ${rejectionReason}` }
          : row
      )
    )
    setSelectedRows([])
  }

  // Filters
  const filterDropdown = () => (
    <div className="flex gap-3 mb-1">
      <Dropdown
        value={filterCategory}
        options={Object.entries(categoryMap).map(([value, label]) => ({
          label,
          value: Number(value)
        }))}
        placeholder="Filter by Category"
        onChange={(e) => setFilterCategory(e.value)}
        showClear
      />
      <Dropdown
        value={filterSubcategory}
        options={Object.entries(subCategoryMap).map(([value, label]) => ({
          label,
          value: Number(value)
        }))}
        placeholder="Filter by Subcategory"
        onChange={(e) => setFilterSubcategory(e.value)}
        showClear
      />
    </div>
  )

  // Filtered rows
  const filteredRows = rows.filter((row) => {
    const categoryMatch = filterCategory === null || row.refCategoryid === filterCategory
    const subcategoryMatch =
      filterSubcategory === null || row.refSubCategoryId === filterSubcategory
    return categoryMatch && subcategoryMatch
  })

  const summaryHeader = () => {
    const totalQuantity = rowData.productDetails.reduce(
      (sum, p) => sum + parseInt(p.purchaseQuantity),
      0
    )
    const { totalAmount, taxedAmount, payAmount } = rowData.totalSummary

    return (
      <div className="py-4 border-round bg-gray-100">
        <div className="text-lg font-semibold mb-2">Order Summary</div>
        <div className="grid">
          <div className="col-3">
            <strong>Total Quantity:</strong> {totalQuantity}
          </div>
          <div className="col-3">
            <strong>Total Amount:</strong> ₹{totalAmount}
          </div>
          <div className="col-3">
            <strong>Tax:</strong> ₹{taxedAmount}
          </div>
          <div className="col-3">
            <strong>Payable:</strong> ₹{payAmount}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {summaryHeader()}
      <div className="flex gap-2 align-items-center justify-content-between">
        {filterDropdown()}

        <div className="flex justify-content-between align-items-center mb-1">
          <div className="flex gap-2">
            <Button
              label="Accept"
              icon={<Check size={18} />}
              disabled={!selectedRows.length}
              onClick={() => handleBulkAction('Accept')}
              className="p-button-sm p-button-success"
            />
            <Button
              label="Reject"
              icon={<X size={18} />}
              disabled={!selectedRows.length}
              onClick={() => setRejectionDialog(true)}
              className="p-button-sm p-button-danger"
            />
          </div>
        </div>
      </div>
      <div className="flex my-3 justify-content-end">
        <span className="text-sm text-gray-500">Selected Items: {selectedRows.length}</span>
      </div>

      <DataTable
        value={filteredRows}
        selectionMode="multiple"
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
        paginator
        rows={10}
        scrollable
        showGridlines
      >
        <Column selectionMode="multiple" />
        <Column header="S.No" body={serialBodyTemplate} />
        <Column header="Product Name" field="productName" style={{ minWidth: '200px' }} />
        <Column header="Category" field="categoryName" />
        <Column header="Subcategory" field="subCategoryName" />
        <Column header="HSN Code" field="HSNCode" style={{ minWidth: '100px' }} />
        <Column header="Price" field="purchasePrice" />
        <Column header="Status" body={statusColumn} />
        <Column header="Action" body={actionBodyTemplate} />
      </DataTable>

      <Dialog
        header="Rejection Reason"
        visible={rejectionDialog}
        onHide={() => setRejectionDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              onClick={() => setRejectionDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Confirm"
              onClick={() => {
                if (activeRowIndex) confirmRejection()
                else handleBulkAction('Reject')
              }}
              autoFocus
            />
          </div>
        }
      >
        <div className="flex flex-column gap-3">
          <div>
            <RadioButton
              inputId="mismatch"
              name="reason"
              value="Mismatch"
              onChange={(e) => setRejectionReason(e.value)}
              checked={rejectionReason === 'Mismatch'}
            />
            <label htmlFor="mismatch" className="ml-2">
              Item Mismatched
            </label>
          </div>
          <div>
            <RadioButton
              inputId="missing"
              name="reason"
              value="Missing"
              onChange={(e) => setRejectionReason(e.value)}
              checked={rejectionReason === 'Missing'}
            />
            <label htmlFor="missing" className="ml-2">
              Item Missed
            </label>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ViewPurchaseOrderProducts
