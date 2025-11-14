import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { MultiSelect } from 'primereact/multiselect'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Eye, File, FileDown, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { baseURL } from '../../../utils/helper'
import { Products } from './InventoryProducts.interface'
import { fetchCategories } from '../../../components/03-SettingsComponents/SettingsCategories/SettingsCategories.function'
import { fetchSubCategories } from '../../../components/03-SettingsComponents/SettingsSubCategories/SettingsSubCategories.function'
import { fetchBranch } from '../../../components/03-SettingsComponents/SettingsBranch/SettingsBranch.function'
import { Dialog } from 'primereact/dialog'

const InventoryProducts: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<Products[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([])

  const [visibleDialog, setVisibleDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  // ✅ Multi-select filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([])
  const [selectedBranches, setSelectedBranches] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const [categories, setCategories] = useState<any[]>([])
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])

  // ✅ Load Products
  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${baseURL}/admin/purchaseOrderAcceptedProducts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = response.data.data || []
      setProducts(data)
      setFilteredProducts(data)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to load Products',
        life: 3000
      })
    }
  }

  // ✅ Load Dropdown Data
  const loadDropdownData = async () => {
    try {
      const [catData, subCatData, branchData] = await Promise.all([
        fetchCategories(),
        fetchSubCategories(),
        fetchBranch()
      ])
      setCategories(catData)
      setSubCategories(subCatData)
      setBranches(branchData)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to load dropdown data',
        life: 3000
      })
    }
  }

  useEffect(() => {
    loadProducts()
    loadDropdownData()
  }, [])

  // ✅ Filtering logic (supports multiple selections)
  useEffect(() => {
    let filtered = [...products]

    if (selectedCategories.length > 0)
      filtered = filtered.filter((p) => selectedCategories.includes(Number(p.categoryId)))
    if (selectedSubCategories.length > 0)
      filtered = filtered.filter((p) => selectedSubCategories.includes(Number(p.subCategoryId)))
    if (selectedBranches.length > 0)
      filtered = filtered.filter((p) => selectedBranches.includes(Number(p.productBranchId)))

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.productName?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term) ||
          p.invoiceFinalNumber?.toLowerCase().includes(term)
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategories, selectedSubCategories, selectedBranches, searchTerm, products])

  // ✅ Serial number column template
  const serialNumberBody = (_rowData: Products, { rowIndex }: { rowIndex: number }) => rowIndex + 1

  // ✅ Export CSV
  const exportCSV = () => {
    const csvData = filteredProducts.map((item) => ({
      SKU: item.sku,
      'Product Name': item.productName,
      'Invoice Number': item.invoiceFinalNumber,
      'Unit Price': item.unitPrice,
      Discount: item.discount,
      'Discount Price': item.discountPrice,
      Margin: item.margin,
      'Total Amount': item.totalAmount,
      Category: item.categoryName,
      'Sub Category': item.subCategoryName,
      Branch: item.branchName,
      'Created At': item.createdAt
    }))

    if (csvData.length === 0) {
      toast.current?.show({ severity: 'warn', summary: 'No Data', detail: 'Nothing to export.' })
      return
    }

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'InventoryProducts.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // ✅ Export Excel
  const exportExcel = () => {
    if (filteredProducts.length === 0) {
      toast.current?.show({ severity: 'warn', summary: 'No Data', detail: 'Nothing to export.' })
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredProducts)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Products')
    XLSX.writeFile(workbook, 'InventoryProducts.xlsx')
  }

  // ✅ Left Toolbar Template
  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<FileDown size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Export CSV"
        tooltipOptions={{ position: 'bottom' }}
        onClick={exportCSV}
      />
      <Button
        icon={<FileSpreadsheet size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Export Excel"
        tooltipOptions={{ position: 'bottom' }}
        onClick={exportExcel}
      />
    </div>
  )

  // ✅ Right Toolbar Template with MultiSelect filters
  const rightToolbarTemplate = () => (
    <div className="flex gap-3 align-items-center">
      <InputText
        placeholder="Search Here"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <MultiSelect
        value={selectedCategories}
        options={categories}
        optionLabel="categoryName"
        optionValue="refCategoryId"
        onChange={(e) => setSelectedCategories(e.value)}
        placeholder="Select Categories"
        display="chip"
        filter
        showClear
        className="w-14rem"
      />
      <MultiSelect
        value={selectedSubCategories}
        options={subCategories}
        optionLabel="subCategoryName"
        optionValue="refSubCategoryId"
        onChange={(e) => setSelectedSubCategories(e.value)}
        placeholder="Select Sub Categories"
        display="chip"
        filter
        showClear
        className="w-16rem"
      />
      <MultiSelect
        value={selectedBranches}
        options={branches}
        optionLabel="refBranchName"
        optionValue="refBranchId"
        onChange={(e) => setSelectedBranches(e.value)}
        placeholder="Select Branches"
        display="chip"
        filter
        showClear
        className="w-14rem"
      />
    </div>
  )

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-3" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="bottom" />

      <DataTable
        value={filteredProducts}
        dataKey="sku"
        paginator
        showGridlines
        stripedRows
        rows={20}
        rowsPerPageOptions={[20, 50, 100]}
        responsiveLayout="scroll"
        scrollable
      >
        <Column header="S.No" body={serialNumberBody} frozen style={{ minWidth: '6rem' }} />
        <Column field="sku" sortable header="SKU" frozen style={{ minWidth: '12rem' }} />
        <Column
          header="View"
          frozen
          style={{ minWidth: '6rem' }}
          body={(rowData: Products) => (
            <Button
              icon={<Eye size={16} />}
              text
              onClick={() => {
                setSelectedProduct(rowData)
                setVisibleDialog(true)
              }}
            />
          )}
        />

        <Column field="productName" sortable header="Product Name" style={{ minWidth: '14rem' }} />
        <Column
          field="invoiceFinalNumber"
          sortable
          header="Invoice Number"
          style={{ minWidth: '14rem' }}
        />
        <Column field="unitPrice" header="Unit Price" style={{ minWidth: '8rem' }} />
        <Column field="discount" header="Discount (%)" style={{ minWidth: '8rem' }} />
        <Column field="discountPrice" header="Discount Price" style={{ minWidth: '10rem' }} />
        <Column field="margin" header="Margin (%)" style={{ minWidth: '8rem' }} />
        <Column field="totalAmount" header="Total Amount" style={{ minWidth: '10rem' }} />
        <Column field="categoryName" header="Category" sortable style={{ minWidth: '10rem' }} />
        <Column
          field="subCategoryName"
          header="Sub Category"
          sortable
          style={{ minWidth: '12rem' }}
        />
        <Column field="quantity" header="Quantity" sortable style={{ minWidth: '10rem' }} />
        <Column field="branchName" header="Branch" sortable style={{ minWidth: '10rem' }} />
        <Column field="createdAt" header="Created At" sortable style={{ minWidth: '12rem' }} />
      </DataTable>

      <Dialog
        header="Product Details"
        visible={visibleDialog}
        style={{ width: '800px', maxWidth: '95%' }}
        modal
        onHide={() => setVisibleDialog(false)}
      >
        {selectedProduct && (
          <div className="flex flex-column gap-4">
            {/* Image and Basic Info */}
            <div className="flex flex-column gap-4">
              {/* Image Preview */}
              <div className="flex justify-content-center flex-1">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.productName}
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    onError={(e) => ((e.target as HTMLImageElement).src = '')}
                  />
                ) : (
                  <File size={64} />
                )}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <strong>SKU:</strong> {selectedProduct.sku}
                </div>
                <div className="flex-1">
                  <strong>Product Name:</strong> {selectedProduct.productName}
                </div>
                <div className="flex-1">
                  <strong>Invoice Number:</strong> {selectedProduct.invoiceFinalNumber}
                </div>
              </div>
              <div className="flex flex-1 gap-3">
                <div className="flex-1">
                  <strong>Unit Price:</strong> {selectedProduct.unitPrice}
                </div>
                <div className="flex-1">
                  <strong>Discount:</strong> {selectedProduct.discount}%
                </div>
                <div className="flex-1">
                  <strong>Discount Price:</strong> {selectedProduct.discountPrice}
                </div>
              </div>
              <div className="flex flex-1 gap-3">
                <div className="flex-1">
                  <strong>Margin:</strong> {selectedProduct.margin}%
                </div>
                <div className="flex-1">
                  <strong>Total Amount:</strong> {selectedProduct.totalAmount}
                </div>
                <div className="flex-1">
                  <strong>Quantity:</strong> {selectedProduct.quantity}
                </div>
              </div>
              <div className="flex flex-1 gap-3">
                <div className="flex-1">
                  <strong>Category:</strong> {selectedProduct.categoryName}
                </div>
                <div className="flex-1">
                  <strong>Sub Category:</strong> {selectedProduct.subCategoryName}
                </div>
                <div className="flex-1">
                  <strong>Branch:</strong> {selectedProduct.branchName}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <strong>Audit Log:</strong>
              <DataTable
                value={selectedProduct?.audit || []}
                size="small"
                scrollable
                scrollHeight="200px"
              >
                <Column field="changedBy" header="Changed By" style={{ minWidth: '120px' }} />
                <Column field="changeDate" header="Date" style={{ minWidth: '120px' }} />
                <Column field="fieldName" header="Field" style={{ minWidth: '120px' }} />
                <Column field="oldValue" header="Old Value" style={{ minWidth: '120px' }} />
                <Column field="newValue" header="New Value" style={{ minWidth: '120px' }} />
                <Column field="remarks" header="Remarks" style={{ minWidth: '150px' }} />
              </DataTable>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default InventoryProducts
