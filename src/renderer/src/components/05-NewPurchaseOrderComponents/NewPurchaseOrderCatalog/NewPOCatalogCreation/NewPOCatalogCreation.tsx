import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { FloatLabel } from 'primereact/floatlabel'
import { fetchCategories, fetchSubCategories } from './NewPOCatalogCreation.function'
import { Category, SubCategory, Props, DialogRow } from './NewPOCatalogCreation.interface'
import { Plus, Check } from 'lucide-react'

interface TableRow {
  id: number
  sNo: number
  category: Category | null
  subCategory: SubCategory | null
  lineNumber: number
  quantity: number
  productName: string
  brand: string
  taxClass: string
  price: number
  mrp: number
  cost: number
  profitMargin: number
  sellingPrice: number
  dialogRows: DialogRow[]
}

const NewPOCatalogCreation: React.FC<Props> = ({ purchaseOrder }) => {
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
  const [brand, setBrand] = useState<string>('')
  const [taxClass, setTaxClass] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [mrp, setMrp] = useState<number>(0)
  const [cost, setCost] = useState<number>(0)
  const [profitMargin, setProfitMargin] = useState<number>(0)
  const [sellingPrice, setSellingPrice] = useState<number>(0)

  const [dialogRows, setDialogRows] = useState<DialogRow[]>([])

  const acceptedTotal = Number(purchaseOrder.accepted_products[0]?.accepted_total || 0)

  const filteredSubCategories = selectedCategory
    ? subCategoryOptions.filter((sub) => sub.refCategoryId === selectedCategory.refCategoryId)
    : []

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
    setMrp(Number(sp.toFixed(2))) // Also show in MRP field
  }, [cost, profitMargin])

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
    setDialogRows([]) // no referenceNumber
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

  const saveRow = () => {
    if (!selectedCategory || !selectedSubCategory) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Select category and sub-category'
      })
      return
    }
    if (quantity > acceptedTotal) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: `Quantity cannot exceed accepted total ${acceptedTotal}`
      })
      return
    }

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
      dialogRows
    }

    const updatedRows = editingRow
      ? rows.map((r) => (r.id === editingRow.id ? newRow : r))
      : [...rows, newRow]

    setRows(updatedRows)
    setDialogVisible(false)
    toast.current?.show({ severity: 'success', summary: 'Saved', detail: 'Row saved successfully' })
  }

  const remainingQuantity =
    acceptedTotal - rows.reduce((sum, r) => sum + r.quantity, 0) + (editingRow?.quantity || 0)

  const handleQuantityChange = (value: number) => {
    if (value > remainingQuantity) value = remainingQuantity
    setQuantity(value)
    generateDialogRows(value)
  }
  const generateDialogRows = (qty: number) => {
    const baseSNo = editingRow ? editingRow.dialogRows[0]?.sNo || 1 : rows.length + 1
    const newRows: DialogRow[] = []

    for (let i = 0; i < qty; i++) {
      newRows.push({
        id: Date.now() + i,
        sNo: baseSNo + i,
        lineNumber: lineNumber,
        referenceNumber: '',
        productDescription: editingRow?.dialogRows[i]?.productDescription || '',
        price: editingRow?.dialogRows[i]?.price || cost,
        margin: editingRow?.dialogRows[i]?.margin || profitMargin,
        totalAmount: (
          (editingRow?.dialogRows[i]?.price || cost) *
          (1 + (editingRow?.dialogRows[i]?.margin || profitMargin) / 100)
        ).toFixed(2)
      })
    }

    setDialogRows(newRows)
  }

  const handleDialogRowChange = (index: number, field: keyof DialogRow, value: string | number) => {
    const updated = [...dialogRows]
    updated[index] = {
      ...updated[index],
      [field]: value
    } as DialogRow // <-- type cast
    if (field === 'price' || field === 'margin') {
      updated[index].totalAmount = (
        Number(updated[index].price) *
        (1 + Number(updated[index].margin) / 100)
      ).toFixed(2)
    }
    setDialogRows(updated)
  }

  return (
    <div>
      <Toast ref={toast} />
      <h3>PO: {purchaseOrder.invoice_number}</h3>
      <div className="flex gap-3 justify-content-end">
        <Button
          label="Add Product"
          icon={<Plus size={18} />}
          className="mb-3 flex gap-3 items-center"
          onClick={openAddDialog}
        />
        <Button label="Save" icon={<Check size={18} />} className="mb-3 flex gap-3 items-center" />
      </div>
      <DataTable
        value={rows}
        responsiveLayout="scroll"
        showGridlines
        rowHover
        onRowClick={(e) => openEditDialog(e.data as TableRow)} // <-- cast
      >
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
        style={{ width: '80vw', height: '90vh' }}
        breakpoints={{ '960px': '95vw', '640px': '100vw' }}
      >
        {/* Category, SubCategory, LineNumber */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                value={selectedCategory}
                options={categoryOptions}
                optionLabel="categoryName"
                onChange={(e) => {
                  setSelectedCategory(e.value)
                  setSelectedSubCategory(null)
                }}
                placeholder="Select Category"
                className="w-full"
              />
              <label>Category</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                value={selectedSubCategory}
                options={filteredSubCategories}
                optionLabel="subCategoryName"
                onChange={(e) => setSelectedSubCategory(e.value)}
                placeholder={selectedCategory ? 'Select Sub Category' : 'Select Category First'}
                className="w-full"
                disabled={!selectedCategory}
              />
              <label>Sub Category</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                value={lineNumber}
                onValueChange={(e) => setLineNumber(e.value || 1)}
                min={1}
                className="w-full"
              />
              <label>Line Number</label>
            </FloatLabel>
          </div>
        </div>

        {/* Product, Brand, Tax */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full"
              />
              <label>Product Name</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full"
              />
              <label>Brand</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value={taxClass}
                onChange={(e) => setTaxClass(e.target.value)}
                className="w-full"
              />
              <label>Tax Class</label>
            </FloatLabel>
          </div>
        </div>

        {/* Cost, Profit, Selling */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                value={cost}
                onValueChange={(e) => setCost(e.value || 0)}
                min={0}
                className="w-full"
              />
              <label>Cost</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                value={profitMargin}
                onValueChange={(e) => setProfitMargin(e.value || 0)}
                min={0}
                max={100}
                className="w-full"
              />
              <label>Profit %</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber value={sellingPrice} disabled className="w-full" />
              <label>Selling Price</label>
            </FloatLabel>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                value={quantity}
                min={1}
                max={remainingQuantity}
                onValueChange={(e) => handleQuantityChange(e.value || 1)}
                className="w-full"
              />
              <label>Quantity</label>
            </FloatLabel>
            <small className="text-sm text-color-danger mt-1">Max allowed: {acceptedTotal}</small>
          </div>
        </div>

        {/* Dialog Rows */}
        <div className="mt-3 overflow-auto" style={{ maxHeight: '300px' }}>
          <div className="flex gap-3 font-bold border-b pb-1">
            <div>S.No</div> {/* fixed width for S.No */}
            <div className="flex-1">Line Item</div>
            <div className="flex-1">Reference No</div>
            <div className="flex-1">Description</div>
            <div className="flex-1">Amount</div>
            <div className="flex-1">Profit %</div>
            <div className="flex-1">Total Amount</div>
          </div>

          {dialogRows.map((row, index) => (
            <div key={row.id} className="flex gap-3 mt-2 align-items-center">
              {/* S.No */}
              <div style={{ width: '40px', textAlign: 'center' }}>{row.sNo}</div>
              {/* Line Item */}
              <div className="flex-1">
                <InputNumber
                  value={row.lineNumber}
                  onValueChange={(e) => handleDialogRowChange(index, 'lineNumber', e.value || 1)}
                  className="w-full"
                />
              </div>

              {/* Reference No */}
              <div className="flex-1">
                <InputText
                  value={row.referenceNumber}
                  onChange={(e) => handleDialogRowChange(index, 'referenceNumber', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="flex-1">
                <InputText
                  value={row.productDescription}
                  onChange={(e) =>
                    handleDialogRowChange(index, 'productDescription', e.target.value)
                  }
                  className="w-full"
                />
              </div>

              {/* Amount */}
              <div className="flex-1">
                <InputNumber
                  value={row.price}
                  onValueChange={(e) => handleDialogRowChange(index, 'price', e.value || 0)}
                  className="w-full"
                />
              </div>

              {/* Profit % */}
              <div className="flex-1">
                <InputNumber
                  value={row.margin}
                  onValueChange={(e) => handleDialogRowChange(index, 'margin', e.value || 0)}
                  className="w-full"
                />
              </div>

              {/* Total Amount */}
              <div className="flex-1">
                <InputNumber value={Number(row.totalAmount)} disabled className="w-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-content-end">
          <Button label="Save" icon={<Check size={18} />} className="gap-3" onClick={saveRow} />
        </div>
      </Dialog>
    </div>
  )
}

export default NewPOCatalogCreation
