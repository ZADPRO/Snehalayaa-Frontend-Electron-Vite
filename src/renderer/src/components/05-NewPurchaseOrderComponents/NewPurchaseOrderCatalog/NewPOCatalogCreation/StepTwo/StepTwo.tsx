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
import { Plus, Check, Trash2 } from 'lucide-react'
import { fetchCategories, fetchSubCategories } from '../NewPOCatalogCreation.function'
import { Category, SubCategory, TableRow, DialogRow } from '../NewPOCatalogCreation.interface'
import { Divider } from 'primereact/divider'
import api from '../../../../../utils/api'

interface StepTwoProps {
  purchaseOrder: any
}

const StepTwo: React.FC<StepTwoProps> = ({ purchaseOrder }) => {
  console.log('purchaseOrder', purchaseOrder)
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

  console.log('purchaseOrder', purchaseOrder)
  const totalOrderedQuantity =
    purchaseOrder.products?.reduce((sum: number, p: any) => sum + Number(p.quantity || 0), 0) || 0

  const usedQuantity = rows.reduce((sum, r) => sum + (r.quantity || 0), 0)

  // Remaining quantity available for adding products
  const remainingQuantity = totalOrderedQuantity - usedQuantity + (editingRow?.quantity || 0)

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

  const filteredSubCategories = selectedCategory
    ? subCategoryOptions.filter((sub) => sub.refCategoryId === selectedCategory.refCategoryId)
    : []

  const generateSKU = (index: number): string => {
    const now = new Date()
    const datePart = `${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`
    const serial = String(index + 1).padStart(3, '0')
    return `SS${datePart}${serial}`
  }

  const openAddDialog = () => {
    setEditingRow(null)
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setLineNumber(rows.length + 1)
    setQuantity(0)
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
    setDialogRows((prevRows) => {
      const newRows: DialogRow[] = []
      for (let i = 0; i < qty; i++) {
        const existing = prevRows[i]
        newRows.push({
          id: existing?.id || Date.now() + i,
          sNo: i + 1,
          lineNumber,
          referenceNumber: existing?.referenceNumber || '',
          productDescription: existing?.productDescription || '',
          discount: discountPercent,
          price: cost,
          discountPrice: discountPrice,
          margin: profitMargin,
          totalAmount: ((discountPrice || cost) * (1 + profitMargin / 100)).toFixed(2)
        })
      }
      return newRows
    })
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

  // const canGenerateRows = () => {
  //   return (
  //     lineNumber > 0 &&
  //     productName.trim() !== '' &&
  //     selectedCategory &&
  //     selectedSubCategory &&
  //     cost > 0 &&
  //     quantity > 0
  //   )
  // }

  const handleQuantityChange = (value: number) => {
    console.log('value', value)
    // if (!canGenerateRows()) return

    if (value > remainingQuantity) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Quantity Limit',
        detail: `You can only add up to ${remainingQuantity} more products`
      })
      value = remainingQuantity
    }
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

  const focusNextInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    field: keyof DialogRow
  ) => {
    if (e.key !== 'Enter') return
    e.preventDefault()

    const table = e.currentTarget.closest('.p-datatable-wrapper')
    if (!table) return

    const inputs = Array.from(
      table.querySelectorAll<HTMLInputElement>('.p-inputtext, .p-inputnumber-input')
    )

    const currentIndex = inputs.indexOf(e.currentTarget as HTMLInputElement)
    const nextInput = inputs[currentIndex + 1]
    if (nextInput) {
      nextInput.focus()
      nextInput.select?.()
    } else {
      const nextRowInputs = Array.from(
        table.querySelectorAll<HTMLInputElement>('.p-inputtext, .p-inputnumber-input')
      ).filter((input) => {
        const row = input.closest('tr')
        return row && Number(row.getAttribute('data-p-rowindex')) === rowIndex + 1
      })

      if (nextRowInputs.length > 0) {
        const firstInputNextRow = nextRowInputs[0]
        firstInputNextRow.focus()
        firstInputNextRow.select?.()
      } else {
        const firstInput = inputs[0]
        if (firstInput) {
          firstInput.focus()
          firstInput.select?.()
        }
      }
    }
  }

  useEffect(() => {
    if (dialogRows.length === 0) return
    setDialogRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        lineNumber,
        discount: discountPercent,
        price: cost,
        discountPrice: discountPrice,
        margin: profitMargin,
        totalAmount: ((discountPrice || cost) * (1 + profitMargin / 100)).toFixed(2)
      }))
    )
  }, [lineNumber, cost, discountPercent, discountPrice, profitMargin])

  const handleSaveAll = async () => {
    console.log('purchaseOrder', purchaseOrder)
    const payload = {
      purchaseOrderId: purchaseOrder.purchaseOrderId,
      products: rows.map((r) => ({
        sNo: r.sNo,
        lineNumber: r.lineNumber,
        productName: r.productName,
        brand: r.brand,
        categoryId: r.category?.refCategoryId,
        subCategoryId: r.subCategory?.refSubCategoryId,
        taxClass: r.taxClass,
        quantity: r.quantity,
        cost: r.cost,
        profitMargin: r.profitMargin,
        sellingPrice: r.sellingPrice,
        mrp: r.mrp,
        discountPercent: r.discountPercent,
        discountPrice: r.discountPrice,
        dialogRows: r.dialogRows.map((d) => ({
          sNo: d.sNo,
          lineNumber: d.lineNumber,
          referenceNumber: d.referenceNumber,
          productDescription: d.productDescription,
          discount: d.discount,
          price: d.price,
          discountPrice: d.discountPrice,
          margin: d.margin,
          totalAmount: d.totalAmount
        }))
      }))
    }

    console.log('📦 Final Payload to send to backend:', payload)

    const response = await api.post('/admin/savePurchaseOrderProducts', payload)
    console.log('📦 Save PO Products Response:', response)
  }

  return (
    <div>
      <Toast ref={toast} />

      <div className="flex gap-3 justify-content-end mb-3">
        <Button label="Add Product" icon={<Plus size={18} />} onClick={openAddDialog} />
        <Button label="Save All" icon={<Check size={18} />} onClick={handleSaveAll} />
      </div>

      <DataTable value={rows} responsiveLayout="scroll" showGridlines rowHover>
        <Column field="sNo" header="S.No." />
        <Column
          field="lineNumber"
          header="Line No."
          body={(rowData) => (
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => openEditDialog(rowData)}
            >
              {rowData.lineNumber}
            </span>
          )}
        />
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
        className="addEditGRNProductDialog"
        style={{ width: '98vw', height: '98vh' }}
        footer={
          <div className="flex justify-content-end">
            <Button
              label="Save"
              icon={<Check size={18} />}
              className="gap-3 p-button-primary"
              onClick={saveRow}
            />
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
        <Divider />
        <div className="mb-2 font-medium">
          {dialogRows.length} product{dialogRows.length !== 1 ? 's' : ''} generated
        </div>
        <DataTable
          value={dialogRows}
          scrollable
          scrollHeight="400px"
          responsiveLayout="scroll"
          showGridlines
          rowHover
          className="p-datatable-sm"
        >
          {/* S.No */}
          <Column
            header="S.No"
            body={(rowData) => <span className="p-text-center">{rowData.sNo}</span>}
            className="productGRNTableInputSNo"
            style={{ textAlign: 'center' }}
          />

          {/* Line Item */}
          <Column
            header="Line Item"
            body={(rowData, { rowIndex }) => (
              <InputNumber
                value={rowData.lineNumber}
                className="productGRNTableInputLineItem w-full"
                onValueChange={(e) => handleDialogRowChange(rowIndex, 'lineNumber', e.value || 0)}
                onKeyDown={(e) => focusNextInput(e, rowIndex, 'lineNumber')}
              />
            )}
          />

          {/* Ref No */}
          <Column
            header="Ref No"
            body={(rowData, { rowIndex }) => (
              <InputText
                value={rowData.referenceNumber}
                className="productGRNTableInputRefNo w-full"
                onChange={(e) => handleDialogRowChange(rowIndex, 'referenceNumber', e.target.value)}
                onKeyDown={(e) => focusNextInput(e, rowIndex, 'referenceNumber')}
              />
            )}
          />

          {/* Description */}
          <Column
            header="Description"
            body={(rowData, { rowIndex }) => (
              <InputText
                value={rowData.productDescription}
                className="productGRNTableInputDescription w-full"
                onChange={(e) =>
                  handleDialogRowChange(rowIndex, 'productDescription', e.target.value)
                }
                onKeyDown={(e) => focusNextInput(e, rowIndex, 'productDescription')}
              />
            )}
          />

          {/* Discount % */}
          <Column
            header="Discount %"
            body={(rowData, { rowIndex }) => (
              <InputNumber
                value={rowData.discount}
                className="productGRNTableInputDiscountPercent w-full"
                onValueChange={(e) => handleDialogRowChange(rowIndex, 'discount', e.value || 0)}
                min={0}
                max={100}
                onKeyDown={(e) => focusNextInput(e, rowIndex, 'discount')}
              />
            )}
          />

          {/* Discount Price */}
          <Column
            header="Discount Price"
            body={(rowData, { rowIndex }) => (
              <InputNumber
                value={rowData.discountPrice}
                className="productGRNTableInputDiscountPrice w-full"
                onValueChange={(e) =>
                  handleDialogRowChange(rowIndex, 'discountPrice', e.value || 0)
                }
                onKeyDown={(e) => focusNextInput(e, rowIndex, 'discountPrice')}
              />
            )}
          />

          {/* Profit % */}
          <Column
            header="Profit %"
            body={(rowData, { rowIndex }) => (
              <InputNumber
                value={rowData.margin}
                className="productGRNTableInputProfitPercent w-full"
                onValueChange={(e) => handleDialogRowChange(rowIndex, 'margin', e.value || 0)}
                min={0}
                max={100}
                onKeyDown={(e) => focusNextInput(e, rowIndex, 'margin')}
              />
            )}
          />

          {/* Price */}
          <Column
            header="Price"
            body={(rowData, { rowIndex }) => (
              <InputNumber
                value={rowData.price}
                className="productGRNTableInputPrice w-full"
                onValueChange={(e) => handleDialogRowChange(rowIndex, 'price', e.value || 0)}
                onKeyDown={(e) => focusNextInput(e, rowIndex, 'price')}
              />
            )}
          />

          {/* Total */}
          <Column
            header="Total"
            body={(rowData, { rowIndex }) => (
              <InputNumber
                value={Number(rowData.totalAmount)}
                className="productGRNTableInputTotalAmt w-full"
                onValueChange={(e) => handleDialogRowChange(rowIndex, 'totalAmount', e.value || 0)}
              />
            )}
          />

          {/* Action */}
          <Column
            header="Action"
            body={(_rowData, { rowIndex }) => (
              <Button
                icon={<Trash2 />}
                className="p-button-danger productGRNTableAction"
                onClick={() => {
                  const updatedRows = [...dialogRows]
                  updatedRows.splice(rowIndex, 1)
                  setDialogRows(updatedRows)
                  setQuantity(updatedRows.length)
                }}
              />
            )}
          />
        </DataTable>
      </Dialog>
    </div>
  )
}

export default StepTwo
