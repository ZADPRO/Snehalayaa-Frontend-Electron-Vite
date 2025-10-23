import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'
import { InputText } from 'primereact/inputtext'
import { Branch, InitialCategory, Supplier } from './NewPurchaseOrderCreation.interface'
import {
  createPurchaseOrder,
  fetchBranches,
  fetchInitialCategories,
  fetchSuppliers
} from './NewPurchaseOrderCreation.function'
import { Plus, Trash2, Edit3, Save, Download, Printer, X, CalendarIcon } from 'lucide-react'
import { formatINR } from '../../../utils/helper'
import { Calendar } from 'primereact/calendar'
import { InputSwitch } from 'primereact/inputswitch'

const TAX_PERCENTAGE = 5

const NewPurchaseOrderCreation: React.FC = () => {
  const dt = useRef<DataTable<any[]>>(null)
  const toast = useRef<Toast>(null)

  const [branches, setBranches] = useState<Branch[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [initialCategories, setInitialCategories] = useState<InitialCategory[]>([])

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedInitialCategory, setSelectedInitialCategory] = useState<InitialCategory | null>(
    null
  )

  const [productDescription, setProductDescription] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [quantity, setQuantity] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const [isSaved, setIsSaved] = useState(false)
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [creditedDate, setCreditedDate] = useState<Date | null>(null)

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      const [branchData, supplierData, initialCategoryData] = await Promise.all([
        fetchBranches(),
        fetchSuppliers(),
        fetchInitialCategories()
      ])
      setBranches(branchData)
      console.log('branchData', branchData)
      setSuppliers(supplierData)
      console.log('supplierData', supplierData)
      setInitialCategories(initialCategoryData)
    }
    loadData()
  }, [])

  // Add or update product
  const handleAddProduct = () => {
    if (!selectedInitialCategory || !productDescription || !unitPrice || !quantity) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Incomplete',
        detail: 'Please fill all required fields'
      })
      return
    }

    const total = (
      parseFloat(unitPrice) *
      parseFloat(quantity) *
      (1 - parseFloat(discount || '0') / 100)
    ).toFixed(2)
    const newProduct = {
      category: selectedInitialCategory,
      description: productDescription,
      unitPrice: parseFloat(unitPrice),
      discount: parseFloat(discount || '0'),
      quantity: parseInt(quantity),
      total: parseFloat(total)
    }

    if (editIndex !== null) {
      const updated = [...products]
      updated[editIndex] = newProduct
      setProducts(updated)
      setEditIndex(null)
      toast.current?.show({
        severity: 'success',
        summary: 'Updated',
        detail: 'Product updated successfully'
      })
    } else {
      setProducts([...products, newProduct])
      toast.current?.show({
        severity: 'success',
        summary: 'Added',
        detail: 'Product added successfully'
      })
    }

    // Clear input fields
    setSelectedInitialCategory(null)
    setProductDescription('')
    setUnitPrice('')
    setDiscount('')
    setQuantity('')
  }

  const handleEdit = (rowData: any, index: number) => {
    setSelectedInitialCategory(rowData.category)
    setProductDescription(rowData.description)
    setUnitPrice(rowData.unitPrice.toString())
    setDiscount(rowData.discount.toString())
    setQuantity(rowData.quantity.toString())
    setEditIndex(index)
  }

  const handleDelete = (index: number) => {
    const updated = products.filter((_, i) => i !== index)
    setProducts(updated)
  }

  const currentSubTotal = () =>
    products.reduce((sum, p) => sum + p.unitPrice * p.quantity * (1 - p.discount / 100), 0)

  const taxAmount = () => (taxEnabled ? (currentSubTotal() * TAX_PERCENTAGE) / 100 : 0)

  const totalAmount = () => currentSubTotal() + taxAmount()

  const handleSaveOrder = async () => {
    if (!selectedSupplier || !selectedBranch || products.length === 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all fields and add at least one product'
      })
      return
    }

    console.log('selectedInitialCategory', selectedInitialCategory)
    // Convert all numbers to string for DB text fields
    console.log('products', products)
    const payload = {
      supplier: selectedSupplier,
      branch: selectedBranch,
      products: products.map((p) => ({
        categoryId: p.category.initialCategoryId,
        description: p.description,
        unitPrice: p.unitPrice.toString(),
        discount: p.discount.toString(),
        quantity: p.quantity.toString(),
        total: p.total.toString()
      })),
      summary: {
        subTotal: currentSubTotal().toString(),
        taxEnabled,
        taxPercentage: (taxEnabled ? TAX_PERCENTAGE : 0).toString(),
        taxAmount: taxAmount().toString(),
        totalAmount: totalAmount().toString()
      },
      creditedDate: creditedDate ? creditedDate.toISOString() : ''
    }

    try {
      const response = await createPurchaseOrder(payload)
      console.log('✅ PO created:', response)
      toast.current?.show({
        severity: 'success',
        summary: 'Saved',
        detail: 'Purchase order saved successfully'
      })
      setIsSaved(true)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save purchase order'
      })
    }
  }

  const handleClear = () => {
    setSelectedSupplier(null)
    setSelectedBranch(null)
    setProducts([])
    setSelectedInitialCategory(null)
    setProductDescription('')
    setUnitPrice('')
    setDiscount('')
    setQuantity('')
    setIsSaved(false)
  }

  const actionBodyTemplate = (rowData: any, { rowIndex }: { rowIndex: number }) => (
    <div className="flex gap-2">
      <Button
        icon={<Edit3 size={16} />}
        rounded
        outlined
        onClick={() => handleEdit(rowData, rowIndex)}
      />
      <Button
        icon={<Trash2 size={16} />}
        rounded
        outlined
        severity="danger"
        onClick={() => handleDelete(rowIndex)}
      />
    </div>
  )

  useEffect(() => {
    if (selectedSupplier && selectedSupplier.creditedDays) {
      const today = new Date()
      const date = new Date(today)
      date.setDate(today.getDate() + selectedSupplier.creditedDays)
      setCreditedDate(date)
    } else {
      setCreditedDate(null)
    }
  }, [selectedSupplier])

  const totalDiscount = () =>
    products.reduce((sum, p) => sum + p.unitPrice * p.quantity * (p.discount / 100), 0)

  return (
    <div>
      <Toast ref={toast} />
      <Tooltip target=".name-tooltip" />

      {/* HEADER */}
      <div className="flex w-full align-items-center justify-content-between">
        <p className="uppercase font-bold">Create New Purchase Order</p>
        <div className="flex gap-2">
          {!isSaved ? (
            <Button
              label="Save Order"
              icon={<Save size={16} />}
              className="p-button-primary gap-2"
              onClick={handleSaveOrder}
            />
          ) : (
            <Button
              label="Clear"
              icon={<X size={16} />}
              className="p-button-secondary gap-2"
              onClick={handleClear}
            />
          )}
          <Button
            label="Download"
            icon={<Download size={16} />}
            className="p-button-outlined gap-2"
            // disabled={!isSaved}
          />
          <Button
            label="Print"
            icon={<Printer size={16} />}
            className="p-button-outlined gap-2"
            // disabled={!isSaved}
          />
        </div>
      </div>

      {/* SUPPLIER & BRANCH */}
      <div className="card shadow-1 p-3 mt-4 flex flex-column">
        <p className="underline uppercase font-semibold">Supplier & Address</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                filter
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.value)}
                options={suppliers}
                optionLabel="supplierCompanyName"
                placeholder="Select Supplier"
                className="w-full"
              />
              <label>From Address</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.value)}
                options={branches}
                optionLabel="refBranchName"
                filter
                placeholder="Select Branch"
                className="w-full"
              />
              <label>To Address</label>
            </FloatLabel>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            {selectedSupplier && (
              <div>
                <p>
                  <strong>{selectedSupplier.supplierCompanyName}</strong>
                </p>
                <p>{`${selectedSupplier.supplierDoorNumber}, ${selectedSupplier.supplierStreet}, ${selectedSupplier.supplierCity}`}</p>
                <p>📞 {selectedSupplier.supplierContactNumber}</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            {selectedBranch && (
              <div>
                <p>
                  <strong>{selectedBranch.refBranchName}</strong>
                </p>
                <p>{selectedBranch.refLocation}</p>
                <p>📞 {selectedBranch.refMobile}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT ENTRY */}
      <div className="card shadow-1 p-3 mt-3">
        <p className="underline font-semibold uppercase">Products</p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <p>Initial Category</p>
            <Dropdown
              value={selectedInitialCategory}
              onChange={(e) => {
                const selected = e.value
                setSelectedInitialCategory(selected)

                // Check for duplicate using category ID
                const existingIndex = products.findIndex(
                  (p) => p.category.initialCategoryId === selected.initialCategoryId
                )

                if (existingIndex !== -1) {
                  const existing = products[existingIndex]
                  setProductDescription(existing.description)
                  setUnitPrice(existing.unitPrice.toString())
                  setDiscount(existing.discount.toString())
                  setQuantity(existing.quantity.toString())
                  setEditIndex(existingIndex)
                  toast.current?.show({
                    severity: 'info',
                    summary: 'Item Exists',
                    detail: 'Item already selected, kindly edit the existing entry'
                  })
                } else {
                  setEditIndex(null)
                }
              }}
              options={initialCategories}
              optionLabel="initialCategoryName"
              placeholder="Select Category"
              className="w-full mt-1"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <p>Product Description</p>
            <InputText
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full mt-1"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <p>Unit Price</p>
            <InputText
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full mt-1"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <p>Discount %</p>
            <InputText
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full mt-1"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <p>Quantity</p>
            <InputText
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mt-1"
            />
          </div>
        </div>

        {/* --- Dynamic total display + Add Product button --- */}
        <div className="flex justify-content-between align-items-center mt-3">
          <div>
            {unitPrice && quantity ? (
              <p className="font-semibold text-lg m-0">
                Current Total:{' '}
                {formatINR(
                  parseFloat(unitPrice || '0') *
                    parseFloat(quantity || '0') *
                    (1 - parseFloat(discount || '0') / 100)
                )}
              </p>
            ) : (
              <p className="text-sm text-secondary m-0">Enter quantity and price to view total</p>
            )}
          </div>

          <Button
            label={editIndex !== null ? 'Update Product' : 'Add Product'}
            icon={<Plus size={16} />}
            onClick={handleAddProduct}
            className="p-button-primary gap-2"
          />
        </div>

        {products.length > 0 && (
          <div className="mt-4">
            <DataTable value={products} ref={dt} showGridlines responsiveLayout="scroll">
              <Column
                header="S.No"
                body={(_, { rowIndex }) => rowIndex + 1}
                style={{ width: '60px', textAlign: 'center' }}
              />

              <Column field="category.initialCategoryName" header="Category" />
              <Column field="description" header="Description" />
              <Column
                field="unitPrice"
                header="Unit Price"
                body={(rowData) => formatINR(rowData.unitPrice)}
              />

              <Column field="discount" header="Discount %" />
              <Column field="quantity" header="Qty" />
              <Column field="total" header="Total" body={(rowData) => formatINR(rowData.total)} />
              <Column header="Actions" body={actionBodyTemplate} />
            </DataTable>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {/* Payment Notes Card */}
        <div className="card shadow-2 p-4 flex-1 min-w-[280px]">
          <div className="flex justify-content-between align-items-center mb-3">
            <p className="text-lg font-semibold m-0">Payment Notes</p>
            <CalendarIcon size={20} className="text-gray-500" />
          </div>
          <div className="mb-2 justify-content-between align-items-center">
            <span className="text-sm text-gray-600">Credited Days:</span>
            <span className="ml-2 font-medium">{selectedSupplier?.creditedDays ?? '-'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Credited Date:</span>
            <Calendar
              value={creditedDate}
              dateFormat="dd-mm-yy"
              showIcon
              className="w-full mt-1"
              placeholder="Select Date"
            />
          </div>
        </div>

        {/* Summary Card */}
        <div className="card shadow-2 p-4 flex-1 min-w-[280px]">
          <p className="text-lg font-semibold mb-3">Summary</p>

          <div className="flex justify-content-between mb-2">
            <span>Sub Total:</span>
            <span className="font-medium">{formatINR(currentSubTotal())}</span>
          </div>

          <div className="flex justify-content-between mb-2">
            <span>Total Discount:</span>
            <span className="font-medium">{formatINR(totalDiscount())}</span>
          </div>

          <div className="flex justify-content-between items-center mb-2">
            <span>Tax {TAX_PERCENTAGE}%:</span>
            <InputSwitch checked={taxEnabled} onChange={(e) => setTaxEnabled(e.value)} />
          </div>

          {taxEnabled && (
            <div className="flex justify-content-between mb-2">
              <span>Tax Amount:</span>
              <span className="font-medium">{formatINR(taxAmount())}</span>
            </div>
          )}

          <div className="flex justify-content-between border-t border-gray-200 pt-2 mt-2 text-lg font-semibold">
            <span>Total Amount:</span>
            <span>{formatINR(totalAmount())}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPurchaseOrderCreation
