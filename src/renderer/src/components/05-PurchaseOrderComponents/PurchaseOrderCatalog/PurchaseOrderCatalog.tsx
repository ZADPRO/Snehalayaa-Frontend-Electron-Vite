import React, { useEffect, useRef, useState } from 'react'
import { FileSignature, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'

import {
  fetchAllPurchaseOrderProducts,
  fetchCategories,
  fetchSubCategories
} from './PurchaseOrderCatalog.function'
import { PurchaseOrderProduct, Category, SubCategory } from './PurchaseOrderCatalog.interface'
import CatalogAddEditForm from './CatalogAddEditForm/CatalogAddEditForm'

const PurchaseOrderCatalog: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<PurchaseOrderProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<PurchaseOrderProduct[]>([])

  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null)

  const [visible, setVisible] = useState(false)
  const [multiSidebarVisible, setMultiSidebarVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<PurchaseOrderProduct | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<PurchaseOrderProduct[]>([])

  useEffect(() => {
    Promise.all([fetchAllPurchaseOrderProducts(), fetchCategories(), fetchSubCategories()])
      .then(([productData, categoryData, subCategoryData]) => {
        setProducts(productData)
        setFilteredProducts(productData)
        setCategories(categoryData)
        setSubCategories(subCategoryData)
      })
      .catch((err) =>
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000
        })
      )
  }, [])

  const filterProducts = (categoryId: number | null, subCategoryId: number | null) => {
    let filtered = products
    if (categoryId !== null) {
      const relatedSubCategoryIds = subCategories
        .filter((s) => s.refCategoryId === categoryId)
        .map((s) => s.refSubCategoryId)
      filtered = filtered.filter((p) => relatedSubCategoryIds.includes(p.RefSubCategoryID))
    }
    if (subCategoryId !== null) {
      filtered = filtered.filter((p) => p.RefSubCategoryID === subCategoryId)
    }
    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (e: { value: number }) => {
    const value = e.value
    setSelectedCategory(value)
    setSelectedSubCategory(null)
    filterProducts(value, null)
  }

  const handleSubCategoryChange = (e: { value: number }) => {
    const value = e.value
    setSelectedSubCategory(value)
    filterProducts(selectedCategory, value)
  }

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button icon={<FileText size={16} />} severity="secondary" tooltip="Export as CSV" />
      <Button icon={<FileSpreadsheet size={16} />} severity="success" tooltip="Export as Excel" />
      <Button icon={<FileSignature size={16} />} severity="danger" tooltip="Export as PDF" />
    </div>
  )

  const leftToolbarTemplate = () => (
    <div className="flex gap-4 items-center">
      <Dropdown
        value={selectedCategory}
        onChange={handleCategoryChange}
        options={categories}
        optionLabel="categoryName"
        optionValue="refCategoryId"
        placeholder="Select Category"
        className="w-52"
        showClear
      />
      <Dropdown
        value={selectedSubCategory}
        onChange={handleSubCategoryChange}
        options={subCategories.filter((s) => s.refCategoryId === selectedCategory)}
        optionLabel="subCategoryName"
        optionValue="refSubCategoryId"
        placeholder="Select Subcategory"
        className="w-52"
        showClear
        disabled={!selectedCategory}
      />

      {/* <Button
        label="Bulk Edit"
        icon="pi pi-pencil"
        disabled={selectedProducts.length === 0}
        onClick={() => setMultiSidebarVisible(true)}
        severity="warning"
        tooltip="Edit selected items"
      /> */}
    </div>
  )

  const getCategoryName = (id: number) =>
    categories.find((c) => c.refCategoryId === id)?.categoryName || '-'

  const getSubCategoryName = (id: number) =>
    subCategories.find((s) => s.refSubCategoryId === id)?.subCategoryName || '-'

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        value={filteredProducts}
        stripedRows
        showGridlines
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        selectionMode="multiple"
        dataKey="DummyProductsID"
      >
        <Column selectionMode="multiple" />
        <Column field="DummyProductsID" header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />

        <Column
          header="Product"
          body={(rowData) => (
            <span
              className="font-semibold underline text-blue-600 cursor-pointer"
              onClick={() => {
                setSelectedProduct(rowData)
                setVisible(true)
                setSelectedProducts([])
              }}
            >
              {getCategoryName(rowData.RefCategoryID)} →{' '}
              {getSubCategoryName(rowData.RefSubCategoryID)}
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
          // Reload to refresh the product view
          fetchAllPurchaseOrderProducts().then((data) => {
            setProducts(data)
            filterProducts(selectedCategory, selectedSubCategory)
          })
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
      </Sidebar>
    </div>
  )
}

export default PurchaseOrderCatalog
