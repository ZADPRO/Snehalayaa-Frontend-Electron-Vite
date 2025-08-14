import React, { useEffect, useRef, useState } from 'react'
import { Coins, Plus, Save, Search, X } from 'lucide-react'
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import POScustomers from '../POScustomers/POScustomers'
import { InputNumber } from 'primereact/inputnumber'
import { Employee, Product } from './POSsalesOrder.interface'
import { fetchEmployees, fetchProductBySKU, saveSale } from './POSsalesOrder.function'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { MultiSelect } from 'primereact/multiselect'
import { Toast } from 'primereact/toast'
import InvoicePreview from '../POSbilling/POSbilling'
import { Dialog } from 'primereact/dialog'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'

const POSsalesOrder: React.FC = () => {
  const [visibleRight, setVisibleRight] = useState(false)
  const [sku, setSku] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [showCustomDialog, setShowCustomDialog] = useState(false)

  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<Employee | null>(null)
  const [currentProductIndex, setCurrentProductIndex] = useState<number | null>(null)

  const [paymentModes, setPaymentModes] = useState<string[]>([])
  const [cashAmount, setCashAmount] = useState<number>(0)
  const [onlineAmount, setOnlineAmount] = useState<number>(0)
  const [amountGiven, setAmountGiven] = useState<number>(0)
  const [changeReturned, setChangeReturned] = useState<number>(0)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [paymentPayload, setPaymentPayload] = useState<any | null>(null)
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState('')

  const totalAmount = products.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0)
  const totalPaid = (cashAmount || 0) + (onlineAmount || 0)
  const balance = Math.max(0, totalAmount - totalPaid)
  const changeReturn = Math.max(0, (amountGiven || 0) - (cashAmount || 0))

  const paymentOptions = ['Cash', 'GPay', 'Card', 'PhonePe']

  useEffect(() => {
    const newInvNum = `INV-${Date.now()}`
    setInvoiceNumber(newInvNum)
  }, [])

  const handlePaymentSubmit = () => {
    if (totalPaid + 0.9 < totalAmount) {
      toast.current?.show({
        severity: 'error',
        summary: 'Payment mismatch',
        detail: 'Paid amount is less than total bill',
        life: 3000
      })
      return
    }

    const payload = {
      refProductDetails: products.map((p) => ({
        refProductId: Number(p.productId),
        refProductQty: p.quantity,
        refProductPrice: p.Price,
        refDiscount: p.Discount,
        refTotalPrice: p.totalPrice
      })),
      refEmployeeId: products.flatMap((p) => p.assignedEmployees?.map((e) => e.RefUserId) || []),
      refCustomerId: 'CUST001',
      refSaleDate: new Date().toISOString(),
      refPaymentMode: paymentModes,
      amountGiven: paymentModes.includes('Cash') ? amountGiven : 0,
      changeReturned: paymentModes.includes('Cash') ? changeReturned : 0,
      refInvoiceNumber: invoiceNumber, // use state here
      totalPaidAmount: totalPaid,
      paymentBreakdown: {
        cash: cashAmount,
        online: onlineAmount
      }
    }

    setPaymentPayload(payload)
    setPreviewVisible(true)
  }

  const handleSave = async () => {
    const saleCode = `SALE-${Date.now()}`
    // const invoiceNumber = `INV-${Date.now()}`
    const customerId = 'CUST001' // Replace with real logic
    const hasCustomer = !!customerId
    const newInvoiceNumber = `INV-${Date.now()}`
    setInvoiceNumber(newInvoiceNumber) // Save it here so it's shared

    const payload = {
      refSaleCode: saleCode,

      refProductDetails: products.map((product) => ({
        refProductId: Number(product.productId),
        refProductQty: product.quantity,
        refProductPrice: product.Price,
        refDiscount: product.Discount,
        refTotalPrice: product.totalPrice
      })),
      ...(paymentModes.includes('Cash') && {
        amountGiven: amountGiven,
        changeReturned: changeReturned
      }),
      refEmployeeId: products.flatMap(
        (product) => product.assignedEmployees?.map((emp) => emp.RefUserId) || []
      ),
      ...(hasCustomer && { refCustomerId: customerId }),
      refSaleDate: new Date().toISOString(),
      refPaymentMode: paymentModes,
      refInvoiceNumber: newInvoiceNumber
    }

    try {
      const result = await saveSale(payload)
      console.log('✅ Sale saved:', result)

      toast.current?.show({
        severity: 'success',
        summary: 'Sale Saved',
        detail: 'The order has been saved successfully!',
        life: 3000
      })

      // Optionally reset form here
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save the sale!',
        life: 3000
      })
    }
  }

  const toast = useRef<Toast>(null)

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const updatedProduct = e.newData as Product
    const { Price, quantity, Discount } = updatedProduct
    const discountAmount = (Price * Discount) / 100
    const total = Price * quantity - discountAmount
    updatedProduct.DiscountPrice = Math.round(discountAmount)
    updatedProduct.totalPrice = Math.round(total)

    const updatedProducts = [...products]
    updatedProducts[e.index] = updatedProduct
    setProducts(updatedProducts)
  }

  const textEditor = (options: any) => (
    <InputText value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />
  )

  const numberEditor = (options: any) => (
    <InputNumber
      value={options.value}
      onValueChange={(e) => options.editorCallback(e.value)}
      mode="decimal"
      minFractionDigits={0}
    />
  )
  // 🔁 Load employees when dialog is triggered
  useEffect(() => {
    if (showCustomDialog) {
      fetchEmployees().then((data) => setEmployeeList(data))
    }
  }, [showCustomDialog])

  const handleSKUFetch = async () => {
    try {
      const product = await fetchProductBySKU(sku)
      setProducts((prev) => [...prev, product])
      setSku('')
      setCurrentProductIndex(products.length) // Index of the product just added
      setShowCustomDialog(true)
    } catch (error) {
      confirmDialog({
        message: 'No product found for this SKU. Do you want to try again?',
        header: 'Product Not Found',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: () => setSku(''),
        reject: () => console.log('User cancelled')
      })
    }
  }

  const handleCustomDialogAccept = () => {
    if (!selectedEmployees) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No employee selected',
        detail: 'Please select an employee',
        life: 3000
      })
      return
    }

    if (currentProductIndex !== null) {
      const assignedEmployeeData = {
        RefUserId: String(selectedEmployees.RefUserId),
        RefUserFName: selectedEmployees.RefUserFName,
        RefUserCustId: selectedEmployees.RefUserCustId
      }

      const updatedProducts = [...products]
      updatedProducts[currentProductIndex] = {
        ...updatedProducts[currentProductIndex],
        assignedEmployees: [assignedEmployeeData] // store as array with one employee
      }

      setProducts(updatedProducts)
    }

    setShowCustomDialog(false)
    setSelectedEmployees(null)
    setCurrentProductIndex(null)
  }

  return (
    <div className="p-0 flex h-full justify-content-between">
      <Toast ref={toast} />

      <ConfirmDialog />
      {/* Left Section */}
      <div className="" style={{ width: '100%' }}>
        {/* Search Field */}
        <div className="custom-icon-field mb-3 flex justify-content-between w-full gap-2">
          {/* <Search className="lucide-search-icon" size={18} /> */}
          <div className="flex gap-2">
            <InputText
              placeholder="Enter SKU"
              className="search-input"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />

            <Button
              icon={<Search size={16} strokeWidth={2} />}
              severity="success"
              tooltip="Search"
              tooltipOptions={{ position: 'left' }}
              value={sku}
              onClick={handleSKUFetch}
              onChange={(e) => setSku((e.target as HTMLInputElement).value)}
              disabled={!sku}
            />
          </div>

          <div className="flex gap-2">
            <Button
              tooltip="Add Customer"
              tooltipOptions={{ position: 'right' }}
              icon={<Plus size={20} />}
              className="p-button-primary"
              onClick={() => setVisibleRight(true)}
            />
            <Button
              tooltip="Save"
              tooltipOptions={{ position: 'right' }}
              icon={<Save size={20} />}
              className="p-button-primary "
              onClick={handleSave}
            />
            <Button
              label="Payment"
              // icon="pi pi-credit-card"
              icon={<Coins size={20} />}
              onClick={() => setPaymentDialogVisible(true)}
              severity="secondary"
            />
          </div>

          {/* Custom Dialog */}
          <ConfirmDialog
            visible={showCustomDialog}
            onHide={() => setShowCustomDialog(false)}
            header="Enter Employee Details"
            message={
              <div className="flex gap-4 w-full">
                {/* Left: Employee Selector */}
                <div className=" gap-3 w-1/2">
                  <div className="flex mb-3">
                    <label>Select Employees</label>
                  </div>
                  <div className="flex w-full">
                    <Dropdown
                      value={selectedEmployees}
                      onChange={(e) => setSelectedEmployees(e.value)}
                      options={employeeList}
                      optionLabel="RefUserFName"
                      placeholder="Search and select employee"
                      filter
                      className="w-full custom-dropdown"
                      itemTemplate={(option) =>
                        option ? (
                          <div>
                            {option.RefUserFName} ({option.RefUserCustId})
                          </div>
                        ) : null
                      }
                    />
                  </div>
                </div>

                {/* Right: Selected Preview */}
                <div className="gap-2 w-1/2 border-left-1 pl-3">
                  <div className="flex">
                    <label className="font-semibold">Selected Employee</label>
                  </div>
                  <div className="flex">
                    {selectedEmployees ? (
                      <div>
                        ✅ {selectedEmployees.RefUserFName} ({selectedEmployees.RefUserCustId})
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No employee selected</span>
                    )}
                  </div>
                </div>
              </div>
            }
            acceptLabel="Confirm"
            rejectLabel="Cancel"
            accept={handleCustomDialogAccept}
            reject={() => setShowCustomDialog(false)}
          />
        </div>

        <DataTable
          value={products}
          dataKey="id"
          showGridlines
          scrollable
          stripedRows
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          className="flex gap-3 p-datatable-sm"
        >
          <Column
            header="S.No"
            body={(_, opts) => opts.rowIndex + 1}
            style={{ minWidth: '2rem' }}
          />
          <Column
            field="productName"
            header="Product Name"
            editor={textEditor}
            style={{ minWidth: '12rem' }}
            body={(rowData) => (
              <div className=" gap-1">
                <div className="flex">
                  <div className="font-semibold">{rowData.productName}</div>
                </div>
                <div className="flex">
                  {rowData.assignedEmployees?.length > 0 && (
                    <div className="text-sm text-gray-600">
                      👤 {rowData.assignedEmployees.map((emp) => emp.RefUserFName).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}
          />

          <Column field="Price" header="Price" editor={numberEditor} style={{ minWidth: '5rem' }} />
          <Column
            field="quantity"
            header="Quantity"
            editor={numberEditor}
            style={{ minWidth: '7rem' }}
          />
          <Column
            field="Discount"
            header="Discount %"
            editor={numberEditor}
            style={{ minWidth: '6rem' }}
          />
          <Column
            field="DiscountPrice"
            header="Discount in ₹"
            editor={numberEditor}
            style={{ minWidth: '6rem' }}
          />
          <Column
            field="totalPrice"
            header="Total Price"
            editor={numberEditor}
            style={{ minWidth: '6rem' }}
          />
          <Column
            rowEditor
            header="Edit Price"
            bodyStyle={{ textAlign: 'center' }}
            style={{ minWidth: '6rem' }}
          />
          <Column
            header="Cancel"
            style={{ minWidth: '5rem' }}
            body={(rowData) => (
              <Button
                // icon="pi pi-times"
                icon={<X size={20} />}
                className="p-button-danger p-button-2xl"
                tooltip="Remove this product"
                style={{ backgroundColor: 'white', borderColor: 'white', color: 'gray' }}
                onClick={() => {
                  console.log('Removing productId:', rowData.productId)
                  setProducts((prev) => prev.filter((p) => p.productId !== rowData.productId))
                }}
              />
            )}
          />
        </DataTable>
      </div>
      <Dialog
        header="💰 Payment Summary"
        visible={paymentDialogVisible}
        style={{ width: '30vw' }}
        modal
        onHide={() => setPaymentDialogVisible(false)}
        breakpoints={{ '78rem': '90vw', '640px': '100vw' }}
        resizable={true}
        draggable={true}
      >
        <div className="flex flex-column gap-2">
          <div className="flex flex-column gap-2 mt-3 w-full">
            <FloatLabel className="always-float">
              <MultiSelect
                value={paymentModes}
                options={paymentOptions}
                className="w-full"
                onChange={(e) => {
                  setPaymentModes(e.value)
                  if (!e.value.includes('Cash')) {
                    setCashAmount(0)
                    setAmountGiven(0)
                    setChangeReturned(0)
                  }
                  if (!e.value.some((mode) => mode !== 'Cash')) {
                    setOnlineAmount(0)
                  }
                }}
                placeholder="Choose one or more"
              />
              <label>Select Payment Mode(s)</label>
            </FloatLabel>
          </div>

          {paymentModes.includes('Cash') && (
            <div className="flex flex-column gap-4 mt-3">
              <FloatLabel className="always-float">
                <label>Cash Amount Paid</label>
                <InputNumber
                  value={cashAmount}
                  className="w-full"
                  onValueChange={(e) => setCashAmount(e.value || 0)}
                />
              </FloatLabel>
              <FloatLabel className="always-float">
                <label>Amount Given by Customer</label>
                <InputNumber
                  value={amountGiven}
                  className="w-full"
                  onValueChange={(e) => {
                    const given = e.value || 0
                    setAmountGiven(given)
                    setChangeReturned(given - cashAmount)
                  }}
                />
              </FloatLabel>
              <FloatLabel className="always-float">
                <label>Change Returned</label>
                <InputNumber value={changeReturn} className="w-full mb-3" disabled />
              </FloatLabel>
            </div>
          )}

          {paymentModes.some((mode) => mode !== 'Cash') && (
            <div className="flex flex-column gap-2">
              <FloatLabel className="always-float">
                <label>Online Amount Paid</label>
                <InputNumber
                  value={onlineAmount}
                  className="w-full"
                  onValueChange={(e) => setOnlineAmount(e.value || 0)}
                />
              </FloatLabel>
            </div>
          )}

          <div className="mt-2">
            <div className="flex justify-content-between">
              <span>Total Bill:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Total Paid:</span>
              <span>₹{totalPaid}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Balance:</span>
              <span>₹{balance}</span>
            </div>
          </div>

          <Button
            label="Preview Invoice"
            severity="success"
            className="customizedBtn"
            onClick={handlePaymentSubmit}
          />
        </div>
      </Dialog>

      {/* Sidebar for Adding Customers */}
      <Sidebar
        visible={visibleRight}
        position="right"
        header={
          <span style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '1.2rem' }}>
            Add Customer Details
          </span>
        }
        onHide={() => setVisibleRight(false)}
        style={{ width: '50vw' }}
      >
        <POScustomers />
      </Sidebar>
      <Dialog
        header="Invoice Preview"
        visible={previewVisible}
        style={{ width: '600px', maxWidth: '95vw' }}
        modal
        onHide={() => setPreviewVisible(false)}
        breakpoints={{ '960px': '90vw', '640px': '100vw' }}
        resizable={false}
        draggable={false}
      >
        <InvoicePreview
          invoiceNumber={paymentPayload?.refInvoiceNumber || ''}
          date={paymentPayload ? new Date(paymentPayload.refSaleDate).toLocaleDateString() : ''}
          customerName={paymentPayload?.customerName || 'Customer Name'}
          items={products.map((p) => ({
            name: p.productName,
            quantity: p.quantity,
            price: p.Price,
            discount: p.Discount,
            total: p.totalPrice
          }))}
          totalAmount={totalAmount}
          paidAmount={paymentPayload?.totalPaidAmount || 0}
          changeReturned={paymentPayload?.changeReturned || 0}
          payments={
            paymentPayload?.paymentBreakdown
              ? Object.entries(paymentPayload.paymentBreakdown)
                  .filter(([_, amount]) => Number(amount) > 0)
                  .map(([mode, amount]) => ({
                    mode: mode.charAt(0).toUpperCase() + mode.slice(1),
                    amount: Number(amount) // convert unknown to number explicitly
                  }))
              : []
          }
        />
      </Dialog>
    </div>
  )
}

export default POSsalesOrder
