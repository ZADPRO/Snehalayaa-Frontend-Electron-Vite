import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { RadioButton } from 'primereact/radiobutton'
import { Dropdown } from 'primereact/dropdown'
import { Check, X, Undo2, Plus } from 'lucide-react'
import {
  fetchDummyProductsByPOId,
  updateDummyProductStatus,
  bulkAcceptDummyProducts,
  bulkRejectDummyProducts,
  fetchSubCategories,
  fetchCategories,
  createPurchaseReturn
  // bulkUndoDummyProducts
} from './ViewPurchaseOrderProducts.function'
import { TabView, TabPanel } from 'primereact/tabview'

import {
  ViewPurchaseOrderProductsProps,
  TableRow,
  PurchaseReturnPayload
} from './ViewPurchaseOrderProducts.interface'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'

const ViewPurchaseOrderProducts: React.FC<ViewPurchaseOrderProductsProps> = ({ rowData }) => {
  console.log('rowData', rowData)
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({})
  const [subCategoryMap, setSubCategoryMap] = useState<Record<number, string>>({})

  const [activeTab, setActiveTab] = useState(0)

  const [rows, setRows] = useState<TableRow[]>([])
  const [selectedRows, setSelectedRows] = useState<TableRow[]>([])
  const [rejectionDialog, setRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState<'Mismatch' | 'Missing'>('Mismatch')
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)
  const toast = React.useRef<Toast>(null)

  const [isDropdownDataLoaded, setIsDropdownDataLoaded] = useState(false)

  const [filterCategory, setFilterCategory] = useState<number | null>(null)
  const [filterSubcategory, setFilterSubcategory] = useState<number | null>(null)

  const [returnDialog, setReturnDialog] = useState(false)
  const [returnRow, setReturnRow] = useState<any | null>(null)
  const [returned, setReturned] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(0)
  console.log('remaining', remaining)
  const [mismatchedCount, setMismatchedCount] = useState<number>(0)
  const [missedCount, setMissedCount] = useState<number>(0)
  // handle when user types returned qty
  const handleReturnedChange = (value: string, purchaseQuantity: number) => {
    const num = parseInt(value) || 0
    setReturned(num)
    setRemaining(Math.max(purchaseQuantity - num, 0)) // prevent negative
  }

  // Construct rows on mount/update
  useEffect(() => {
    const fetchDropdownData = async () => {
      const categories = await fetchCategories()
      const subCategories = await fetchSubCategories()

      const categoryMapData: Record<number, string> = {}
      categories.forEach((cat: any) => {
        categoryMapData[cat.refCategoryId] = cat.categoryName
      })

      const subCategoryMapData: Record<number, string> = {}
      subCategories.forEach((sub: any) => {
        subCategoryMapData[sub.refSubCategoryId] = sub.subCategoryName
      })

      setCategoryMap(categoryMapData)
      setSubCategoryMap(subCategoryMapData)
      setIsDropdownDataLoaded(true) // ✅ flag set
    }

    fetchDropdownData()
  }, [])

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
        dummyproductId: item.DummyProductsID,
        purchaseQuantity: '1',
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

    if (rowData.purchaseOrderId && isDropdownDataLoaded) {
      loadData()
    }
  }, [rowData.purchaseOrderId, isDropdownDataLoaded, categoryMap, subCategoryMap])

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

  const handleAccept = async (dummyProductId: number) => {
    try {
      await updateDummyProductStatus(dummyProductId, true)
      setRows((prev) =>
        prev.map((row) =>
          row.dummyproductId === dummyProductId ? { ...row, status: 'Accepted' } : row
        )
      )
    } catch (error) {
      console.error('Failed to accept product:', error)
    }
  }

  const confirmRejection = async () => {
    if (activeRowIndex !== null) {
      try {
        await updateDummyProductStatus(activeRowIndex, false, rejectionReason)
        setRows((prev) =>
          prev.map((row) =>
            row.id === activeRowIndex ? { ...row, status: `Rejected - ${rejectionReason}` } : row
          )
        )
      } catch (error) {
        console.error('Failed to reject product:', error)
      }
    }
    setActiveRowIndex(null)
    setRejectionDialog(false)
  }
  const undoAction = async (dummyProductId: number) => {
    try {
      await updateDummyProductStatus(dummyProductId, 'undo')
      setRows((prev) =>
        prev.map((row) =>
          row.dummyproductId === dummyProductId ? { ...row, status: 'Pending' } : row
        )
      )
    } catch (error) {
      console.error('Failed to undo product status:', error)
    }
  }

  const actionBodyTemplate = (_: any, options: any) => {
    console.log('options', options)
    const row = rows[options.rowIndex]
    console.log('row', row)

    if (row.status === 'Pending') {
      return (
        <div className="flex gap-4">
          <Button
            text
            style={{ padding: '0' }}
            onClick={() => handleAccept(row.dummyproductId)}
            severity="success"
          >
            Accept
          </Button>
          <Button
            text
            style={{ padding: '0' }}
            onClick={() => openRejectionDialog(row.dummyproductId)}
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

  const openRejectionDialog = (id: number) => {
    setActiveRowIndex(id)
    setRejectionDialog(true)
  }

  // Bulk Actions
  const handleBulkAction = async (type: 'Accept' | 'Reject') => {
    if (!selectedRows.length) return

    const dummyProductIds = selectedRows.map((row) => row.dummyproductId)

    try {
      if (type === 'Accept') {
        await bulkAcceptDummyProducts(dummyProductIds)
        setRows((prev) =>
          prev.map((row) =>
            dummyProductIds.includes(row.dummyproductId) ? { ...row, status: 'Accepted' } : row
          )
        )
      } else {
        await bulkRejectDummyProducts(dummyProductIds, rejectionReason)
        setRows((prev) =>
          prev.map((row) =>
            dummyProductIds.includes(row.dummyproductId)
              ? { ...row, status: `Rejected - ${rejectionReason}` }
              : row
          )
        )
      }
      setSelectedRows([])
    } catch (error) {
      console.error('Bulk action failed', error)
    }
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
    console.log('row', row)
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

  const handleSubmit = async () => {
    const payload: PurchaseReturnPayload = {
      refCategoryId: rowData.productDetails[0].refCategoryid,
      refsubCategoryId: rowData.productDetails[0].refSubCategoryId,
      remaining: remaining,
      returned: returned,
      itemMisMatchedCount: mismatchedCount,
      itemMissedCount: missedCount
    }

    try {
      const res = await createPurchaseReturn(payload)
      console.log('Purchase return created successfully:', res)
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Purchase return created successfully'
      })
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to create purchase return'
      })
    }
  }
  return (
    <div className="card">
      {summaryHeader()}
      <Toast ref={toast} />

      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        <TabPanel header="Return Products">
          <div className="flex gap-2 align-items-center justify-content-end">
            <div className="flex justify-content-between align-items-center mb-1">
              <div className="flex gap-2">
                <Button
                  label="Confirm"
                  icon={<Check size={18} />}
                  onClick={handleSubmit}
                  // loading={isSubmitting}
                  // disabled={isSubmitting}

                  className="p-button-sm p-button-success"
                />
              </div>
            </div>
          </div>
          <div className="flex mt-3 justify-content-between gap-6 mb-5 align-items-center ">
            <div className="flex-1">
              {/* <strong> Category Name:</strong>{' '} */}
              {categoryMap[rowData.productDetails[0].refCategoryid]}
            </div>
            <div className="flex-1">
              {/* <strong>Sub Category Name:</strong>{' '} */}
              {subCategoryMap[rowData.productDetails[0].refSubCategoryId]}
            </div>

            <div className="flex-1">
              <strong> Quantity:</strong> {rowData.productDetails[0].purchaseQuantity}
            </div>
          </div>

          <div className="flex mt-3 gap-3 align-items-center  justify-content-between ">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="Returned"
                  className="w-full"
                  value={String(returned)}
                  onChange={(e) =>
                    handleReturnedChange(
                      e.target.value,
                      parseInt(rowData.productDetails[0].purchaseQuantity)
                    )
                  }
                />
                <label htmlFor="Returned">Returned</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputNumber id="Remaining" className="w-full" value={remaining} disabled />
                <label htmlFor="Remaining">Remaining</label>
              </FloatLabel>
            </div>

            <div className="flex-1">
              <Button
                icon={<Plus size={18} />}
                onClick={() => {
                  setReturnRow(rowData)
                  setReturnDialog(true)
                }}
                disabled={returned <= 0}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Products">
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
            rowsPerPageOptions={[10, 20, 50]}
            scrollable
            showGridlines
          >
            <Column selectionMode="multiple" />
            <Column header="S.No" body={serialBodyTemplate} />
            <Column header="Category" field="categoryName" />
            <Column header="Subcategory" field="subCategoryName" />
            <Column header="HSN Code" field="HSNCode" style={{ minWidth: '100px' }} />
            <Column header="Price" field="purchasePrice" />
            <Column header="Status" body={statusColumn} />
            <Column header="Action" body={actionBodyTemplate} />
          </DataTable>
        </TabPanel>
      </TabView>
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

      <Dialog
        header="Return Details"
        visible={returnDialog}
        onHide={() => setReturnDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              style={{ backgroundColor: 'gray', borderColor: 'gray' }}
              onClick={() => setReturnDialog(false)}
            />
            <Button
              label="Confirm"
              onClick={() => {
                if (mismatchedCount + missedCount !== returned) {
                  toast.current?.show({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: `Total must equal ${returned}`
                  })
                  return
                }

                console.log('Confirmed Return:', {
                  category: returnRow?.categoryName,
                  subCategory: returnRow?.subCategoryName,
                  returned,
                  remaining,
                  mismatchedCount,
                  missedCount
                })
                setReturnDialog(false)
              }}
            />
          </div>
        }
      >
        <p>
          You are returning <strong>{returned}</strong> of <strong>{returnRow?.productName}</strong>
          . Remaining: <strong>{remaining}</strong>
        </p>

        {/* Item Mismatched Count */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <strong>Item Mismatched Count:</strong>
          </div>
          <div className="flex-1">
            <InputNumber
              value={mismatchedCount}
              onValueChange={(e) => setMismatchedCount(e.value || 0)}
              inputClassName="square-input"
            />
          </div>
        </div>

        {/* Item Missed Count */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <strong>Item Missed Count:</strong>
          </div>
          <div className="flex-1">
            <InputNumber
              value={missedCount}
              onValueChange={(e) => setMissedCount(e.value || 0)}
              inputClassName="square-input"
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ViewPurchaseOrderProducts
