import React, { useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Download } from 'lucide-react'
import { formatINR } from '../../../../utils/helper'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import { createPOProducts } from './NewPOGRNSidebar.function'

interface NewPOGRNSidebarProps {
  purchaseOrder: any
}

const NewPOGRNSidebar: React.FC<NewPOGRNSidebarProps> = ({ purchaseOrder }) => {
  const toast = useRef<Toast>(null)

  const [products, setProducts] = useState<any[]>([])

  React.useEffect(() => {
    if (purchaseOrder?.products && products.length === 0) {
      setProducts(
        purchaseOrder.products.map((p: any) => ({
          ...p,
          received: 0,
          rejected: p.quantity,
          status: 'Pending',
          amount: 0 // ✅ add this
        }))
      )
    }
  }, [purchaseOrder])

  const handleReceivedChange = (value: number, index: number) => {
    setProducts((prev) => {
      const updated = [...prev]
      const receivedValue = Math.min(value, updated[index].quantity)
      const rejectedValue = updated[index].quantity - receivedValue

      updated[index] = {
        ...updated[index],
        received: receivedValue,
        rejected: rejectedValue,
        status: rejectedValue === 0 ? 'Accepted' : receivedValue === 0 ? 'Pending' : 'Partial',
        amount:
          receivedValue * (Number(updated[index].unitPrice) - Number(updated[index].discount || 0)) // ✅ calculate amount
      }

      return updated
    })
  }

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'success'
      case 'Partial':
        return 'warning'
      case 'Pending':
        return 'danger'
      default:
        return 'info'
    }
  }

  const totalOrderedQty = products.reduce((sum, p) => sum + Number(p.quantity), 0)
  const totalReceivedQty = products.reduce((sum, p) => sum + Number(p.received), 0)

  const downloadTemplate = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Download',
      detail: 'Template download clicked'
    })
  }

  const uploadTemplate = () => {
    toast.current?.show({ severity: 'info', summary: 'Upload', detail: 'Template upload clicked' })
  }

  return (
    <div className="">
      <Toast ref={toast} />
      <p className="font-bold uppercase underline">Purchase Order Details</p>

      {/* PO Summary */}
      <div className="mt-3 mb-3">
        <div className="flex gap-4">
          <p className="flex-1">
            <strong>Invoice Number:</strong> {purchaseOrder.invoiceNumber}
          </p>
          <p className="flex-1">
            <strong>Supplier:</strong> {purchaseOrder.supplier?.supplierCompanyName}
          </p>
          <p className="flex-1">
            <strong>Total Items:</strong> {purchaseOrder.products?.length}
          </p>
        </div>
        <div className="flex mt-2 gap-4">
          <p className="flex-1">
            <strong>Total Ordered Qty:</strong> {totalOrderedQty}
          </p>
          <p className="flex-1">
            <strong>Total Received Qty:</strong> {totalReceivedQty}
          </p>
          <p className="flex-1">
            <strong>Total Amount:</strong> {formatINR(Number(purchaseOrder.summary.totalAmount))}
          </p>
        </div>
      </div>

      {/* Template Buttons */}
      <div className="flex gap-2 mb-3 mt-3 justify-content-end">
        <Button
          label="Download Template"
          icon={<Download size={16} />}
          onClick={downloadTemplate}
          className="p-button-outlined gap-2"
        />
        <Button
          label="Upload Template"
          icon={<Download size={16} />}
          onClick={uploadTemplate}
          className="p-button-outlined gap-2"
        />
      </div>

      <Divider />

      <div className="flex justify-content-end mb-3">
        <Button
          label="Save PO"
          severity="success"
          outlined
          onClick={async () => {
            const productsPayload = products.map((p) => ({
              categoryId: p.categoryDetails.initialCategoryId,
              productName: p.description,
              orderedQty: Number(p.quantity),
              receivedQty: Number(p.received),
              rejectedQty: Number(p.rejected),
              unitPrice: p.unitPrice,
              discount: p.discount || 0, // include discount if needed
              totalPrice: Number(p.amount), // ✅ send received-based amount
              status: p.status
            }))

            const payload = {
              poInvoiceNumber: purchaseOrder.invoiceNumber,
              poId: purchaseOrder.purchaseOrderId,
              supplierId: purchaseOrder.supplier?.supplierId,
              supplier: purchaseOrder.supplier?.supplierCompanyName,
              branchId: purchaseOrder.branch?.refBranchId,
              totalAmount: purchaseOrder.summary.totalAmount,
              totalOrderedQty: products.reduce((sum, p) => sum + Number(p.quantity), 0),
              totalReceivedQty: products.reduce((sum, p) => sum + Number(p.received), 0),
              products: productsPayload
            }

            console.log('💾 Full Purchase Order Payload:', payload)

            try {
              const res = await createPOProducts(payload)
              toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'PO saved successfully'
              })
              console.log('Backend Response:', res)
            } catch (err) {
              toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save PO'
              })
            }
          }}
        />
      </div>

      {/* Product Table */}
      {products.length > 0 && (
        <DataTable value={products} showGridlines responsiveLayout="scroll" scrollable>
          <Column
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ width: '60px', textAlign: 'center' }}
          />
          <Column
            field="categoryDetails.initialCategoryName"
            header="Category"
            frozen
            style={{ minWidth: '10rem' }}
          />
          <Column field="description" header="Product Name" style={{ minWidth: '15rem' }} />
          <Column field="quantity" header="Ordered Qty" style={{ minWidth: '10rem' }} />
          <Column
            field="unitPrice"
            header="Unit Price"
            style={{ minWidth: '10rem' }}
            body={(rowData) => formatINR(rowData.unitPrice)}
          />
          <Column
            header="Total Price"
            body={(rowData) => formatINR(rowData.unitPrice * rowData.quantity)}
          />
          <Column
            header="Received Qty"
            body={(rowData, { rowIndex }) => (
              <InputNumber
                value={rowData.received}
                onValueChange={(e) => handleReceivedChange(e.value || 0, rowIndex)}
                min={0}
                max={rowData.quantity}
              />
            )}
          />
          <Column
            header="Rejected Qty"
            body={(rowData) => (
              <InputNumber value={rowData.rejected} disabled style={{ width: '100%' }} />
            )}
          />
          <Column
            header="Amount"
            body={(rowData) => formatINR(rowData.amount)}
            style={{ minWidth: '10rem', textAlign: 'right' }}
          />
          <Column
            header="Status"
            body={(rowData) => (
              <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} rounded />
            )}
          />{' '}
        </DataTable>
      )}
    </div>
  )
}

export default NewPOGRNSidebar
