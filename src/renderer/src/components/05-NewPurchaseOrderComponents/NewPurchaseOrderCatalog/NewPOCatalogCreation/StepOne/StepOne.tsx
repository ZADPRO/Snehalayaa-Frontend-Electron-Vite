import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputNumber } from 'primereact/inputnumber'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Check } from 'lucide-react'

interface StepOneProps {
  purchaseOrder: any
}

interface ProductRow {
  poProductId: number
  description: string
  quantity: number
  unitPrice: number
  received: number
  rejected: number
  amount: number
  status: string
  categoryDetails: {
    initialCategoryName: string
  }
}

const StepOne: React.FC<StepOneProps> = ({ purchaseOrder }) => {
  const acceptedProducts = purchaseOrder.accepted_products || []

  // Convert accepted products into a structured state
  const [products, setProducts] = useState<ProductRow[]>([])

  useEffect(() => {
    const initialRows: ProductRow[] = acceptedProducts.map((p: any) => ({
      poProductId: p.po_product_id,
      description: p.product_description,
      quantity: Number(p.accepted_quantity),
      unitPrice: Number(p.unit_price),
      ordered_quantity: Number(p.ordered_quantity),
      ordered_total: Number(p.ordered_total),
      received: 0,
      rejected: 0,
      amount: Number(p.unit_price) * Number(p.accepted_quantity),
      status: p.status,
      categoryDetails: { initialCategoryName: '' } // set category if needed
    }))
    setProducts(initialRows)
  }, [purchaseOrder])

  const formatINR = (value: number) => `₹ ${value.toLocaleString('en-IN')}`

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'success'
      case 'Partial':
        return 'warning'
      case 'Rejected':
        return 'danger'
      default:
        return 'info'
    }
  }

  const handleReceivedChange = (value: number, rowIndex: number) => {
    setProducts((prev) => {
      const newProducts = [...prev]
      const row = newProducts[rowIndex]

      // Validate received quantity does not exceed total quantity
      if (value > row.quantity) value = row.quantity

      row.received = value
      row.rejected = row.quantity - value
      row.amount = value * row.unitPrice

      // If there is remaining quantity, push it as a new row
      const remainingQty = row.quantity - value
      if (remainingQty > 0 && !newProducts[rowIndex + 1]?.poProductId) {
        newProducts.splice(rowIndex + 1, 0, {
          poProductId: Date.now() + rowIndex,
          description: row.description,
          quantity: remainingQty,
          unitPrice: row.unitPrice,
          received: 0,
          rejected: 0,
          amount: 0,
          status: 'Pending',
          categoryDetails: row.categoryDetails
        })
      }

      return newProducts
    })
  }

  return (
    <div>
      <h4>Accepted Products Summary</h4>
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
            body={(rowData) => formatINR(rowData.amount)}
            style={{ minWidth: '10rem', textAlign: 'right' }}
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
            header="Status"
            body={(rowData) => (
              <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} rounded />
            )}
          />
        </DataTable>
      )}

      <div className="flex justify-content-end mt-3">
        <Button label="Save" icon={<Check />} className="gap-3"></Button>
      </div>
    </div>
  )
}

export default StepOne
