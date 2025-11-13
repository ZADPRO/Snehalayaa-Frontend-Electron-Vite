import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import axios from 'axios'
import { baseURL } from '../../../utils/helper'
import { Products } from './InventoryProducts.interface'
import { fetchCategories } from '../../../components/03-SettingsComponents/SettingsCategories/SettingsCategories.function'
import { fetchSubCategories } from '../../../components/03-SettingsComponents/SettingsSubCategories/SettingsSubCategories.function'
import { fetchBranch } from '../../../components/03-SettingsComponents/SettingsBranch/SettingsBranch.function'

const InventoryProducts: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<Products[]>([])

  // Dropdown filter states
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)

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
      setProducts(response.data.data || [])
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to load Products',
        life: 3000
      })
    }
  }

  // ✅ Load dropdown data
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

  // ✅ Serial number column template
  const serialNumberBody = (_rowData: Products, { rowIndex }: { rowIndex: number }) => rowIndex + 1

  // ✅ Toolbar with dropdown filters
  const rightToolbarTemplate = () => (
    <div className="flex gap-3 align-items-center">
      <Dropdown
        value={selectedCategory}
        options={categories}
        optionLabel="categoryName"
        optionValue="refCategoryId"
        onChange={(e) => setSelectedCategory(e.value)}
        placeholder="Select Category"
        className="w-12rem"
      />
      <Dropdown
        value={selectedSubCategory}
        options={subCategories}
        optionLabel="subCategoryName"
        optionValue="refCategoryId"
        onChange={(e) => setSelectedSubCategory(e.value)}
        placeholder="Select Sub Category"
        className="w-14rem"
      />
      <Dropdown
        value={selectedBranch}
        options={branches}
        optionLabel="refBranchName"
        optionValue="refBranchId"
        onChange={(e) => setSelectedBranch(e.value)}
        placeholder="Select Branch"
        className="w-12rem"
      />
      <Button label="Apply Filter" icon="pi pi-filter" className="p-button-sm" />
    </div>
  )

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-3" right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      {/* ✅ Products Table */}
      <DataTable
        value={products}
        dataKey="poProductId"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
        scrollable
      >
        {/* Serial Number Column */}
        <Column header="S.No" body={serialNumberBody} style={{ minWidth: '6rem' }} />
        <Column field="sku" header="SKU" style={{ minWidth: '12rem' }} />
        <Column field="productName" header="Product Name" style={{ minWidth: '14rem' }} />
        <Column field="invoiceFinalNumber" header="Invoice Number" style={{ minWidth: '14rem' }} />
        {/* <Column field="poProductId" header="PO Product ID" style={{ minWidth: '10rem' }} /> */}
        <Column field="unitPrice" header="Unit Price" style={{ minWidth: '8rem' }} />
        <Column field="discount" header="Discount (%)" style={{ minWidth: '8rem' }} />
        <Column field="discountPrice" header="Discount Price" style={{ minWidth: '10rem' }} />
        <Column field="margin" header="Margin (%)" style={{ minWidth: '8rem' }} />
        <Column field="totalAmount" header="Total Amount" style={{ minWidth: '10rem' }} />
        {/* <Column field="status" header="Status" style={{ minWidth: '8rem' }} /> */}
        <Column field="categoryName" header="Category" style={{ minWidth: '10rem' }} />
        <Column field="subCategoryName" header="Sub Category" style={{ minWidth: '12rem' }} />
        <Column field="branchName" header="Branch" style={{ minWidth: '10rem' }} />
        <Column field="createdAt" header="Created At" style={{ minWidth: '12rem' }} />
        <Column field="updatedAt" header="Updated At" style={{ minWidth: '12rem' }} />
      </DataTable>
    </div>
  )
}

export default InventoryProducts
