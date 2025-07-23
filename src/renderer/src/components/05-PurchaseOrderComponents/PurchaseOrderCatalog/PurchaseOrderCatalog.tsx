import React, { useEffect, useRef, useState } from 'react'
import { FileSignature, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import { Sidebar } from 'primereact/sidebar'
import { fetchAllPurchaseOrderProducts } from './PurchaseOrderCatalog.function'
import { PurchaseOrderProduct } from './PurchaseOrderCatalog.interface'
import { Toast } from 'primereact/toast'
import CatalogAddEditForm from './CatalogAddEditForm/CatalogAddEditForm'

const PurchaseOrderCatalog: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<PurchaseOrderProduct[]>([])
  const [visible, setVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<PurchaseOrderProduct | null>(null)

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

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button icon={<FileText size={16} />} severity="secondary" tooltip="Export as CSV" />
      <Button icon={<FileSpreadsheet size={16} />} severity="success" tooltip="Export as Excel" />
      <Button icon={<FileSignature size={16} />} severity="danger" tooltip="Export as PDF" />
    </div>
  )

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-2" right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        value={products}
        stripedRows
        showGridlines
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
      >
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

      <Sidebar
        visible={visible}
        position="right"
        onHide={() => {
          setVisible(false)

          // Fetch updated data on close
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
        }}
        header={
          <span style={{ textTransform: 'uppercase', fontWeight: '600', fontSize: '1.2rem' }}>
            Product Catalog
          </span>
        }
        style={{ width: '50vw' }}
      >
        <CatalogAddEditForm selectedProduct={selectedProduct} onSuccess={() => setVisible(false)} />
      </Sidebar>
    </div>
  )
}

export default PurchaseOrderCatalog
