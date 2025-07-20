import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useRef, useState } from 'react'

import {
  fetchBranches,
  fetchSuppliers,
  fetchCategories,
  fetchSubCategories
} from './AddNewPurchaseOrder.function'
import { Branch, Supplier, Category, SubCategory } from './AddNewPurchaseOrder.interface'

const AddNewPurchaseOrder: React.FC = () => {
  const dt = useRef<DataTable<[]>>(null)

  const [branches, setBranches] = useState<Branch[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)

  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [discount, setDiscount] = useState('')

  const [tableData, setTableData] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const [branchData, supplierData, categoryData, subCategoryData] = await Promise.all([
        fetchBranches(),
        fetchSuppliers(),
        fetchCategories(),
        fetchSubCategories()
      ])
      setBranches(branchData)
      setSuppliers(supplierData)
      setCategories(categoryData)
      setSubCategories(subCategoryData)
    }

    loadData()
  }, [])

  const handleAdd = () => {
    const newItem = {
      id: tableData.length + 1,
      productName,
      quantity,
      purchasePrice,
      discount,
      total: Number(quantity) * Number(purchasePrice) - Number(discount)
    }

    setTableData([...tableData, newItem])

    // Reset fields
    setProductName('')
    setQuantity('')
    setPurchasePrice('')
    setDiscount('')
  }

  const handleSave = () => {
    console.log('Selected Branch:', selectedBranch)
    console.log('Selected Supplier:', selectedSupplier)
    setIsSaved(true)
  }

  return (
    <div className="mt-2">
      <div className="flex gap-3 align-items-center">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="fromAddress"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.value)}
              options={branches}
              optionLabel="refBranchName"
              placeholder="Select From Address"
              className="w-full"
            />
            <label htmlFor="status">From Address</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="toAddress"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.value)}
              options={suppliers}
              optionLabel="supplierCompanyName"
              placeholder="Select To Address"
              className="w-full"
            />
            <label htmlFor="status">To Address</label>
          </FloatLabel>
        </div>
      </div>
      <Divider />

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.value)}
              options={categories}
              optionLabel="categoryName"
              placeholder="Select Category"
              className="w-full"
            />
            <label htmlFor="categoryName">Category</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="subCategory"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.value)}
              options={subCategories}
              optionLabel="subCategoryName"
              placeholder="Select Sub Category"
              className="w-full"
            />
            <label htmlFor="categoryName">Sub-Category</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full"
            />
            <label htmlFor="productName">Product Name</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex mt-3 gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full"
            />
            <label htmlFor="quantity">Quantity</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="purchasePrice"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full"
            />
            <label htmlFor="purchasePrice">Purchase Price</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full"
            />
            <label htmlFor="discount">Discount</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex mt-3 justify-content-end">
        <Button label="Add" onClick={handleAdd} />
      </div>
      <Divider />

      <DataTable
        ref={dt}
        id="categories-table"
        value={tableData}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
        <Column field="productName" header="Name" />
        <Column field="quantity" header="Quantity" />
        <Column field="discount" header="Disc %" />
        <Column field="discount" header="Discount" />
        <Column field="total" header="Total" />
      </DataTable>

      <div className="fixed bottom-0 left-0 w-full shadow-md p-3 text-right z-10 flex justify-content-end gap-3">
        <Button
          label={isSaved ? 'Close' : 'Save'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSave}
        />
        <Button
          label="Download"
          icon="pi pi-download"
          className="bg-[#8e5ea8] border-none gap-2"
          disabled={!isSaved}
          onClick={() => console.log('Download triggered')}
        />
        <Button
          label="Print"
          icon="pi pi-print"
          className="bg-[#8e5ea8] border-none gap-2"
          disabled={!isSaved}
          onClick={() => console.log('Print triggered')}
        />
      </div>
    </div>
  )
}

export default AddNewPurchaseOrder
