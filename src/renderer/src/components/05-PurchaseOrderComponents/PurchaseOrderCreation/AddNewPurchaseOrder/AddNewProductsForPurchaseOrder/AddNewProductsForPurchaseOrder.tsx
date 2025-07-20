import React, { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Category, SubCategory, Branch, Supplier } from '../AddNewPurchaseOrder.interface'
import { Check } from 'lucide-react'
import { formatINRCurrency } from './AddNewProductsForPurchaseOrder.function'

interface Props {
  categories: Category[]
  subCategories: SubCategory[]
  fromAddress: Branch | null
  toAddress: Supplier | null
  onAdd: (data: any) => void
  onClose: () => void
}

const AddNewProductsForPurchaseOrder: React.FC<Props> = ({
  categories,
  subCategories,
  fromAddress,
  toAddress,
  onAdd,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)

  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [hsnCode, setHsnCode] = useState('') // Added HSN Code state
  const total =
    Number(quantity) > 0 && Number(purchasePrice) > 0
      ? Number(quantity) * Number(purchasePrice) - Number(discount || 0)
      : 0

  const toast = useRef<Toast>(null)

  const filteredSubCategories = selectedCategory
    ? subCategories.filter((sub) => sub.refCategoryId === selectedCategory.refCategoryId)
    : []

  console.log('toAddress', toAddress)
  console.log('fromAddress', fromAddress)
  const handleAdd = () => {
    if (!fromAddress || !toAddress) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please select the From and To address first.',
        life: 3000
      })
      return
    }

    const quantityNum = Number(quantity)
    const priceNum = Number(purchasePrice)
    const discountNum = Number(discount || 0)

    if (
      !selectedCategory ||
      !selectedSubCategory ||
      !productName.trim() ||
      !quantity ||
      !purchasePrice ||
      isNaN(quantityNum) ||
      isNaN(priceNum) ||
      quantityNum <= 0 ||
      priceNum <= 0 ||
      discountNum < 0
    ) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation',
        detail:
          'Please fill all fields correctly. Quantity and price should be > 0. Discount should be ≥ 0.',
        life: 4000
      })
      return
    }

    const newItem = {
      productName,
      quantity: quantityNum,
      purchasePrice: priceNum,
      discount: discountNum,
      total,
      hsnCode,
      pricePerUnit: priceNum,
      category: selectedCategory?.categoryName || '',
      subCategory: selectedSubCategory?.subCategoryName || ''
    }

    onAdd(newItem)

    // Reset fields
    setProductName('')
    setQuantity('')
    setPurchasePrice('')
    setDiscount('')
    setHsnCode('')
    setSelectedCategory(null)
    setSelectedSubCategory(null)
  }

  return (
    <div className="flex flex-column gap-3">
      <Toast ref={toast} />

      {/* From and To Details */}
      <div className="grid mb-2">
        {/* Branch Details */}
        <div className="col-6 p-3 surface-100">
          <p className="mb-3">Branch Details</p>
          <div>
            <strong>Name:</strong> {fromAddress?.refBranchName || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {fromAddress?.refEmail || 'N/A'}
          </div>
          <div>
            <strong>Mobile:</strong> {fromAddress?.refMobile || 'N/A'}
          </div>
          <div>
            <strong>Location:</strong> {fromAddress?.refLocation || 'N/A'}
          </div>
          <div>
            <strong>Branch Code:</strong> {fromAddress?.refBranchCode || 'N/A'}
          </div>
          <div>
            <strong>Type:</strong> {fromAddress?.isMainBranch ? 'Main Branch' : 'Sub Branch'}
          </div>
        </div>
        {/* Supplier Details */}
        <div className="col-6 p-3 surface-100">
          <p className="mb-3">Supplier Details</p>
          <div>
            <strong>Company Name:</strong> {toAddress?.supplierCompanyName || 'N/A'}
          </div>
          <div>
            <strong>Contact Name:</strong> {toAddress?.supplierName || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {toAddress?.supplierEmail || 'N/A'}
          </div>
          <div>
            <strong>Mobile:</strong> {toAddress?.supplierContactNumber || 'N/A'}
          </div>
          <div>
            <strong>Address:</strong>
            {`${toAddress?.supplierDoorNumber || ''}, ${toAddress?.supplierStreet || ''}, ${toAddress?.supplierCity || ''}, ${toAddress?.supplierState || ''}, ${toAddress?.supplierCountry || ''}`}
          </div>
          <div>
            <strong>UPI:</strong> {toAddress?.supplierUPI || 'N/A'}
          </div>
          <div>
            <strong>GST No:</strong> {toAddress?.supplierGSTNumber || 'N/A'}
          </div>
          <div>
            <strong>Bank:</strong>{' '}
            {`${toAddress?.supplierBankName || ''} - ${toAddress?.supplierBankACNumber || ''}`}
          </div>
          <div>
            <strong>IFSC:</strong> {toAddress?.supplierIFSC || 'N/A'}
          </div>
        </div>
      </div>

      {/* Category, Subcategory, Product Name */}
      <div className="flex gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.value)
                setSelectedSubCategory(null)
              }}
              options={categories}
              optionLabel="categoryName"
              placeholder="Select Category"
              className="w-full"
            />
            <label htmlFor="category">Category</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="subCategory"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.value)}
              options={filteredSubCategories}
              optionLabel="subCategoryName"
              placeholder={selectedCategory ? 'Select Sub Category' : 'Select Category First'}
              className="w-full"
              disabled={!selectedCategory}
              emptyMessage="No Sub Category Found"
            />
            <label htmlFor="subCategory">Sub-Category</label>
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

      {/* HSN, Quantity, Price */}
      <div className="flex gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="hsnCode"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="hsnCode">HSN Code</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="quantity"
              keyfilter="int"
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
              keyfilter="num"
              value={formatINRCurrency(purchasePrice)}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full"
            />
            <label htmlFor="purchasePrice">Purchase Price</label>
          </FloatLabel>
        </div>
      </div>

      {/* Discount, Discount Price, Total */}
      <div className="flex gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="discount"
              keyfilter="num"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full"
            />
            <label htmlFor="discount">Discount %</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="discountPrice"
              value={formatINRCurrency(Number(discount || 0))}
              disabled
              className="w-full"
            />
            <label htmlFor="discountPrice">Discount Price</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText id="total" value={formatINRCurrency(total)} disabled className="w-full" />
            <label htmlFor="total">Total</label>
          </FloatLabel>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-content-end gap-2 mt-3">
        <Button label="Close" severity="secondary" onClick={onClose} />
        <Button label="Add" icon={<Check size={20} />} className="gap-2" onClick={handleAdd} />
      </div>
    </div>
  )
}

export default AddNewProductsForPurchaseOrder
