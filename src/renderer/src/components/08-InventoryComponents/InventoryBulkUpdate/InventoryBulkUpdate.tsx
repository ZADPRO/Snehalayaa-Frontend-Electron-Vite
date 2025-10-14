import React, { useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Download, RefreshCw, Upload } from 'lucide-react'

const REQUIRED_HEADERS = [
  'Product Name',
  'SKU',
  'GTIN',
  'Brand',
  'Categories',
  'Sub Categories',
  'Quantity',
  'Valuation based on MRP',
  'Valuation based on Price',
  'Valuation based on Cost'
]

// ✅ Updated Sample Data
const SAMPLE_DATA = [
  {
    'Product Name': 'KANCHEEVARAM SAREE 0001012425',
    SKU: 'SS000005',
    GTIN: '0001012425',
    Brand: 'Snehalayaa',
    Categories: 'KANCHEEVARAM',
    'Sub Categories': 'SILK SAREE',
    Quantity: -1,
    'Valuation based on MRP': -38110,
    'Valuation based on Price': -38110,
    'Valuation based on Cost': -21000
  },
  {
    'Product Name': 'KANCHEEVARAM SAREE 0001012462',
    SKU: 'SS000022',
    GTIN: '0001012462',
    Brand: 'Snehalayaa',
    Categories: '50,KANCHEEVARAM',
    'Sub Categories': 'SILK SAREE',
    Quantity: 1,
    'Valuation based on MRP': 23647,
    'Valuation based on Price': 23647,
    'Valuation based on Cost': 10500
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

      if (jsonData.length === 0) {
        showError('Uploaded file is empty.')
        return
      }

      const rawHeaders = Object.keys(jsonData[0])
      const normalizedHeaders = rawHeaders.map((h) => h.replace(/\r|\n/g, '').trim())

      const missingHeaders = REQUIRED_HEADERS.filter(
        (req) => !normalizedHeaders.includes(req.trim())
      )

      if (missingHeaders.length > 0) {
        showError(`Missing required headers: ${missingHeaders.join(', ')}`)
        return
      }

      const normalizedData = jsonData.map((row: any) => {
        const newRow: any = {}
        rawHeaders.forEach((key, index) => {
          const cleanKey = rawHeaders[index].replace(/\r|\n/g, '').trim()
          newRow[cleanKey] = row[key]
        })
        return newRow
      })

      const skuList = normalizedData.map((row: any) => row.SKU)
      const duplicateSKUs = skuList.filter((sku, index) => skuList.indexOf(sku) !== index)
      if (duplicateSKUs.length > 0) {
        showError(`Duplicate SKUs in file: ${[...new Set(duplicateSKUs)].join(', ')}`)
        return
      }

      setProducts(normalizedData)
      showSuccess('File uploaded successfully! Preview generated.')
    }
    reader.readAsBinaryString(file)
  }

  const handleBulkUploadClick = () => {
    fileInputRef.current?.click()
  }

  // ✅ Updated to export the required Excel format
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

    const existingData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    const existingSKUs = existingData.map((p: any) => p.SKU)
    const newSKUs = products.map((p) => p.SKU)
    const conflicts = newSKUs.filter((sku) => existingSKUs.includes(sku))

    if (conflicts.length > 0) {
      showError(`SKU(s) already exist in server: ${conflicts.join(', ')}`)
      return
    }

    const updatedData = [...existingData, ...products]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData))
    showSuccess('Products successfully updated!')
    setProducts([])
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
        rows={25}
        rowsPerPageOptions={[10, 25, 50, 100]}
      >
        <Column
          header="S.No"
          body={(_, { rowIndex }) => rowIndex + 1}
          style={{ width: '80px', textAlign: 'center' }}
          frozen
        />

        <Column field="Product Name" header="Product Name" style={{ minWidth: '14rem' }} frozen />
        <Column field="SKU" header="SKU" style={{ minWidth: '8rem' }} frozen sortable />
        <Column field="GTIN" header="GTIN" style={{ minWidth: '14rem' }} />
        <Column field="Brand" header="Brand" style={{ minWidth: '10rem' }} />
        <Column field="Categories" header="Categories" style={{ minWidth: '10rem' }} />
        <Column field="Sub Categories" header="Sub Categories" style={{ minWidth: '14rem' }} />
        <Column field="Quantity" header="Quantity" sortable />
        <Column field="Valuation based on MRP" header="MRP" style={{ minWidth: '7rem' }} sortable />
        <Column
          field="Valuation based on Price"
          header="Price"
          style={{ minWidth: '7rem' }}
          sortable
        />
        <Column
          field="Valuation based on Cost"
          header="Cost"
          style={{ minWidth: '7rem' }}
          sortable
        />
      </DataTable>
    </div>
  )
}

export default InventoryBulkUpdate
