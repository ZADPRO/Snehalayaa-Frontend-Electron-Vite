import React, { useState, useRef, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Category, SubCategory, Branch } from '../InventoryCreateNewStock.interface'
import { Check } from 'lucide-react'
import { fetchProducts, formatINRCurrency } from './InventoryCreateNewProductForStock.function'
import { Products } from './InventoryCreateNewProductForStock.interface'

interface Props {
  categories: Category[]
  subCategories: SubCategory[]
  fromAddress: Branch | null
  toAddress: Branch | null
  onAdd: (data: any) => void
  onClose: () => void
  productToEdit?: any // <-- add this line (optional)
}

const InventoryCreateNewProductForStock: React.FC<Props> = ({
  categories,
  subCategories,
  fromAddress,
  toAddress,
  onAdd,
  onClose,
  productToEdit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Products | null>(null)
  const [productOptions, setProductOptions] = useState<Products[]>([])

  const [productName, setProductName] = useState('')
  const [productId, setProductId] = useState(0)
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [hsnCode, setHsnCode] = useState('') // Added HSN Code state
  const [poSKU, setpoSKU] = useState('') // Added HSN Code state
  const total =
    Number(quantity) > 0 && Number(purchasePrice) > 0
      ? Number(quantity) * Number(purchasePrice) - Number(discount || 0)
      : 0

  const toast = useRef<Toast>(null)

  const filteredSubCategories = selectedCategory
    ? subCategories.filter((sub) => sub.refCategoryId === selectedCategory.refCategoryId)
    : []

  const filteredProducts = productOptions.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.refCategoryId === selectedCategory.refCategoryId
      : true
    const matchesSubCategory = selectedSubCategory
      ? product.refSubCategoryId === selectedSubCategory.refSubCategoryId
      : true
    return matchesCategory && matchesSubCategory
  })
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchProducts()
        console.log('fetchProducts', fetchProducts)
        setProductOptions(result)
      } catch (err: any) {
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to load products',
          detail: err.message,
          life: 3000
        })
      }
    }

    loadProducts()
  }, [])

//   useEffect(() => {
//     // Prefill form fields if editing an existing product
//     if (productToEdit) {
//       console.log('productToEdit', productToEdit)
//       //   setProductName(productToEdit.productId || null)
//       setQuantity(productToEdit.quantity?.toString() || '')
//       setPurchasePrice(productToEdit.purchasePrice?.toString() || '')
//       setDiscount(productToEdit.discount?.toString() || '')
//       setHsnCode(productToEdit.hsnCode || '')

//       // Set category/subcategory objects
//       if (productToEdit.refCategoryId) {
//         const cat = categories.find((c) => c.refCategoryId === productToEdit.refCategoryId) || null
//         setSelectedCategory(cat)
//       }
//       if (productToEdit.refSubCategoryId) {
//         const subCat =
//           subCategories.find((sc) => sc.refSubCategoryId === productToEdit.refSubCategoryId) || null
//         setSelectedSubCategory(subCat)
//       }

//       if (productToEdit.productId) {
//         const product = filteredProducts.find((p) => p.refPtId === productToEdit.productId) || null
//         console.log('product', product)
//         setSelectedProducts(product)
//       }

//       // Set selected product, if your products have refPtId
//       if (productToEdit.refPtId) {
//         const p = productOptions.find((po) => po.refPtId === productToEdit.refPtId) || null
//         setSelectedProducts(p)
//       }
//     } else {
//       // Reset fields when not editing (optional, for clean add form)
//       setProductName('')
//       setQuantity('')
//       setPurchasePrice('')
//       setDiscount('')
//       setHsnCode('')
//       setSelectedCategory(null)
//       setSelectedSubCategory(null)
//       setSelectedProducts(null)
//     }
//   }, [productToEdit, categories, subCategories, productOptions])


