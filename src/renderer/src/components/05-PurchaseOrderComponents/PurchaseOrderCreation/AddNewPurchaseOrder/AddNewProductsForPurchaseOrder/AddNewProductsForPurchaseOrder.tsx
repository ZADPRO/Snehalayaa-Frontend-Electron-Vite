import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Category, SubCategory, Branch, Supplier } from '../AddNewPurchaseOrder.interface'

interface Props {
  categories: Category[]
  subCategories: SubCategory[]
  fromAddress: Branch | null
  toAddress: Supplier | null
  onAdd: (data: any) => void
}

const AddNewProductsForPurchaseOrder: React.FC<Props> = ({
  categories,
  subCategories,
  fromAddress,
  toAddress,
  onAdd
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)

  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [discount, setDiscount] = useState('')

  console.log('subCategories', subCategories)
  console.log('selectedCategory', selectedCategory)
  const filteredSubCategories = selectedCategory
    ? subCategories.filter((sub) => sub.refCategoryId === selectedCategory.refCategoryId)
    : []

  const handleAdd = () => {
    const total = Number(quantity) * Number(purchasePrice) - Number(discount || 0)
    const newItem = {
      productName,
      quantity,
      purchasePrice,
      discount,
      total,
      pricePerUnit: purchasePrice,
      category: selectedCategory?.categoryName || '',
      subCategory: selectedSubCategory?.subCategoryName || ''
    }
    onAdd(newItem)

    // Reset fields
    setProductName('')
    setQuantity('')
    setPurchasePrice('')
    setDiscount('')
    setSelectedCategory(null)
    setSelectedSubCategory(null)
  }

  return (
    <div className="flex flex-column gap-3">
      <div className="mb-2">
        <strong>From:</strong> {fromAddress?.refBranchName || 'N/A'}
        <br />
        <strong>To:</strong> {toAddress?.supplierCompanyName || 'N/A'}
      </div>

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

      <div className="flex gap-3">
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

      <div className="flex justify-content-end mt-3">
        <Button label="Add" onClick={handleAdd} />
      </div>
    </div>
  )
}

export default AddNewProductsForPurchaseOrder
