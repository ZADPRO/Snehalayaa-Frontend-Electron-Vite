import React, { useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Download, RefreshCw, Upload } from 'lucide-react'

const REQUIRED_HEADERS = [
  'S.No',
  'ProductName',
  'SKU',
  'ProductType',
  'Category',
  'SubCategory',
  'Fabric',
  'SellingPrice',
  'CostPrice',
  'Discount'
]

const SAMPLE_DATA = [
  {
    'S.No': 1,
    ProductName: 'Kanjivaram',
    SKU: 'SS072039',
    ProductType: 'Kancheevaram',
    Category: 'Silk Saree',
    SubCategory: 'Kanjivaram',
    Fabric: '',
    SellingPrice: 50000,
    CostPrice: 30000,
    Discount: 0
  },
  {
    'S.No': 2,
    ProductName: 'Kanjivaram',
    SKU: 'SS072040',
    ProductType: 'Kancheevaram',
    Category: 'Silk Saree',
    SubCategory: 'Kanjivaram',
    Fabric: '',
    SellingPrice: 50000,
    CostPrice: 30000,
    Discount: 0
  },
  {
    'S.No': 3,
    ProductName: 'Kanjivaram',
    SKU: 'SS072041',
    ProductType: 'Kancheevaram',
    Category: 'Silk Saree',
    SubCategory: 'Kanjivaram',
    Fabric: '',
    SellingPrice: 50000,
    CostPrice: 30000,
    Discount: 0
  }
]

const LOCAL_STORAGE_KEY = 'inventoryData'

const InventoryBulkUpdate: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const toast = useRef<Toast>(null)

  const showError = (msg: string) => {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: msg })
  }

  const showSuccess = (msg: string) => {
    toast.current?.show({ severity: 'success', summary: 'Success', detail: msg })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' })

      // ✅ Validate headers
      const headers = Object.keys(jsonData[0] || {})
      const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h))
      if (missingHeaders.length > 0) {
        showError(`Missing required headers: ${missingHeaders.join(', ')}`)
        return
      }

      // ✅ Check SKU uniqueness inside uploaded sheet
      const skuList = jsonData.map((row: any) => row.SKU)
      const duplicateSKUs = skuList.filter((sku, index) => skuList.indexOf(sku) !== index)
      if (duplicateSKUs.length > 0) {
        showError(`Duplicate SKUs in file: ${[...new Set(duplicateSKUs)].join(', ')}`)
        return
      }

      setProducts(jsonData)
    }
    reader.readAsBinaryString(file)
  }

  const handleBulkUploadClick = () => {
    fileInputRef.current?.click()
  }

  const downloadSampleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATA)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })
    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    })
    saveAs(blob, 'sample_inventory.xlsx')
  }

  const handleUpdate = () => {
    if (products.length === 0) {
      showError('No products to update. Please upload a file first.')
      return
    }

    // ✅ Get existing inventory from LocalStorage
    const existingData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')

    // ✅ Check for SKU conflicts
    const existingSKUs = existingData.map((p: any) => p.SKU)
    const newSKUs = products.map((p) => p.SKU)
    const conflicts = newSKUs.filter((sku) => existingSKUs.includes(sku))

    if (conflicts.length > 0) {
      showError(`SKU(s) already exist in server: ${conflicts.join(', ')}`)
      return
    }

    // ✅ Append new products to LocalStorage
    const updatedData = [...existingData, ...products]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData))

    showSuccess('Products successfully updated!')
    setProducts([]) // clear table after update
  }

  return (
    <div>
      <Toast ref={toast} />

      <div className="flex justify-content-between align-items-center">
        <Button
          label="Download Sample Excel"
          icon={<Download />}
          className="gap-2"
          onClick={downloadSampleExcel}
          severity="secondary"
        />

        <div className="flex gap-3 justify-content-end">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button
            label="Bulk Upload"
            className="gap-2"
            icon={<Upload />}
            onClick={handleBulkUploadClick}
          />
          <Button
            label="Update"
            severity="success"
            className="gap-2"
            icon={<RefreshCw />}
            onClick={handleUpdate}
          />
        </div>
      </div>

      <DataTable
        value={products}
        showGridlines
        scrollable
        className="mt-3"
        paginator
        rows={5}
        rowsPerPageOptions={[10, 25, 50, 100]}
      >
        <Column field="S.No" header="S.No" />
        <Column field="ProductName" header="Product Name" />
        <Column field="SKU" header="SKU" />
        <Column field="ProductType" header="Product Type" />
        <Column field="Category" header="Category" />
        <Column field="SubCategory" header="Sub Category" />
        <Column field="Fabric" header="Fabric" />
        <Column field="SellingPrice" header="Selling Price" />
        <Column field="CostPrice" header="Cost Price" />
        <Column field="Discount" header="Discount" />
      </DataTable>
    </div>
  )
}

export default InventoryBulkUpdate
