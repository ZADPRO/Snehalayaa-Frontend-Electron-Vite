import React, { useRef, useState } from 'react'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputNumber } from 'primereact/inputnumber'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast'
import { formatINR } from '../../../../utils/helper'
import { savePurchaseOrderProducts } from './PurchaseOrderProductDetails.function'
import StepTwo from '../../NewPurchaseOrderCatalog/NewPOCatalogCreation/StepTwo/StepTwo'

interface PurchaseOrderProductDetailsProps {
  purchaseOrder: any
}

const PurchaseOrderProductDetails: React.FC<PurchaseOrderProductDetailsProps> = ({
  purchaseOrder
}) => {
  console.log('purchaseOrder', purchaseOrder)
  const toastRef = useRef<Toast>(null)
  const [loading, setLoading] = useState(false)

  const isAlreadySaved = purchaseOrder.products.some(
    (p: any) => Number(p.accepted_quantity) > 0 || Number(p.rejected_quantity) > 0
  )
  const canEdit = !isAlreadySaved
  // const isSaveDisabled = !canEdit

  // ✅ Initialize product data
  const [products, setProducts] = useState(() =>
    purchaseOrder.products.map((p: any) => {
      const quantity = Number(p.quantity) || 0
      const accepted = Number(p.accepted_quantity) || 0
      const rejected = Number(p.rejected_quantity) || 0
      const status =
        accepted === quantity ? 'Completed' : accepted > 0 ? 'Partially Received' : 'Pending'

      return {
        ...p,
        received: accepted,
        rejected: rejected > 0 ? rejected : Math.max(0, quantity - accepted),
        status
      }
    })
  )

  // ✅ Check if any data already exists (backend accepted or rejected quantities)
  const hasExistingData = products.some((p) => Number(p.received) > 0 || Number(p.rejected) < 0)
  console.log('hasExistingData', hasExistingData)

  const [activeStep, setActiveStep] = useState(hasExistingData ? 1 : 0)

  // ✅ Handle quantity edits
  const handleReceivedChange = (value: number, rowIndex: number) => {
    setProducts((prev) =>
      prev.map((item, i) => {
        if (i !== rowIndex) return item
        const received = value
        const rejected = Math.max(0, item.quantity - received)
        const status =
          received === item.quantity ? 'Completed' : received > 0 ? 'Partially Received' : 'Pending'
        return { ...item, received, rejected, status }
      })
    )
  }

  // Save PO handler
  const handleSavePO = async () => {
    const payload = products.map((p) => ({
      purchase_order_id: purchaseOrder.purchaseOrderId,
      purchase_order_number: purchaseOrder.purchaseOrderNumber,
      category_id: p.categoryDetails?.initialCategoryId || null,
      po_product_id: p.poProductId,
      accepted_quantity: String(p.received),
      rejected_quantity: String(p.rejected),
      status: p.status
    }))

    try {
      setLoading(true)
      const success = await savePurchaseOrderProducts(payload)
      setLoading(false)

      if (success) {
        toastRef.current?.show({
          severity: 'success',
          summary: 'Saved Successfully',
          detail: 'Purchase Order products updated successfully.'
        })
      }
    } catch (err: any) {
      setLoading(false)
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to save purchase order products.'
      })
    }
  }

  // ✅ Stepper navigation validation
  const handleNextStep = () => {
    const hasReceived = products.some((p) => Number(p.received) > 0)
    if (!hasReceived) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please enter at least one received quantity before proceeding to confirmation.'
      })
      return
    }
    setActiveStep(1)
  }

  // const totalReceived = products.reduce((sum, p) => sum + Number(p.received), 0)
  // const isSaveDisabled =
  //   totalReceived > 0 || totalReceived === purchaseOrder.totalOrderedQuantity || hasExistingData

  return (
    <div>
      <Toast ref={toastRef} />

      {/* Header summary */}
      <div className="mb-3">
        <div className="flex gap-4">
          <p className="flex-1">
            <strong>Invoice Number:</strong> {purchaseOrder.purchaseOrderNumber}
          </p>
          <p className="flex-1">
            <strong>Supplier:</strong> {purchaseOrder.supplierName}
          </p>
          <p className="flex-1">
            <strong>Total Items:</strong> {purchaseOrder.totalOrderedQuantity}
          </p>
        </div>
        <div className="flex mt-2 gap-4">
          <p className="flex-1">
            <strong>Total Ordered Qty:</strong> {purchaseOrder.totalOrderedQuantity}
          </p>
          <p className="flex-1">
            <strong>Total Received Qty:</strong>{' '}
            {products.reduce((sum, p) => sum + Number(p.received), 0)}
          </p>
          <p className="flex-1">
            <strong>Total Amount:</strong> {formatINR(Number(purchaseOrder.totalAmount))}
          </p>
        </div>
      </div>

      <Divider />

      {/* ✅ Stepper */}
      <Stepper activeStep={activeStep} onChange={(e: any) => setActiveStep(e.index)}>
        {/* STEP 1 — Product Receiving */}
        <StepperPanel header="Receive Products">
          <div className="flex justify-content-end mb-3 gap-2">
            {/* {!hasExistingData && ( */}
            <Button
              label="Save PO"
              severity="success"
              outlined
              onClick={handleSavePO}
              loading={loading}
              disabled={!canEdit}
            />
            {/* )} */}

            <Button label="Next → Confirmation" onClick={handleNextStep} severity="info" />
          </div>

          {/* Editable Table */}
          <DataTable value={products} showGridlines responsiveLayout="scroll" scrollable>
            <Column
              header="S.No"
              body={(_, { rowIndex }) => rowIndex + 1}
              style={{ width: '60px' }}
            />
            <Column field="categoryDetails.initialCategoryName" header="Category" />
            <Column field="description" header="Product Name" />
            <Column field="quantity" header="Ordered Qty" />
            <Column
              field="unitPrice"
              header="Unit Price"
              body={(rowData) => formatINR(Number(rowData.unitPrice))}
            />
            <Column
              header="Received Qty"
              body={(rowData, { rowIndex }) => (
                <InputNumber
                  value={rowData.received}
                  onValueChange={(e) => handleReceivedChange(e.value || 0, rowIndex)}
                  min={0}
                  max={rowData.quantity}
                  disabled={isAlreadySaved}
                />
              )}
            />
            <Column field="rejected" header="Rejected Qty" />
            <Column
              header="Amount"
              body={(rowData) => formatINR(Number(rowData.unitPrice) * Number(rowData.received))}
            />
          </DataTable>
        </StepperPanel>

        {/* STEP 2 — Confirmation */}
        <StepperPanel header="Confirmation">
          <div className="flex justify-content-between mb-3">
            <Button label="← Back" outlined severity="secondary" onClick={() => setActiveStep(0)} />
          </div>

          <StepTwo purchaseOrder={purchaseOrder} />
        </StepperPanel>
      </Stepper>
    </div>
  )
}

export default PurchaseOrderProductDetails
