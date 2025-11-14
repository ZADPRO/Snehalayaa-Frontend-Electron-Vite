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
  fetchCategories,
  fetchSubCategories,
  createPurchaseOrder
} from './InventoryCreateNewStock.function'
import { Branch, Category, SubCategory } from './InventoryCreateNewStock.interface'
import { Check, CheckCheck, Download, Pencil, Plus, Printer, Trash2 } from 'lucide-react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Tooltip } from 'primereact/tooltip'
import { generateInvoicePdf } from '../../../05-PurchaseOrderComponents/PurchaseOrderCreation/PurchaseOrderInvoice/PurchaseOrderInvoice.function'
import InventoryCreateNewProductForStock from './InventoryCreateNewProductForStock/InventoryCreateNewProductForStock'
import BoxDialog from '../../BoxDialog/BoxDialog'

const AddNewStockProductOrder: React.FC = () => {
  const dt = useRef<DataTable<any[]>>(null)
  const toast = useRef<Toast>(null)
  // const [productSelectionTotal, setProductSelectionTotal] = useState<number>(0)

  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  const [branches, setBranches] = useState<Branch[]>([])
  //   const [suppliers, setSuppliers] = useState<Branch[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Branch | null>(null)

  const [tableData, setTableData] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)

  const [pendingAmountInput, _setPendingAmountInput] = useState('')
  const [applyTax, _setApplyTax] = useState(false)

  const [editProduct, setEditProduct] = useState<any | null>(null)

  const subTotal = tableData.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0)
  const discountAmount = tableData.reduce((sum, item) => sum + (item.discount || 0), 0)
  const taxAmount = applyTax ? (subTotal - discountAmount) * 0.05 : 0
  const finalAmount = subTotal - discountAmount + taxAmount
  const totalPaid = Number(pendingAmountInput || 0)
  const pendingPayment = finalAmount - totalPaid

  const [showBoxDialog, setShowBoxDialog] = useState(false)

  // const [creditDate, setCreditDate] = useState<Date | null>(null)
  // const [isPreviousPaymentDone, setIsPreviousPaymentDone] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const [branchData, supplierData, categoryData, subCategoryData] = await Promise.all([
        fetchBranches(),
        fetchBranches(),
        fetchCategories(),
        fetchSubCategories()
      ])
      setBranches(branchData)
      console.log('supplierData', supplierData)
      //   setSuppliers(supplierData)
      setCategories(categoryData)
      setSubCategories(subCategoryData)
    }

    loadData()
  }, [])

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
    const supplierDetails = selectedSupplier && {
      supplierId: selectedSupplier.refBranchId,
      supplierName: selectedSupplier.refBranchName,
      supplierCompanyName: selectedSupplier.refEmail,
      supplierGSTNumber: selectedSupplier.refLocation
      //   supplierAddress: formatSupplierAddress(selectedSupplier),
      //   supplierPaymentTerms: selectedSupplier.supplierPaymentTerms,
      //   supplierEmail: selectedSupplier.supplierEmail,
      //   supplierContactNumber: selectedSupplier.supplierContactNumber
    }

    const branchDetails = selectedBranch && {
      branchId: selectedBranch.refBranchId,
      branchName: selectedBranch.refBranchName,
      branchEmail: selectedBranch.refEmail,
      branchAddress: selectedBranch.refLocation
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
      //   supplierId: selectedSupplier?.supplierId,
      branchId: selectedBranch?.refBranchId,
      status: 1,
      // expectedDate: creditDate?.toISOString() || new Date().toISOString(),
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
  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Select One',
        detail: 'Please select a single row to edit.'
      })
      return
    }
    setEditProduct(selectedRows[0])
    setVisibleRight(true)
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

    if (tableData.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Products',
        detail: 'Please add at least one product before initiating stock transfer.'
      })
      return
    }

    try {
      const payload = buildPayload()
      console.log('payload', payload)

      const res = await createPurchaseOrder(payload)

      toast.current?.show({
        severity: 'success',
        summary: 'Stock Transfer Initiated',
        detail: res.message || 'Your stock transfer has been saved successfully.'
      })

      setIsSaved(true)
    } catch (error) {
      console.error('Error saving stock transfer:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Save Failed',
        detail: (error as Error).message
      })
    }
  }

  // const handleAddProduct = (newItem: any) => {
  //   console.log('newItem', newItem)
  //   const category = categories.find((c) => c.refCategoryId === newItem.refCategoryId)
  //   const subCategory = subCategories.find((sc) => sc.refSubCategoryId === newItem.refSubCategoryId)

  //   if (editProduct) {
  //     // Edit: replace existing
  //     setTableData((prevData) =>
  //       prevData.map((item) =>
  //         item.id === editProduct.id
  //           ? {
  //               ...item,
  //               ...newItem,
  //               refCategoryId: newItem.refCategoryId,
  //               refSubCategoryId: newItem.refSubCategoryId,
  //               category: category?.categoryName || '',
  //               subCategory: subCategory?.subCategoryName || ''
  //             }
  //           : item
  //       )
  //     )
  //     setEditProduct(null)
  //   } else {
  //     // Add: as you have already
  //     setTableData((prev) => [
  //       ...prev,
  //       {
  //         id: prev.length + 1,
  //         ...newItem,
  //         refCategoryId: newItem.refCategoryId,
  //         refSubCategoryId: newItem.refSubCategoryId,
  //         category: category?.categoryName || '',
  //         subCategory: subCategory?.subCategoryName || ''
  //       }
  //     ])
  //   }
  // setSelectedRows([])
  // }

  const handleAddProduct = (newProducts: any[]) => {
    if (!Array.isArray(newProducts) || newProducts.length === 0) return

    const transformedProducts = newProducts.map((item) => {
      const category = categories.find((c) => c.refCategoryId === item.refCategoryId)
      const subCategory = subCategories.find((sc) => sc.refSubCategoryId === item.refSubCategoryId)

      return {
        id: Date.now() + Math.random(), // unique ID for table
        productName: item.productName,
        refCategoryId: item.refCategoryId,
        refSubCategoryId: item.refSubCategoryId,
        category: category?.categoryName || '',
        subCategory: subCategory?.subCategoryName || '',
        quantity: item.quantity,
        purchasePrice: item.unitPrice,
        discountPrice: item.discountPrice || 0,
        totalAmount: item.totalAmount || item.unitPrice * item.quantity,
        SKU: item.SKU,
        productBranchId: selectedBranch?.refBranchId,
        ...item // in case there are extra fields you need
      }
    })

    setTableData((prev) => [...prev, ...transformedProducts])
    setSelectedRows([])
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
  const handleDelete = () => {
    if (selectedRows.length < 1) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select at least one product to delete.'
      })
      return
    }
    setTableData((current) =>
      current.filter((row) => !selectedRows.some((sel: any) => sel.id === row.id))
    )
    setSelectedRows([])
    toast.current?.show({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Selected product(s) deleted.'
    })
  }
  const totalPurchasePrice = tableData.reduce((sum, item) => sum + (item.purchasePrice || 0), 0)

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
                options={branches}
                optionLabel="refBranchName"
                placeholder="Select From Address"
                className="w-full"
                itemTemplate={(option) => (
                  <div>
                    <div>{option.refBranchName}</div>
                  </div>
                )}
                valueTemplate={(option) =>
                  option ? (
                    <div>
                      <div>{option.refBranchName}</div>
                    </div>
                  ) : (
                    <span>Select From Address</span>
                  )
                }
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
                options={branches.filter(
                  (branch) => branch.refBranchId !== selectedBranch?.refBranchId
                )}
                optionLabel="refBranchName"
                placeholder="Select To Address"
                className="w-full"
                itemTemplate={(option) => (
                  <div>
                    <div>{option.refBranchName}</div>
                  </div>
                )}
                valueTemplate={(option) =>
                  option ? (
                    <div>
                      <div>{option.refBranchName}</div>
                    </div>
                  ) : (
                    <span>Select To Address</span>
                  )
                }
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
              onClick={() => {
                setVisibleRight(true)
                handleEdit()
              }}
              disabled={!isEditEnabled}
            />
            <Button
              label="Delete"
              severity="danger"
              className="w-full gap-2"
              icon={<Trash2 size={20} />}
              onClick={handleDelete}
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
          {/* <Column field="quantity" header="Quantity" /> */}
          <Column field="purchasePrice" header="Price" />
          {/* <Column field="discount" header="Disc%" />
          <Column field="discountPrice" header="Discount" />
          <Column field="subTotal" header="Total" /> */}
        </DataTable>
      </div>
      <Divider layout="vertical" className="verticalDivider" />
      <div style={{ width: '17%' }} className="flex flex-column justify-content-between">
        <div className="flex flex-column gap-1">
          <Button
            label="Add New"
            className="w-full gap-2 p-button-primary"
            icon={<Plus size={20} />}
            onClick={handleAddNewClick}
          />
          <Button
            label={isSaved ? 'Clear' : 'Save'}
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
                    name: selectedSupplier.refBranchName
                    // address: formatSupplierAddress(selectedSupplier),
                    // phone: selectedSupplier.supplierContactNumber,
                    // taxNo: selectedSupplier.supplierGSTNumber
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
                    name: selectedBranch.refBranchName,
                    address: selectedBranch.refEmail
                  },
                  to: {
                    name: selectedSupplier.refBranchName
                    // address: formatSupplierAddress(selectedSupplier),
                    // phone: selectedSupplier.supplierContactNumber,
                    // taxNo: selectedSupplier.supplierGSTNumber
                  },
                  items: tableData,
                  invoiceNo,
                  logoBase64,
                  action: 'print'
                })
              }
            }}
          />
          {/* <Button
            label="Box Count"
            icon={<Box size={20} />}
            className="w-full gap-2 p-button-primary"
            onClick={() => setShowBoxDialog(true)}
          /> */}
        </div>
        <div className="flex flex-column gap-2 pb-3 surface-100 border-round mt-20">
          <h4 className="mb-2 ">Payment Summary</h4>

          <div className="flex align-items-center gap-2 "></div>

          {/* Summary */}
          <div className="mt-3 text-sm">
            <div className="flex justify-content-between">
              <span>Sub Total:</span>
              <span>₹{totalPurchasePrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Discount:</span>
              <span>₹</span>
              {/* <span>₹{discountAmount.toLocaleString('en-IN')}</span> */}
            </div>
            <div className="flex justify-content-between">
              <span>Tax:</span>
              <span>₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-content-between font-bold text-lg">
              <span>Total Amount:</span>
              <span>₹{totalPurchasePrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Paid:</span>
              <span>₹{totalPaid.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-content-between text-red-600">
              <span>Pending:</span>
              <span>₹{totalPurchasePrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
      <Sidebar
        visible={visibleRight}
        position="right"
        header={
          <span style={{ textTransform: 'uppercase', fontWeight: '600', fontSize: '1.2rem' }}>
            Add Products For Stock Take
          </span>
        }
        onHide={() => setVisibleRight(false)}
        style={{ width: '80vw' }}
      >
        <InventoryCreateNewProductForStock
          fromAddress={selectedBranch}
          toAddress={selectedSupplier}
          onAdd={(products) => {
            handleAddProduct(products) // <-- main table updates here
            setVisibleRight(false) // close sidebar
          }}
          onClose={() => {
            setVisibleRight(false)
            setEditProduct(null)
          }}
          productToEdit={editProduct}
        />
      </Sidebar>
      <BoxDialog
        visible={showBoxDialog}
        onHide={() => setShowBoxDialog(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default AddNewStockProductOrder
