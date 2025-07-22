import React, { JSX, useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { RadioButton } from 'primereact/radiobutton'
import { Check, X } from 'lucide-react'

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

interface GroupedProductRow extends Product {
  categoryName: string
  subCategoryName: string
  groupKey: string
  status: string
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

interface ViewProps {
  rowData: { productDetails: Product[]; totalSummary: any }
}

const ViewPurchaseOrderProducts: React.FC<ViewProps> = ({ rowData }) => {
  const [rows, setRows] = useState<GroupedProductRow[]>([])
  const [rejectionDialog, setRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('Mismatch')
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!rowData?.productDetails?.length) return

    const transformed: GroupedProductRow[] = []

    rowData.productDetails.forEach((p) => {
      const quantity = parseInt(p.purchaseQuantity || '0')
      for (let i = 0; i < quantity; i++) {
        transformed.push({
          ...p,
          categoryName: categoryMap[p.refCategoryid] || 'Unknown Category',
          subCategoryName: subCategoryMap[p.refSubCategoryId] || 'Unknown Subcategory',
          groupKey: `${categoryMap[p.refCategoryid] || 'Unknown'} - ${subCategoryMap[p.refSubCategoryId] || 'Unknown'}`,
          status: 'Pending'
        })
      }
    })

    setRows(transformed)
  }, [JSON.stringify(rowData?.productDetails)])

  const handleAccept = (index: number) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, status: 'Accepted' } : row)))
  }

  const handleReject = (index: number) => {
    setActiveRowIndex(index)
    setRejectionDialog(true)
  }

  const confirmRejection = () => {
    if (activeRowIndex !== null) {
      setRows((prev) =>
        prev.map((row, i) =>
          i === activeRowIndex ? { ...row, status: `Rejected - ${rejectionReason}` } : row
        )
      )
    }
    setRejectionDialog(false)
    setActiveRowIndex(null)
  }

  const actionBodyTemplate = (_: any, options: any) => {
    const rowData = rows[options.rowIndex]
    return rowData.status === 'Pending' ? (
      <div className="flex gap-2">
        <Button
          icon={<Check />}
          className="p-button-success"
          onClick={() => handleAccept(options.rowIndex)}
        />
        <Button
          icon={<X />}
          className="p-button-danger"
          onClick={() => handleReject(options.rowIndex)}
        />
      </div>
    ) : (
      <span
        className={`font-semibold ${rowData.status.includes('Rejected') ? 'text-red-500' : 'text-green-600'}`}
      >
        {rowData.status}
      </span>
    )
  }

  const summaryHeader = () => {
    const totalQuantity = rowData.productDetails.reduce(
      (sum, p) => sum + parseInt(p.purchaseQuantity),
      0
    )
    const { totalAmount, taxedAmount, payAmount } = rowData.totalSummary

    return (
      <div className="p-4 border-round bg-gray-100 mb-3">
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

  // Group by key and render each group with header + rows
  const renderGroupedTable = () => {
    const grouped: Record<string, GroupedProductRow[]> = {}
    rows.forEach((row) => {
      if (!grouped[row.groupKey]) grouped[row.groupKey] = []
      grouped[row.groupKey].push(row)
    })

    const output: JSX.Element[] = []
    let serial = 1

    Object.entries(grouped).forEach(([group, groupRows], groupIndex) => {
      output.push(
        <div key={groupIndex} className="mb-4">
          <div className="bg-blue-50 text-blue-900 font-semibold px-3 py-2 border-round-top">
            {group}
          </div>
          <DataTable value={groupRows} scrollable showGridlines className="border-x border-b">
            <Column header="S.No" body={() => serial++} style={{ width: '80px' }} />
            <Column header="Product Name" field="productName" />
            <Column header="HSN Code" field="HSNCode" />
            <Column header="Price" field="purchasePrice" />
            <Column header="Discount" field="discountAmount" />
            <Column header="Total" field="totalAmount" />
            <Column
              header="Status / Action"
              body={actionBodyTemplate}
              style={{ minWidth: '180px' }}
            />
          </DataTable>
        </div>
      )
    })

    return output
  }

  return (
    <div className="card">
      {summaryHeader()}

      {renderGroupedTable()}

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
            <Button label="Confirm" onClick={confirmRejection} autoFocus />
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
