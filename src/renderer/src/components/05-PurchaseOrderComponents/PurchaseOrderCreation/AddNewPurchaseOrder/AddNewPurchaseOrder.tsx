import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { Toast } from 'primereact/toast'

import React, { useEffect, useRef, useState } from 'react'

import logo from '../../../../assets/logo/invoice.png'

import {
  fetchBranches,
  fetchSuppliers,
  fetchCategories,
  fetchSubCategories,
  createPurchaseOrder
} from './AddNewPurchaseOrder.function'
import { Branch, Supplier, Category, SubCategory } from './AddNewPurchaseOrder.interface'
import { Check, CheckCheck, Download, Pencil, Plus, Printer, Trash2, Upload } from 'lucide-react'
import { Sidebar } from 'primereact/sidebar'
import AddNewProductsForPurchaseOrder from './AddNewProductsForPurchaseOrder/AddNewProductsForPurchaseOrder'
import { generateInvoicePdf } from '../PurchaseOrderInvoice/PurchaseOrderInvoice.function'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { Tooltip } from 'primereact/tooltip'
import SupplierPaymentDialog from './SupplierPaymentDialog/SupplierPaymentDialog'

const AddNewPurchaseOrder: React.FC = () => {
  const dt = useRef<DataTable<any[]>>(null)
  const toast = useRef<Toast>(null)

  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  const [branches, setBranches] = useState<Branch[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const [selectedBranch, setSelectedBranch] = useState<Supplier | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Branch | null>(null)

  const [tableData, setTableData] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)

  const [pendingAmountInput, setPendingAmountInput] = useState('')
  const [applyTax, setApplyTax] = useState(false)

  const subTotal = tableData.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0)
  const discountAmount = tableData.reduce((sum, item) => sum + (item.discount || 0), 0)
  const taxAmount = applyTax ? (subTotal - discountAmount) * 0.05 : 0
  const finalAmount = subTotal - discountAmount + taxAmount
  const totalPaid = Number(pendingAmountInput || 0)
  const pendingPayment = finalAmount - totalPaid

  const [showSupplierDialog, setShowSupplierDialog] = useState(false)
  const [creditDays, setCreditDays] = useState('')
  const [creditDate, setCreditDate] = useState<Date | null>(null)
  // const [isPreviousPaymentDone, setIsPreviousPaymentDone] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const [branchData, supplierData, categoryData, subCategoryData] = await Promise.all([
        fetchBranches(),
        fetchSuppliers(),
        fetchCategories(),
        fetchSubCategories()
      ])
      setBranches(branchData)
      console.log('supplierData', supplierData)
      setSuppliers(supplierData)
      setCategories(categoryData)
      setSubCategories(subCategoryData)
    }

    loadData()
  }, [])

  const formatSupplierAddress = (supplier: Supplier): string => {
    return [
      supplier.supplierDoorNumber,
      supplier.supplierStreet,
      supplier.supplierCity,
      supplier.supplierState,
      supplier.supplierCountry,
      supplier.supplierPaymentTerms ? `PIN: ${supplier.supplierPaymentTerms}` : ''
    ]
      .filter(Boolean)
      .join(', ')
  }

  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)

  const invoiceIndex = 10001

  const invoiceNo = `POINV-${month}-${year}-${invoiceIndex}`

  const getBase64FromImage = (imgUrl: string): Promise<string> => {
    return fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      })
  }

  const buildPayload = () => {
    const supplierDetails = selectedBranch && {
      supplierId: selectedBranch.supplierId,
      supplierName: selectedBranch.supplierName,
      supplierCompanyName: selectedBranch.supplierCompanyName,
      supplierGSTNumber: selectedBranch.supplierGSTNumber,
      supplierAddress: formatSupplierAddress(selectedBranch),
      supplierPaymentTerms: selectedBranch.supplierPaymentTerms,
      supplierEmail: selectedBranch.supplierEmail,
      supplierContactNumber: selectedBranch.supplierContactNumber
    }

    const branchDetails = selectedSupplier && {
      branchId: selectedSupplier.refBranchId,
      branchName: selectedSupplier.refBranchName,
      branchEmail: selectedSupplier.refEmail,
      branchAddress: selectedSupplier.refLocation
    }

    const productDetails = tableData.map((item) => ({
      productName: item.productName,
      refCategoryid: item.refCategoryId,
      refSubCategoryId: item.refSubCategoryId,
      HSNCode: item.hsnCode,
      purchaseQuantity: item.quantity.toString(),
      purchasePrice: item.purchasePrice.toString(),
      discountPrice: item.discountPrice?.toString() || '0',
      discountAmount: (item.quantity * item.discountPrice || 0).toString(),
      totalAmount: item.total.toString(),
      isReceived: false,
      acceptanceStatus: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: '',
      updatedBy: '',
      isDelete: false
    }))

    const totalSummary = {
      poNumber: invoiceNo,
      supplierId: selectedSupplier?.supplierId,
      branchId: selectedBranch?.refBranchId,
      status: 1,
      expectedDate: creditDate?.toISOString() || new Date().toISOString(),
      modeOfTransport: 'Road',
      subTotal: subTotal.toString(),
      discountOverall: discountAmount.toString(),
      payAmount: finalAmount.toString(),
      isTaxApplied: applyTax,
      taxPercentage: applyTax ? '5' : '0',
      taxedAmount: taxAmount.toString(),
      totalAmount: finalAmount.toString(),
      totalPaid: totalPaid.toString(),
      paymentPending: pendingPayment.toString(),
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: '',
      updatedBy: '',
      isDelete: false
    }

    return {
      supplierDetails,
      branchDetails,
      productDetails,
      totalSummary
    }
  }

  const handleSave = async () => {
    if (!selectedBranch || !selectedSupplier) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Address',
        detail: 'Please select both branch and supplier before saving.'
      })
      return
    }

    try {
      const payload = buildPayload()
      console.log('payload', payload)

      const res = await createPurchaseOrder(payload)

      toast.current?.show({
        severity: 'success',
        summary: 'Purchase Order Saved',
        detail: res.message || 'Your purchase order has been saved successfully.'
      })

      setIsSaved(true)
    } catch (error) {
      console.error('Error saving purchase order:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Save Failed',
        detail: (error as Error).message
      })
    }
  }

  const handleAddProduct = (newItem: any) => {
    console.log('🔍 New item added:', newItem)

    setTableData((prev) => {
      const updatedData = [...prev]

      const existingIndex = updatedData.findIndex(
        (item) =>
          item.refCategoryId === newItem.refCategoryId &&
          item.refSubCategoryId === newItem.refSubCategoryId &&
          item.productName.trim().toLowerCase() === newItem.productName.trim().toLowerCase()
      )

      if (existingIndex !== -1) {
        console.log('✅ Match found at index:', existingIndex)
        console.log('🛠️ Updating existing product:', updatedData[existingIndex])

        // Update logic
        const existing = updatedData[existingIndex]
        const updatedItem = {
          ...existing,
          quantity: existing.quantity + newItem.quantity,
          purchasePrice: newItem.purchasePrice,
          discount: newItem.discount || existing.discount || 0,
          discountPrice: newItem.discountPrice || 0,
          total:
            (existing.quantity + newItem.quantity) * newItem.purchasePrice - (newItem.discount || 0)
        }

        updatedData[existingIndex] = updatedItem

        console.log('🔁 Updated product:', updatedItem)
        return updatedData
      } else {
        const newRow = {
          id: prev.length + 1,
          ...newItem,
          total: newItem.quantity * newItem.purchasePrice - (newItem.discount || 0)
        }

        console.log('➕ No match found. Adding new product:', newRow)
        return [...prev, newRow]
      }
    })
  }

  const isEditEnabled = selectedRows.length === 1
  const isDeleteEnabled = selectedRows.length >= 1

  const handleAddNewClick = () => {
    if (!selectedBranch || !selectedSupplier) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Address',
        detail: 'Please choose both From and To address before adding a product.'
      })
    } else {
      setVisibleRight(true)
    }
  }

  return (
    <div className="pt-3 flex h-full w-full">
      <Toast ref={toast} />
      <Tooltip target=".name-tooltip" />

      <div style={{ width: '80%' }}>
        <div className="flex gap-3 align-items-center">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="fromAddress"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.value)}
                options={suppliers}
                optionLabel="supplierCompanyName"
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
                options={branches}
                optionLabel="refBranchName"
                placeholder="Select To Address"
                className="w-full"
              />
              <label htmlFor="status">To Address</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="modeOfTransport"
                // value={hsnCode}
                // onChange={(e) => setHsnCode(e.target.value)}
                className="w-full"
              />
              <label htmlFor="status">Mode of Transport</label>
            </FloatLabel>
          </div>
          <div className="flex-1 flex gap-3">
            <Button
              label="Edit"
              severity="success"
              outlined
              className="w-full gap-2"
              icon={<Pencil size={20} />}
              onClick={() => setVisibleRight(true)}
              disabled={!isEditEnabled}
            />
            <Button
              label="Delete"
              severity="danger"
              className="w-full gap-2"
              icon={<Trash2 size={20} />}
              disabled={!isDeleteEnabled}
            />
          </div>
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
          scrollable
          rowsPerPageOptions={[5, 10, 20]}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ textAlign: 'center' }}
            style={{ minWidth: '50px' }}
          />
          <Column
            header="SNo"
            body={(_, opts) => opts.rowIndex + 1}
            style={{ minWidth: '40px' }}
            frozen
          />
          <Column
            header="Name"
            body={(rowData) => {
              const combined = `${rowData.category || ''} - ${rowData.subCategory || ''} - ${rowData.productName || ''}`
              return (
                <span
                  className="name-tooltip"
                  data-pr-tooltip={combined}
                  data-pr-position="top"
                  style={{ cursor: 'pointer' }}
                >
                  {combined}
                </span>
              )
            }}
            style={{ minWidth: '400px' }}
          />
          <Column field="hsnCode" header="HSN" />
          <Column field="quantity" header="Quantity" />
          <Column field="purchasePrice" header="Price" />
          <Column field="discount" header="Disc%" />
          <Column field="discountPrice" header="Discount" />
          <Column field="total" header="Total" />
        </DataTable>
      </div>
      <Divider layout="vertical" />
      <div style={{ width: '17%' }} className="flex flex-column justify-content-between">
        <div className="flex flex-column gap-1">
          <Button
            label="Add New"
            className="w-full gap-2 p-button-primary"
            icon={<Plus size={20} />}
            onClick={handleAddNewClick}
          />
          <Button
            label={isSaved ? 'Close' : 'Save'}
            icon={isSaved ? <CheckCheck size={20} /> : <Check size={20} />}
            className="w-full gap-2 p-button-primary"
            onClick={handleSave}
          />
          {/* <Button
            label="Preview"
            icon={<Eye size={20} />}
            className="w-full gap-2 p-button-primary"
          /> */}
          <Button
            label="Download"
            icon={<Download size={18} />}
            className="w-full gap-2 p-button-primary"
            disabled={!isSaved}
            onClick={async () => {
              const logoBase64 = await getBase64FromImage(logo)

              if (selectedBranch && selectedSupplier) {
                generateInvoicePdf({
                  from: {
                    name: selectedBranch.refBranchName,
                    address: selectedBranch.refEmail
                  },
                  to: {
                    name: selectedSupplier.supplierCompanyName,
                    address: formatSupplierAddress(selectedSupplier),
                    phone: selectedSupplier.supplierContactNumber,
                    taxNo: selectedSupplier.supplierGSTNumber
                  },
                  items: tableData,
                  invoiceNo,
                  logoBase64,
                  action: 'download'
                })
              }
            }}
          />

          <Button
            label="Print"
            icon={<Printer size={18} />}
            className="w-full gap-2 p-button-primary"
            disabled={!isSaved}
            onClick={async () => {
              const logoBase64 = await getBase64FromImage(logo)

              if (selectedBranch && selectedSupplier) {
                generateInvoicePdf({
                  from: {
                    name: selectedSupplier.refBranchName,
                    address: selectedSupplier.refEmail
                  },
                  to: {
                    name: selectedBranch.supplierCompanyName,
                    address: formatSupplierAddress(selectedBranch),
                    phone: selectedBranch.supplierContactNumber,
                    taxNo: selectedBranch.supplierGSTNumber
                  },
                  items: tableData,
                  invoiceNo,
                  logoBase64,
                  action: 'print'
                })
              }
            }}
          />

          <Button
            label="Supplier Details"
            icon={<Pencil size={18} />}
            className="w-full gap-2 p-button-primary"
            onClick={() => setShowSupplierDialog(true)}
          />

          <Button
            label="Upload Invoice"
            icon={<Upload size={20} />}
            className="w-full gap-2 p-button-primary"
          />
        </div>
        <div className="flex flex-column gap-2 pb-3 surface-100 border-round">
          <h4 className="mb-2">Payment Summary</h4>

          {/* Paid Amount Input */}
          {/* <FloatLabel className="always-float">
            <InputText
              id="pendingAmount"
              value={pendingAmountInput}
              onChange={(e) => setPendingAmountInput(e.target.value)}
              className="w-full"
            />
            <label htmlFor="pendingAmount">Enter Paid Amount</label>
          </FloatLabel> */}

          {/* Tax Toggle BELOW the float label */}
          <div className="flex align-items-center gap-2 mt-2">
            <label htmlFor="taxToggle" className="text-sm">
              Apply Tax (5%)
            </label>
            <InputSwitch id="taxToggle" checked={applyTax} onChange={(e) => setApplyTax(e.value)} />
          </div>

          {/* Summary */}
          <div className="mt-3 text-sm">
            <div className="flex justify-content-between">
              <span>Sub Total:</span>
              <span>₹{subTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Discount:</span>
              <span>₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Tax:</span>
              <span>₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-content-between font-bold text-lg">
              <span>Total Amount:</span>
              <span>₹{finalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Paid:</span>
              <span>₹{totalPaid.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-content-between text-red-600">
              <span>Pending:</span>
              <span>₹{pendingPayment.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
      <Sidebar
        visible={visibleRight}
        position="right"
        header={
          <span style={{ textTransform: 'uppercase', fontWeight: '600', fontSize: '1.2rem' }}>
            Add Products For Purchase Order
          </span>
        }
        onHide={() => setVisibleRight(false)}
        style={{ width: '50vw' }}
      >
        <AddNewProductsForPurchaseOrder
          categories={categories}
          subCategories={subCategories}
          fromAddress={selectedSupplier}
          toAddress={selectedBranch}
          onAdd={handleAddProduct}
          onClose={() => setVisibleRight(false)}
        />
      </Sidebar>

      <SupplierPaymentDialog
        visible={showSupplierDialog}
        creditDays={creditDays}
        creditDate={creditDate}
        pendingAmountInput={pendingAmountInput}
        onHide={() => setShowSupplierDialog(false)}
        onCreditDaysChange={(value) => setCreditDays(value)}
        onCreditDateChange={(date) => setCreditDate(date)}
        onPendingAmountChange={(value) => setPendingAmountInput(value)}
        onSave={() => {
          console.log('Supplier Details', {
            creditDays,
            creditDate,
            pendingAmountInput
          })
          setShowSupplierDialog(false)
        }}
      />
    </div>
  )
}

export default AddNewPurchaseOrder
