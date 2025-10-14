import React, { useState, useRef, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Category, SubCategory, Branch, Supplier } from '../AddNewPurchaseOrder.interface'
import { Check, Plus } from 'lucide-react'
import { formatINRCurrency } from './AddNewProductsForPurchaseOrder.function'
import { Message } from 'primereact/message'
import { InputNumber } from 'primereact/inputnumber'

interface Props {
  categories: Category[]
  subCategories: SubCategory[]
  fromAddress: Branch | null
  toAddress: Supplier | null
  onAdd: (data: any) => void
  onClose: () => void
  editItem?: any // Add this
  existingProducts: any[]
}

const AddNewProductsForPurchaseOrder: React.FC<Props> = ({
  categories,
  subCategories,
  fromAddress,
  toAddress,
  onAdd,
  onClose,
  editItem,
  existingProducts
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)

  const [existingMatch, setExistingMatch] = useState<any | null>(null)
  const [showInfoMessage, setShowInfoMessage] = useState(false)

  const [productDescription, setProductDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState<number>()
  const [discount, setDiscount] = useState('')
  const [hsnCode, setHsnCode] = useState('') // Added HSN Code state
  const total =
    Number(quantity) > 0 && Number(purchasePrice) > 0
      ? Number(quantity) * Number(purchasePrice) * (1 - Number(discount || 0) / 100)
      : 0

  const toast = useRef<Toast>(null)

  const filteredSubCategories = selectedCategory
    ? subCategories.filter((sub) => sub.refCategoryId === selectedCategory.refCategoryId)
    : []

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
      !productDescription.trim() ||
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
      productDescription: '-',
      quantity: quantityNum,
      purchasePrice: priceNum,
      discount: discountNum,
      total,
      hsnCode,
      pricePerUnit: priceNum,
      discountPrice: (priceNum * discountNum) / 100,
      category: selectedCategory?.categoryName || '',
      subCategory: selectedSubCategory?.subCategoryName || '',
      refCategoryId: selectedCategory?.refCategoryId, // ← Include category ID
      refSubCategoryId: selectedSubCategory?.refSubCategoryId // ← Include subcategory ID
    }

    onAdd(newItem)

    // Reset fields
    setProductDescription('')
    setQuantity('')
    setPurchasePrice('')
    setDiscount('')
    setHsnCode('')
    setSelectedCategory(null)
    setSelectedSubCategory(null)
  }
  useEffect(() => {
    if (editItem) {
      setSelectedCategory(
        categories.find((cat) => cat.refCategoryId === editItem.refCategoryId) || null
      )
      setSelectedSubCategory(
        subCategories.find((sub) => sub.refSubCategoryId === editItem.refSubCategoryId) || null
      )
      // setProductDescription(editItem.productName || '')
      setQuantity(editItem.quantity?.toString() || '')
      setPurchasePrice(editItem.purchasePrice?.toString() || '')
      setDiscount(editItem.discount?.toString() || '')
      setHsnCode(editItem.hsnCode || '')
    }
  }, [editItem, categories, subCategories])

  useEffect(() => {
    if (selectedCategory && selectedSubCategory) {
      const match = existingProducts.find(
        (item) =>
          item.refCategoryId === selectedCategory.refCategoryId &&
          item.refSubCategoryId === selectedSubCategory.refSubCategoryId
      )

      if (match) {
        setExistingMatch(match)
        setQuantity(match.quantity.toString())
        setPurchasePrice(match.purchasePrice.toString())
        setDiscount(match.discount.toString())
        setHsnCode(match.hsnCode || '')
        setShowInfoMessage(true)
      } else {
        setExistingMatch(null)
        setShowInfoMessage(false)
      }
    }
  }, [selectedCategory, selectedSubCategory, existingProducts])

  return (
    <div className="flex flex-column gap-3">
      <Toast ref={toast} />

      {/* From and To Details */}
      <div className="grid">
        {/* Branch Details */}
        <div className="col-6 p-3 surface-100 text-sm">
          <p className="font-bold uppercase underline">Branch Details</p>
          <div>
            <strong>Name:</strong> {fromAddress?.refBranchName || 'N/A'}
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
        </div>
        {/* Supplier Details */}
        <div className="col-6 p-3 surface-100 text-sm">
          <p className="font-bold uppercase underline">Supplier Details</p>
          <div>
            <strong>Company Name:</strong> {toAddress?.supplierCompanyName || 'N/A'}
          </div>
          <div>
            <strong>Contact Name:</strong> {toAddress?.supplierName || 'N/A'}
          </div>
          <div>
            <strong>Mobile:</strong> {toAddress?.supplierContactNumber || 'N/A'}
          </div>
          <div>
            <strong>Address:</strong>
            {`${toAddress?.supplierDoorNumber || ''}, ${toAddress?.supplierStreet || ''}, ${toAddress?.supplierCity || ''}, ${toAddress?.supplierState || ''}, ${toAddress?.supplierCountry || ''}`}
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-content-end mb-3">
        <Button label="Add Category" icon={<Plus size={16} />} className="gap-2" />
        <Button
          label="Add Sub Category"
          icon={<Plus size={16} />}
          className="gap-2"
          severity="info"
        />
      </div>

      {showInfoMessage && existingMatch && (
        <Message
          severity="info"
          text={`Product already exists with quantity ${existingMatch.quantity}.`}
          className="w-full"
        />
      )}
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

          {selectedCategory && filteredSubCategories.length === 0 && (
            <small className="text-sm text-color-danger">
              <p className="mt-1">No sub category was found.</p>
            </small>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="hsnCode"
              value={productDescription}
              onChange={(e) => {
                const rawValue = e.target.value
                console.log('rawValue', rawValue)
                setProductDescription(rawValue)
              }}
              className="w-full"
            />

            <label htmlFor="hsnCode">Product Description</label>
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
              onChange={(e) => {
                const rawValue = e.target.value
                const filtered = rawValue.replace(/[^a-zA-Z0-9]/g, '')
                setHsnCode(filtered.toUpperCase())
              }}
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
            <InputNumber
              id="purchasePrice"
              keyfilter="num"
              value={purchasePrice}
              mode="currency"
              currency="INR"
              currencyDisplay="symbol"
              locale="en-IN"
              onValueChange={(e) => setPurchasePrice(e.value)}
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
              value={formatINRCurrency((Number(purchasePrice) * Number(discount || 0)) / 100)}
              disabled
              className="w-full"
            />
            <label htmlFor="discountPrice">Discount Price (Per Unit)</label>
          </FloatLabel>
          <small className="text-sm text-color-secondary pt-2">
            <p className="mt-1">
              Total Discount:{' '}
              {formatINRCurrency(
                (Number(purchasePrice) * Number(discount || 0) * Number(quantity || 0)) / 100
              )}
            </p>
          </small>
        </div>

        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText id="total" value={formatINRCurrency(total)} disabled className="w-full" />
            <label htmlFor="total">Total</label>
          </FloatLabel>
          <small className="text-sm text-color-secondary pt-2">
            <p className="mt-1">
              Total: ({quantity} × {formatINRCurrency(purchasePrice)}) –{' '}
              {formatINRCurrency(
                (Number(purchasePrice) * Number(discount || 0) * Number(quantity || 0)) / 100
              )}{' '}
              = <strong>{formatINRCurrency(total)}</strong>
            </p>
          </small>
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
