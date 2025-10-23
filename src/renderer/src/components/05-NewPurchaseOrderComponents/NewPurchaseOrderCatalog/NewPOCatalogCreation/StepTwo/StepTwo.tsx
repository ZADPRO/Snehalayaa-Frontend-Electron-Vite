import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { FloatLabel } from 'primereact/floatlabel'
import { Plus, Check } from 'lucide-react'
import { fetchCategories, fetchSubCategories } from '../NewPOCatalogCreation.function'
import { Category, SubCategory, TableRow, DialogRow } from '../NewPOCatalogCreation.interface'

interface StepTwoProps {
  purchaseOrder: any
}

const StepTwo: React.FC<StepTwoProps> = ({ purchaseOrder }) => {
  const toast = useRef<Toast>(null)
  const [rows, setRows] = useState<TableRow[]>([])
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editingRow, setEditingRow] = useState<TableRow | null>(null)

  const [categoryOptions, setCategoryOptions] = useState<Category[]>([])
  const [subCategoryOptions, setSubCategoryOptions] = useState<SubCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)

  const [lineNumber, setLineNumber] = useState<number>(1)
  const [quantity, setQuantity] = useState<number>(1)
  const [productName, setProductName] = useState<string>('')
  const [brand, setBrand] = useState<string>('Snehalayaa')
  const [taxClass, setTaxClass] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [mrp, setMrp] = useState<number>(0)
  const [cost, setCost] = useState<number>(0)
  const [profitMargin, setProfitMargin] = useState<number>(0)
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [discountPrice, setDiscountPrice] = useState<number>(0)
  const [dialogRows, setDialogRows] = useState<DialogRow[]>([])

  const acceptedTotal = Number(purchaseOrder.accepted_products[0]?.accepted_total || 0)

  useEffect(() => {
    const loadOptions = async () => {
      const categories = await fetchCategories()
      const subCategories = await fetchSubCategories()
      setCategoryOptions(categories)
      setSubCategoryOptions(subCategories)
    }
    loadOptions()
  }, [])

  useEffect(() => {
    const sp = cost + (cost * profitMargin) / 100
    setSellingPrice(Number(sp.toFixed(2)))
    setMrp(Number(sp.toFixed(2)))
  }, [cost, profitMargin])

  // Discount price auto-calculation both ways
  useEffect(() => {
    if (discountPercent > 0 && cost > 0) {
      const discounted = cost - (cost * discountPercent) / 100
      setDiscountPrice(Number(discounted.toFixed(2)))
    }
  }, [discountPercent])

  useEffect(() => {
    if (discountPrice > 0 && cost > 0 && discountPrice < cost) {
      const percent = ((cost - discountPrice) / cost) * 100
      setDiscountPercent(Number(percent.toFixed(2)))
    }
  }, [discountPrice])

  useEffect(() => {
    const storedData = localStorage.getItem(`po_${purchaseOrder.purchase_order_id}`)
    if (storedData) {
      setRows(JSON.parse(storedData))
    }
  }, [purchaseOrder.purchase_order_id])

  const filteredSubCategories = selectedCategory
    ? subCategoryOptions.filter((sub) => sub.refCategoryId === selectedCategory.refCategoryId)
    : []

  const remainingQuantity =
    acceptedTotal - rows.reduce((sum, r) => sum + r.quantity, 0) + (editingRow?.quantity || 0)

  const generateSKU = (index: number): string => {
    const now = new Date()
    const datePart = `${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`
    const serial = String(index + 1).padStart(3, '0')
    return `SS${datePart}${serial}`
  }

  const openAddDialog = () => {
    const remainingQty = acceptedTotal - rows.reduce((sum, r) => sum + r.quantity, 0)
    if (remainingQty <= 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Quantity Left',
        detail: 'No quantity left for GRN'
      })
      return
    }

    setEditingRow(null)
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setLineNumber(rows.length + 1)
    setQuantity(1)
    setProductName('')
    setBrand('Snehalayaa')
    setTaxClass('')
    setPrice(0)
    setCost(0)
    setProfitMargin(0)
    setSellingPrice(0)
    setDiscountPercent(0)
    setDiscountPrice(0)
    setDialogRows([])
    setDialogVisible(true)
  }

  const openEditDialog = (row: TableRow) => {
    setEditingRow(row)
    setSelectedCategory(row.category)
    setSelectedSubCategory(row.subCategory)
    setLineNumber(row.lineNumber)
    setQuantity(row.quantity)
    setProductName(row.productName)
    setBrand(row.brand)
    setTaxClass(row.taxClass)
    setPrice(row.price)
    setCost(row.cost)
    setProfitMargin(row.profitMargin)
    setSellingPrice(row.sellingPrice)
    setDialogRows(row.dialogRows)
    setDialogVisible(true)
  }

  const generateDialogRows = (qty: number) => {
    const newRows: DialogRow[] = []
    for (let i = 0; i < qty; i++) {
      newRows.push({
        id: Date.now() + i,
        sNo: i + 1,
        lineNumber,
        referenceNumber: '',
        productDescription: '',
        discount: discountPercent,
        price: cost,
        discountPrice: discountPrice,
        margin: profitMargin,
        totalAmount: ((discountPrice || cost) * (1 + profitMargin / 100)).toFixed(2)
      })
    }
    setDialogRows(newRows)
  }

  const handleDialogRowChange = (index: number, field: keyof DialogRow, value: number | string) => {
    const updated = [...dialogRows]
    const row = { ...updated[index], [field]: value }

    let price = Number(row.price)
    let discount = Number(row.discount)
    let dPrice = Number(row.discountPrice)
    let margin = Number(row.margin)

    if (field === 'discount') {
      dPrice = price - (price * discount) / 100
      row.discountPrice = Number(dPrice.toFixed(2))
    } else if (field === 'discountPrice') {
      discount = ((price - dPrice) / price) * 100
      row.discount = Number(discount.toFixed(2))
    }

    row.totalAmount = ((dPrice || price) * (1 + margin / 100)).toFixed(2)
    updated[index] = row
    setDialogRows(updated)
  }

  const handleQuantityChange = (value: number) => {
    if (value > remainingQuantity) value = remainingQuantity
    setQuantity(value)
    generateDialogRows(value)
  }

  const saveRow = () => {
    if (!selectedCategory || !selectedSubCategory) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Select category and sub-category'
      })
      return
    }

    const dialogRowsWithSKU = dialogRows.map((r, i) => ({ ...r, sku: generateSKU(i) }))
    const newRow: TableRow = {
      id: editingRow ? editingRow.id : Date.now(),
      sNo: editingRow ? editingRow.sNo : rows.length + 1,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      lineNumber,
      quantity,
      productName,
      brand,
      taxClass,
      price,
      mrp,
      cost,
      profitMargin,
      sellingPrice,
      dialogRows: dialogRowsWithSKU
    }

    const updatedRows = editingRow
      ? rows.map((r) => (r.id === editingRow.id ? newRow : r))
      : [...rows, newRow]

    setRows(updatedRows)
    localStorage.setItem(`po_${purchaseOrder.purchase_order_id}`, JSON.stringify(updatedRows))
    setDialogVisible(false)
    toast.current?.show({ severity: 'success', summary: 'Saved', detail: 'Row saved successfully' })
  }

  // Enter key navigation (→, ↓ next row)
  const handleEnterKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    console.log('colIndex', colIndex)
    console.log('rowIndex', rowIndex)
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputs = document.querySelectorAll('input, .p-inputnumber-input')
      const currentIndex = Array.from(inputs).indexOf(e.currentTarget)
      const nextInput = inputs[currentIndex + 1]
      if (nextInput) (nextInput as HTMLElement).focus()
    }
  }

  return (
    <div>
      <Toast ref={toast} />

      <div className="flex gap-3 justify-end mb-3">
        <Button label="Add Product" icon={<Plus size={18} />} onClick={openAddDialog} />
        <Button
          label="Save All"
          icon={<Check size={18} />}
          onClick={() =>
            toast.current?.show({
              severity: 'success',
              summary: 'Saved',
              detail: 'All rows saved successfully'
            })
          }
        />
      </div>

      <DataTable value={rows} responsiveLayout="scroll" showGridlines rowHover>
        <Column field="sNo" header="S.No." />
        <Column field="lineNumber" header="Line No." />
        <Column field="category.categoryName" header="Category" />
        <Column field="subCategory.subCategoryName" header="Sub Category" />
        <Column field="productName" header="Product" />
        <Column field="quantity" header="Qty" />
        <Column field="cost" header="Cost" />
        <Column field="profitMargin" header="Profit %" />
        <Column field="sellingPrice" header="Selling Price" />
      </DataTable>

      <Dialog
        header={editingRow ? 'Edit Product' : 'Add Product'}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: '95vw', height: '95vh' }}
        footer={
          <div className="flex justify-end">
            <Button label="Save" icon={<Check size={18} />} className="gap-3" onClick={saveRow} />
          </div>
        }
      >
        {/* Category Row */}
        <div className="flex gap-3 mt-3">
          <FloatLabel className="flex-1 always-float">
            <Dropdown
              value={selectedCategory}
              options={categoryOptions}
              optionLabel="categoryName"
              onChange={(e) => {
                setSelectedCategory(e.value)
                setSelectedSubCategory(null)
              }}
              className="w-full"
            />
            <label>Category</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <Dropdown
              value={selectedSubCategory}
              options={filteredSubCategories}
              optionLabel="subCategoryName"
              onChange={(e) => setSelectedSubCategory(e.value)}
              className="w-full"
              disabled={!selectedCategory}
            />
            <label>Sub Category</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <InputNumber
              value={lineNumber}
              onValueChange={(e) => setLineNumber(e.value || 1)}
              className="w-full"
            />
            <label>Line No.</label>
          </FloatLabel>
        </div>

        {/* Product Info */}
        <div className="flex gap-3 mt-3">
          <FloatLabel className="flex-1 always-float">
            <InputText
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full"
            />
            <label>Product</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <InputText
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full"
            />
            <label>Brand</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <InputText
              value={taxClass}
              onChange={(e) => setTaxClass(e.target.value)}
              className="w-full"
            />
            <label>Tax Class</label>
          </FloatLabel>
        </div>

        {/* Pricing Row */}
        <div className="flex gap-3 mt-3">
          <FloatLabel className="flex-1 always-float">
            <InputNumber
              value={cost}
              onValueChange={(e) => setCost(e.value || 0)}
              min={0}
              className="w-full"
            />
            <label>Cost</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <InputNumber
              value={profitMargin}
              onValueChange={(e) => setProfitMargin(e.value || 0)}
              min={0}
              max={100}
              className="w-full"
            />
            <label>Profit %</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <InputNumber value={sellingPrice} disabled className="w-full" />
            <label>Selling Price</label>
          </FloatLabel>
        </div>

        {/* Quantity + Discount */}
        <div className="flex gap-3 mt-3">
          <FloatLabel className="flex-1 always-float">
            <InputNumber
              value={quantity}
              className="w-full"
              onValueChange={(e) => handleQuantityChange(e.value || 0)}
              min={0}
              max={remainingQuantity}
            />
            <label>Quantity</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <InputNumber
              value={discountPercent}
              className="w-full"
              onValueChange={(e) => setDiscountPercent(e.value || 0)}
              min={0}
              max={100}
            />
            <label>Discount %</label>
          </FloatLabel>

          <FloatLabel className="flex-1 always-float">
            <InputNumber
              value={discountPrice}
              className="w-full"
              onValueChange={(e) => setDiscountPrice(e.value || 0)}
              min={0}
            />
            <label>Discount Price</label>
          </FloatLabel>
        </div>

        {/* Dialog Table */}
        <div className="mt-4 px-3" style={{ maxHeight: '400px' }}>
          <div className="grid grid-cols-8 gap-3 font-bold border-b pb-2 text-center">
            <div>S.No</div>
            <div>Line Item</div>
            <div>Ref No</div>
            <div>Description</div>
            <div>Discount %</div>
            <div>Discount Price</div>
            <div>Price</div>
            <div>Total</div>
          </div>
          {dialogRows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-8 gap-3 mt-2 align-items-center">
              <div className="text-center">{row.sNo}</div>

              <InputNumber
                value={row.lineNumber}
                onValueChange={(e) => handleDialogRowChange(i, 'lineNumber', e.value || 0)}
                onKeyDown={(e) => handleEnterKey(e, i, 1)}
              />

              <InputText
                value={row.referenceNumber}
                onChange={(e) => handleDialogRowChange(i, 'referenceNumber', e.target.value)}
                onKeyDown={(e) => handleEnterKey(e, i, 2)}
              />

              <InputText
                value={row.productDescription}
                onChange={(e) => handleDialogRowChange(i, 'productDescription', e.target.value)}
                onKeyDown={(e) => handleEnterKey(e, i, 3)}
              />

              <InputNumber
                value={row.discount}
                onValueChange={(e) => handleDialogRowChange(i, 'discount', e.value || 0)}
                min={0}
                max={100}
                onKeyDown={(e) => handleEnterKey(e, i, 4)}
              />

              <InputNumber
                value={row.discountPrice}
                onValueChange={(e) => handleDialogRowChange(i, 'discountPrice', e.value || 0)}
                onKeyDown={(e) => handleEnterKey(e, i, 5)}
              />

              <InputNumber
                value={row.price}
                onValueChange={(e) => handleDialogRowChange(i, 'price', e.value || 0)}
                onKeyDown={(e) => handleEnterKey(e, i, 6)}
              />

              <InputNumber
                value={Number(row.totalAmount)}
                onValueChange={(e) => handleDialogRowChange(i, 'totalAmount', e.value || 0)}
                onKeyDown={(e) => handleEnterKey(e, i, 7)}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  )
}

export default StepTwo
