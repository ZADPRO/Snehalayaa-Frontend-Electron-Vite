import React, { useEffect, useRef } from 'react'
import { PurchaseOrderListResponse } from '../../NewPurchaseOrderCreation/NewPurchaseOrderCreation.interface'
import { formatINR } from '../../../../utils/helper'
import { Toast } from 'primereact/toast'
import { Divider } from 'primereact/divider'

interface PurchaseOrderProductDetailsProps {
  purchaseOrder: PurchaseOrderListResponse
}

const PurchaseOrderProductDetails: React.FC<PurchaseOrderProductDetailsProps> = ({
  purchaseOrder
}) => {
  const toast = useRef<Toast>(null)

  useEffect(() => {
    console.log('Selected Purchase Order:', purchaseOrder)
  }, [purchaseOrder])

  return (
    <div>
      <Toast ref={toast} />
      <p className="font-bold uppercase underline">Purchase Order Details</p>

      {/* Summary */}
      <div className="mt-3 mb-3">
        <div className="flex gap-4">
          <p className="flex-1">
            <strong>Invoice Number:</strong> {purchaseOrder.purchase_order_number}
          </p>
          <p className="flex-1">
            <strong>Supplier:</strong> {purchaseOrder.supplier_name}
          </p>
          <p className="flex-1">
            <strong>Total Items:</strong> {purchaseOrder.total_ordered_quantity}
          </p>
        </div>
        <div className="flex mt-2 gap-4">
          <p className="flex-1">
            <strong>Total Ordered Qty:</strong>
          </p>
          <p className="flex-1">
            <strong>Total Received Qty:</strong>
          </p>
          <p className="flex-1">
            <strong>Total Amount:</strong> {formatINR(Number(purchaseOrder.total_amount))}
          </p>
        </div>
      </div>

      <Divider />
    </div>
  )
}

export default PurchaseOrderProductDetails
