import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tooltip } from 'primereact/tooltip'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'
import { PurchaseOrderProduct } from './BarcodeCreation.interface'
import { fetchAllPurchaseOrderProducts } from './BarcodeCreation.function'

const BarcodeCreation: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<PurchaseOrderProduct[]>([])
  const [visible, setVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<PurchaseOrderProduct | null>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  useEffect(() => {
    fetchAllPurchaseOrderProducts()
      .then((data) => setProducts(data))
      .catch((err) =>
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000
        })
      )
  }, [])

  return (
    <div>
      <Toast ref={toast} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        value={products}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
        selectionMode="multiple"
        stripedRows
        showGridlines
        scrollable
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ textAlign: 'center' }}
          style={{ minWidth: '50px' }}
        />
        <Column field="DummyProductsID" header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column
          field="ProductName"
          header="Product Name"
          body={(rowData) => (
            <span
              className="font-bold underline cursor-pointer"
              onClick={() => {
                setSelectedProduct(rowData)
                setVisible(true)
              }}
            >
              {rowData.ProductName}
            </span>
          )}
        />
        <Column field="HSNCode" header="HSN Code" />
        <Column field="DummySKU" header="SKU" />
        <Column field="Price" header="Price" />
        <Column field="AcceptanceStatus" header="Status" />
      </DataTable>
    </div>
  )
}

export default BarcodeCreation
