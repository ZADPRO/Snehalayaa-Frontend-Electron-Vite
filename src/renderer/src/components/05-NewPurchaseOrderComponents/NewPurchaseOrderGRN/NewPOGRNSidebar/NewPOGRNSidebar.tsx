import React, { useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { formatINR } from '../../../../utils/helper'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import { createPOProducts } from './NewPOGRNSidebar.function'
import { TabPanel, TabView } from 'primereact/tabview'
import StepTwo from '../../NewPurchaseOrderCatalog/NewPOCatalogCreation/StepTwo/StepTwo'
// import StepThree from '../../NewPurchaseOrderCatalog/NewPOCatalogCreation/StepThree/StepThree'

interface NewPOGRNSidebarProps {
  purchaseOrder: any
}

const NewPOGRNSidebar: React.FC<NewPOGRNSidebarProps> = ({ purchaseOrder }) => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<any[]>([])
  const [localPO, setLocalPO] = useState<any>(purchaseOrder)
  const [isSaved, setIsSaved] = useState(false)
  console.log('isSaved', isSaved)
  const [activeIndex, setActiveIndex] = useState(0)
  console.log('activeIndex', activeIndex)

  React.useEffect(() => {
    if (purchaseOrder?.products && products.length === 0) {
      setProducts(
        purchaseOrder.products.map((p: any) => ({
          ...p,
          received: 0,
          rejected: p.quantity,
          status: 'Pending',
          amount: 0
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
          receivedValue * (Number(updated[index].unitPrice) - Number(updated[index].discount || 0))
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

  const handleSavePO = async () => {
    const productsPayload = products.map((p, i) => ({
      po_product_id: i + 1,
      category_id: p.categoryDetails.initialCategoryId,
      product_description: p.description,
      unit_price: p.unitPrice,
      accepted_quantity: String(p.received),
      accepted_total: String(p.received),
      ordered_quantity: String(p.quantity),
      ordered_total: String(p.quantity * p.unitPrice),
      status: p.status,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_by: 'Super Admin'
    }))

    const payload = {
      poInvoiceNumber: purchaseOrder.purchaseOrderNumber,
      poId: purchaseOrder.purchaseOrderId,
      supplierId: purchaseOrder.supplier?.supplierId,
      supplier: purchaseOrder.supplier?.supplierCompanyName,
      branchId: purchaseOrder.branch?.refBranchId,
      totalAmount: purchaseOrder.summary.totalAmount,
      totalOrderedQty: totalOrderedQty,
      totalReceivedQty: totalReceivedQty,
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

      // ✅ Append accepted_products to purchaseOrder
      const updatedPO = {
        ...localPO,
        accepted_products: productsPayload
      }
      setLocalPO(updatedPO)
      setIsSaved(true)
      setActiveIndex(1) // ✅ Move to Step Two tab
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save PO'
      })
    }
  }

  return (
    <div>
      <Toast ref={toast} />
      <p className="font-bold uppercase underline">Purchase Order Details</p>

      {/* Summary */}
      <div className="mt-3 mb-3">
        <div className="flex gap-4">
          <p className="flex-1">
            <strong>Invoice Number:</strong> {purchaseOrder.purchaseOrderNumber}
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

      <Divider />

      <TabView>
        <TabPanel header="GRN Count">
          <div className="flex justify-content-end mb-3">
            <Button label="Save PO" severity="success" outlined onClick={handleSavePO} />
          </div>

          {/* Table Section */}
          {products.length > 0 && (
            <>
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
                    <Tag
                      value={rowData.status}
                      severity={getStatusSeverity(rowData.status)}
                      rounded
                    />
                  )}
                />
              </DataTable>

              <Divider />
              <p className="font-bold uppercase mt-4 mb-3">Pending Future Receipts</p>
              <DataTable
                value={products.filter((p) => p.rejected > 0)}
                showGridlines
                responsiveLayout="scroll"
                scrollable
                emptyMessage="No pending items — all products fully received."
              >
                <Column
                  header="S.No"
                  body={(_, { rowIndex }) => rowIndex + 1}
                  style={{ width: '60px', textAlign: 'center' }}
                />
                <Column field="categoryDetails.initialCategoryName" header="Category" />
                <Column field="description" header="Product Name" />
                <Column field="quantity" header="Ordered Qty" />
                <Column field="received" header="Received Qty" />
                <Column field="rejected" header="Remaining Qty" />
                <Column
                  header="Accept Later Qty"
                  body={(rowData, { rowIndex }) => (
                    <InputNumber
                      value={rowData.futureReceived || 0}
                      onValueChange={(e) => {
                        const newVal = Math.min(e.value || 0, rowData.rejected)
                        setProducts((prev) => {
                          const updated = [...prev]
                          updated[rowIndex] = { ...updated[rowIndex], futureReceived: newVal }
                          return updated
                        })
                      }}
                      min={0}
                      max={rowData.rejected}
                    />
                  )}
                />
                <Column
                  header="Future Acceptance Status"
                  body={(rowData) => (
                    <Tag
                      value={rowData.futureReceived > 0 ? 'Scheduled' : 'Pending'}
                      severity={rowData.futureReceived > 0 ? 'info' : 'danger'}
                      rounded
                    />
                  )}
                />
              </DataTable>
            </>
          )}
        </TabPanel>

        {/* Step Two & Step Three use updated localPO */}
        <TabPanel header="GRN Initialization">
          <StepTwo purchaseOrder={localPO} />
        </TabPanel>
        <TabPanel header="GRN Products">{/* <StepThree purchaseOrder={localPO} /> */}</TabPanel>
      </TabView>
    </div>
  )
}

export default NewPOGRNSidebar
