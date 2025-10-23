import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Sidebar } from 'primereact/sidebar'
import { getPoProductsAccepted } from './NewPurchaseOrderCatalog.function'
// import NewPOGRNSidebar from './NewPOGRNSidebar/NewPOGRNSidebar' // Your sidebar component
import NewPOCatalogCreation from './NewPOCatalogCreation/NewPOCatalogCreation'

interface AcceptedProduct {
  po_product_id: number
  category_id: number
  product_description: string
  unit_price: string
  accepted_quantity: string
  accepted_total: string
  status: string
  updated_at: string
  updated_by: string
}

interface PurchaseOrder {
  purchase_order_id: number
  purchaseOrderNumber: string
  branch_id: number
  supplier_id: number
  total_amount: string
  created_at: string
  accepted_products: AcceptedProduct[]
}

// Flatten data for row grouping
interface RowData {
  serial: number
  purchaseOrderNumber: string
  total_amount: string
  product_description: string
  unit_price: string
  accepted_quantity: string
  accepted_total: string
  status: string
  originalPO: PurchaseOrder // store original PO for sidebar
}

const NewPurchaseOrderCatalog: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([])
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)

  const load = async () => {
    const res = await getPoProductsAccepted()
    if (res?.data) {
      const tempRows: RowData[] = []
      res.data.forEach((po: PurchaseOrder, index: number) => {
        po.accepted_products.forEach((prod) => {
          tempRows.push({
            serial: index + 1,
            purchaseOrderNumber: po.purchaseOrderNumber,
            total_amount: po.total_amount,
            product_description: prod.product_description,
            unit_price: prod.unit_price,
            accepted_quantity: prod.accepted_quantity,
            accepted_total: prod.accepted_total,
            status: prod.status,
            originalPO: po
          })
        })
      })
      setRows(tempRows)
      console.log('tempRows', tempRows)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleInvoiceClick = (rowData: RowData) => {
    setSelectedPO(rowData.originalPO)
    setSidebarVisible(true)
  }

  const invoiceTemplate = (rowData: RowData) => (
    <span
      style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => handleInvoiceClick(rowData)}
    >
      {rowData.purchaseOrderNumber}
    </span>
  )

  return (
    <div>
      <h2>Purchase Orders</h2>
      <DataTable
        value={rows}
        rowGroupMode="rowspan"
        groupRowsBy="purchaseOrderNumber"
        responsiveLayout="scroll"
        showGridlines
      >
        <Column header="#" body={(_, options) => options.rowIndex + 1}></Column>
        <Column field="purchaseOrderNumber" header="Invoice" body={invoiceTemplate}></Column>
        <Column field="product_description" header="Product"></Column>
        <Column field="unit_price" header="Unit Price"></Column>
        <Column field="accepted_quantity" header="Accepted Qty"></Column>
        <Column field="status" header="Status"></Column>
      </DataTable>

      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        style={{ width: '80vw' }}
        header="Purchase Order Details"
      >
        {selectedPO && <NewPOCatalogCreation purchaseOrder={selectedPO} />}
      </Sidebar>
    </div>
  )
}

export default NewPurchaseOrderCatalog