useEffect(() => {
  if (productToEdit) {
    console.log('productToEdit', productToEdit)

    setQuantity(productToEdit.quantity?.toString() || '')
    setPurchasePrice(productToEdit.purchasePrice?.toString() || '')
    setDiscount(productToEdit.discount?.toString() || '')
    setHsnCode(productToEdit.hsnCode || '')
    setpoSKU(productToEdit.poSKU || '')

    // Set category/subcategory
    const cat = categories.find((c) => c.refCategoryId === productToEdit.refCategoryId) || null
    setSelectedCategory(cat)

    const subCat = subCategories.find((sc) => sc.refSubCategoryId === productToEdit.refSubCategoryId) || null
    setSelectedSubCategory(subCat)

    // Find the product
    const product = productOptions.find((po) => po.refPtId === productToEdit.productId) || null
    if (product) {
      setSelectedProducts(product)
      setProductName(product.poName ?? '')
      setProductId(product.refPtId) // ✅ important to avoid validation fail
    }
  } else {
    setProductName('')
    setQuantity('')
    setPurchasePrice('')
    setDiscount('')
    setHsnCode('')
    setpoSKU('')
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setSelectedProducts(null)
    setProductId(0) // reset productId when not editing
  }
}, [productToEdit, categories, subCategories, productOptions])

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
      discountNum < 0 ||
      productId == 0
    ) {
      console.log('priceNum', priceNum)
      console.log('selectedSubCategory', selectedSubCategory)
      console.log('selectedCategory', selectedCategory)
      console.log('discountNum', discountNum)
      console.log('quantity', quantity)
      console.log('quantityNum', quantityNum)
      console.log('purchasePrice', purchasePrice)
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
      productId,
      quantity: quantityNum,
      purchasePrice: priceNum,
      discount: discountNum,
      total,
      hsnCode,
      poSKU,
      pricePerUnit: priceNum,
      discountPrice: (priceNum * discountNum) / 100,
      category: selectedCategory?.categoryName || '',
      subCategory: selectedSubCategory?.subCategoryName || '',
      refCategoryId: selectedCategory?.refCategoryId,
      refSubCategoryId: selectedSubCategory?.refSubCategoryId
    }
    console.log('newItem', newItem)

    onAdd(newItem)

    // Reset fields
    setProductName('')
    setQuantity('')
    setPurchasePrice('')
    setDiscount('')
    setHsnCode('')
    setpoSKU('')
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setSelectedProducts(null)
    console.log('setSelectedSubCategory', setSelectedSubCategory)
  }

  return (
    <div className="flex flex-column gap-3">
      <Toast ref={toast} />

      {/* From and To Details */}
      <div className="grid mb-2">
        {/* Branch Details */}
        <div className="col-6 p-3 surface-100">
          <p className="mb-3">From Branch Details</p>
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
          <p className="mb-3">To Branch Details</p>

          <div>
            <strong>Name:</strong> {toAddress?.refBranchName || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {toAddress?.refEmail || 'N/A'}
          </div>
          <div>
            <strong>Mobile:</strong> {toAddress?.refMobile || 'N/A'}
          </div>
          <div>
            <strong>Location:</strong> {toAddress?.refLocation || 'N/A'}
          </div>
          <div>
            <strong>Branch Code:</strong> {toAddress?.refBranchCode || 'N/A'}
          </div>
          <div>
            <strong>Type:</strong> {toAddress?.isMainBranch ? 'Main Branch' : 'Sub Branch'}
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
              value={selectedSubCategory?.refSubCategoryId || null}
              onChange={(e) => {
                const sub = filteredSubCategories.find((sc) => sc.refSubCategoryId === e.value)
                setSelectedSubCategory(sub || null)
              }}
              options={filteredSubCategories}
              optionLabel="subCategoryName"
              optionValue="refSubCategoryId"
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
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="product"
              value={selectedProducts}
              options={filteredProducts}
              onChange={(e) => {
                const product = e.value as Products
                setSelectedProducts(product)
                setProductId(product.refPtId)

                setProductName(product.poName ?? '')
                setHsnCode(product.poHSN || '')
                setpoSKU(product.poSKU || '')
                setPurchasePrice(product.poPrice?.toString() || '')
                setDiscount(product.poDiscPercent?.toString() || '')
              }}
              optionLabel="poName"
              placeholder="Select Product"
              className="w-full"
              emptyMessage="No products found"
            />

            <label htmlFor="product">Product</label>
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
              id="skuCode"
              value={poSKU}
              onChange={(e) => {
                const rawValue = e.target.value
                const filtered = rawValue.replace(/[^a-zA-Z0-9]/g, '')
                setpoSKU(filtered.toUpperCase())
              }}
              className="w-full"
            />

            <label htmlFor="skuCode">SKU Code</label>
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
              value={purchasePrice}
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
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-content-end gap-2 mt-3">
        <Button label="Close" severity="secondary" onClick={onClose} />
        <Button
          label={productToEdit ? 'Update' : 'Add'}
          icon={<Check size={20} />}
          className="gap-2"
          onClick={handleAdd}
        />
      </div>
    </div>
  )
}

export default InventoryCreateNewProductForStock
