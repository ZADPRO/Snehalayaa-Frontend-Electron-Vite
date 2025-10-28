import React, { useRef, useState } from 'react'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputNumber } from 'primereact/inputnumber'
import { Tag } from 'primereact/tag'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast'
import { formatINR } from '../../../../utils/helper'

interface Product {
  poProductId: number
  description: string
  quantity: number
  unitPrice: number
  categoryDetails: {
    initialCategoryName: string
  }
}

interface PurchaseOrderProductDetailsProps {
  purchaseOrder: any
}

const PurchaseOrderProductDetails: React.FC<PurchaseOrderProductDetailsProps> = ({
  purchaseOrder
}) => {
  const toast = useRef<Toast>(null)
  console.log('purchaseOrder', purchaseOrder)
  const [products, setProducts] = useState(
    purchaseOrder.products.map((p: any) => ({
      ...p,
      received: 0,
      rejected: 0,
      status: 'Pending'
    }))
  )

  const [receivedBatches, setReceivedBatches] = useState<any[]>([]) // store history
  const [activeStep, setActiveStep] = useState(0)
  const toastRef = React.useRef<Toast>(null)

  const handleReceivedChange = (value: number, rowIndex: number) => {
    setProducts((prev) => {
      const updated = [...prev]
      updated[rowIndex].received = value
      updated[rowIndex].rejected = updated[rowIndex].quantity - value
      updated[rowIndex].status =
        value === updated[rowIndex].quantity ? 'Completed' : 'Partially Received'
      return updated
    })
  }

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'Partially Received':
        return 'info'
      default:
        return 'warning'
    }
  }

  const handleSavePO = () => {
    const currentBatch = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      data: [...products]
    }

    console.log('✅ Received Batch:', currentBatch)
    toastRef.current?.show({
      severity: 'success',
      summary: 'Saved',
      detail: 'PO saved successfully!'
    })

    // Add new batch on top
    setReceivedBatches((prev) => [currentBatch, ...prev])

    // Move to next step after save
    setActiveStep(1)
  }

  return (
    <div className="">
      <Toast ref={toast} />
      <p className="font-bold uppercase underline">Purchase Order Details</p> {/* Summary */}{' '}
      <div className="mt-3 mb-3">
        {' '}
        <div className="flex gap-4">
          {' '}
          <p className="flex-1">
            {' '}
            <strong>Invoice Number:</strong> {purchaseOrder.purchaseOrderNumber}{' '}
          </p>{' '}
          <p className="flex-1">
            {' '}
            <strong>Supplier:</strong> {purchaseOrder.supplierName}{' '}
          </p>{' '}
          <p className="flex-1">
            {' '}
            <strong>Total Items:</strong> {purchaseOrder.totalOrderedQuantity}{' '}
          </p>{' '}
        </div>{' '}
        <div className="flex mt-2 gap-4">
          {' '}
          <p className="flex-1">
            {' '}
            <strong>Total Ordered Qty:</strong>{' '}
          </p>{' '}
          <p className="flex-1">
            {' '}
            <strong>Total Received Qty:</strong>{' '}
          </p>{' '}
          <p className="flex-1">
            {' '}
            <strong>Total Amount:</strong> {formatINR(Number(purchaseOrder.totalAmount))}{' '}
          </p>{' '}
        </div>{' '}
      </div>{' '}
      <Divider />
      <Stepper activeStep={activeStep} onStepChange={(e) => setActiveStep(e.index)}>
        {/* STEP 1 — Product Receiving */}
        <StepperPanel header="Receive Products">
          <div className="flex justify-content-end mb-3">
            <Button label="Save PO" severity="success" outlined onClick={handleSavePO} />
          </div>

          {/* Previously Saved Batches */}
          {receivedBatches.length > 0 && (
            <div className="mb-4">
              <p className="font-bold text-lg mb-2">Received Batches</p>
              {receivedBatches.map((batch, idx) => (
                <div key={batch.id} className="mb-4 surface-border">
                  <p className="font-semibold mb-2">
                    Batch {receivedBatches.length - idx} — {batch.timestamp}
                  </p>
                  <DataTable value={batch.data} showGridlines responsiveLayout="scroll" scrollable>
                    <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
                    <Column field="categoryDetails.initialCategoryName" header="Category" />
                    <Column field="description" header="Product" />
                    <Column field="quantity" header="Ordered Qty" />
                    <Column field="received" header="Received Qty" />
                    <Column field="rejected" header="Rejected Qty" />
                    <Column
                      header="Amount"
                      body={(rowData) => formatINR(rowData.unitPrice * rowData.received)}
                    />
                    <Column
                      header="Status"
                      body={(rowData) => (
                        <Tag
                          value={rowData.status}
                          severity={getStatusSeverity(rowData.status)}
                          rounded
                        />
                      )}
                    />
                  </DataTable>
                </div>
              ))}
              <Divider />
            </div>
          )}

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
              body={(rowData) => formatINR(rowData.unitPrice)}
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
            <Column field="rejected" header="Rejected Qty" />
            <Column
              header="Amount"
              body={(rowData) => formatINR(rowData.unitPrice * rowData.received)}
            />
            <Column
              header="Status"
              body={(rowData) => (
                <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} rounded />
              )}
            />
          </DataTable>
        </StepperPanel>

        {/* STEP 2 — Confirmation */}
        <StepperPanel header="Confirmation">
          <div className="text-center p-5">
            <h3>All product receipts recorded successfully ✅</h3>
            <p>You can review the batches above or finalize this purchase order.</p>
            <Button
              label="Back to Step 1"
              icon="pi pi-arrow-left"
              className="mt-3"
              onClick={() => setActiveStep(0)}
            />
          </div>
        </StepperPanel>
      </Stepper>
    </div>
  )
}

export default PurchaseOrderProductDetails
