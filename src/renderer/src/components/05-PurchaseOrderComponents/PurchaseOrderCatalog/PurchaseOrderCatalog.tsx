import React, { useEffect, useRef, useState } from 'react'
import { FileSignature, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from 'primereact/button'
import { DataTable, DataTableSelectionChangeEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'

import { fetchAllPurchaseOrderProducts } from './PurchaseOrderCatalog.function'
import { PurchaseOrderProduct } from './PurchaseOrderCatalog.interface'
import CatalogAddEditForm from './CatalogAddEditForm/CatalogAddEditForm'

const PurchaseOrderCatalog: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<PurchaseOrderProduct[]>([])
  const [visible, setVisible] = useState(false)
  const [multiSidebarVisible, setMultiSidebarVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<PurchaseOrderProduct | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<PurchaseOrderProduct[]>([])

  // Fetch product data
  const loadProducts = () => {
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
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button icon={<FileText size={16} />} severity="secondary" tooltip="Export as CSV" />
      <Button icon={<FileSpreadsheet size={16} />} severity="success" tooltip="Export as Excel" />
      <Button icon={<FileSignature size={16} />} severity="danger" tooltip="Export as PDF" />
    </div>
  )

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        label="Bulk Edit"
        icon="pi pi-pencil"
        disabled={selectedProducts.length === 0}
        onClick={() => setMultiSidebarVisible(true)}
        severity="warning"
        tooltip="Edit selected items"
      />
    </div>
  )

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        value={products}
        stripedRows
        showGridlines
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        selection={selectedProducts}
        onSelectionChange={(e: DataTableSelectionChangeEvent) => setSelectedProducts(e.value)}
        selectionMode="multiple"
        dataKey="DummyProductsID"
      >
        <Column selectionMode="multiple" />

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
                setSelectedProducts([])
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

      {/* ✅ Single Product Edit Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => {
          setVisible(false)
          loadProducts()
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

      {/* ✅ Multi Product Bulk Edit Sidebar */}
      <Sidebar
        visible={multiSidebarVisible}
        position="right"
        onHide={() => setMultiSidebarVisible(false)}
        header={
          <span style={{ textTransform: 'uppercase', fontWeight: '600', fontSize: '1.2rem' }}>
            Bulk Product Editor
          </span>
        }
        style={{ width: '50vw' }}
      >
        <p className="mb-2 font-semibold">Selected Products:</p>
        <ul className="pl-4 list-disc">
          {selectedProducts.map((prod) => (
            <li key={prod.DummyProductsID}>{prod.ProductName}</li>
          ))}
        </ul>

        {/* Later you can replace this with a proper bulk edit form */}
      </Sidebar>
    </div>
  )
}

export default PurchaseOrderCatalog
