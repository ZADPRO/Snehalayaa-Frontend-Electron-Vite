import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { baseURL } from '../../../utils/helper'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'

interface Product {
  productInstanceId: number
  poProductId: number
  lineNumber: string
  referenceNumber: string
  productDescription: string
  discount: string
  unitPrice: string
  discountPrice: string
  margin: string
  totalAmount: string
  categoryId: number
  subCategoryId: number
  status: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
  productName: string
  purchaseOrderId: number
  SKU: string
  productBranchId: number
  quantity: string
  branchName: string
}

const ShopifyProducts: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${baseURL}/admin/products/branch-4-products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = response.data.data || []
      setProducts(data)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to load Products',
        life: 3000
      })
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <InputText
            type="search"
            placeholder="Search..."
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
          />
        </span>
      </div>
    )
  }

  const header = renderHeader()

  return (
    <div className="card">
      <Toast ref={toast} />

      <DataTable
        value={products}
        paginator
        rows={10}
        showGridlines
        header={header}
        globalFilter={globalFilter}
        emptyMessage="No products found."
        responsiveLayout="scroll"
      >
        {/* Serial Number Column */}
        <Column
          header="S.No"
          body={(_, options) => options.rowIndex + 1} // rowIndex starts from 0
        />
        <Column field="SKU" header="SKU" sortable />
        <Column field="productName" header="Product Name" sortable />
        <Column field="unitPrice" header="Unit Price" sortable />
        <Column field="quantity" header="Quantity" sortable />
        <Column field="totalAmount" header="Total Amount" sortable />
        <Column field="status" header="Status" sortable />
      </DataTable>
    </div>
  )
}

export default ShopifyProducts
