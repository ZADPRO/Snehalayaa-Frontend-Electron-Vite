import React, { useEffect, useRef, useState } from 'react'
import { Plus, Save, Search, X } from 'lucide-react'
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
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

const POSsalesOrder: React.FC = () => {
  const [visibleRight, setVisibleRight] = useState(false)
  const [sku, setSku] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [showCustomDialog, setShowCustomDialog] = useState(false)

  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState<number | null>(null)

  const [paymentModes, setPaymentModes] = useState<string[]>([])
  const [cashAmount, setCashAmount] = useState<number>(0)
  const [onlineAmount, setOnlineAmount] = useState<number>(0)
  const [amountGiven, setAmountGiven] = useState<number>(0)
  const [changeReturned, setChangeReturned] = useState<number>(0)
  // const [_finalPaymentPayload, setFinalPaymentPayload] = useState<any | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [paymentPayload, setPaymentPayload] = useState<any | null>(null)
  console.log('paymentPayload', paymentPayload)

  const totalAmount = products.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0)
  const totalPaid = cashAmount + onlineAmount
  const balance = totalAmount - totalPaid

  const paymentOptions = ['Cash', 'GPay', 'Card', 'PhonePe']

  const handlePaymentSubmit = () => {
    if (totalPaid !== totalAmount) {
      toast.current?.show({
        severity: 'error',
        summary: 'Payment mismatch',
        detail: 'Paid amount must match total bill',
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
      refInvoiceNumber: `INV-${Date.now()}`,
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
    const invoiceNumber = `INV-${Date.now()}`
    const customerId = 'CUST001' // Replace with real logic
    const hasCustomer = !!customerId

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
      refInvoiceNumber: invoiceNumber
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
    if (selectedEmployees.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No employee selected',
        detail: 'Please select at least one employee',
        life: 3000
      })
      return
    }

    if (currentProductIndex !== null) {
      // Make a copy of the employee list (or reduce it to necessary fields)
      const assignedEmployeeData = selectedEmployees.map((emp) => ({
        RefUserId: emp.RefUserId,
        RefUserFName: emp.RefUserFName,
        RefUserCustId: emp.RefUserCustId
      }))

      console.log('assignedEmployeeData', assignedEmployeeData)
      const updatedProducts = [...products]
      updatedProducts[currentProductIndex] = {
        ...updatedProducts[currentProductIndex],
        assignedEmployees: assignedEmployeeData
      }

      setProducts(updatedProducts)
    }

    setShowCustomDialog(false)
    setSelectedEmployees([])
    setCurrentProductIndex(null)
  }

  return (
    <div className="p-0 flex h-full justify-content-between">
      <Toast ref={toast} />

      <ConfirmDialog />
      {/* Left Section */}
      <div className="" style={{ width: '76%' }}>
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
              className="p-button-primary gap-2"
              onClick={handleSave}
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
                    <MultiSelect
                      value={selectedEmployees}
                      onChange={(e) => setSelectedEmployees(e.value || [])}
                      options={employeeList}
                      optionLabel="RefUserFName"
                      placeholder="Search and select employees"
                      filter
                      className="w-full custom-multiselect"
                      display="comma"
                      selectedItemTemplate={() => null}
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
                <div className=" gap-2 w-1/2 border-left-1 pl-3">
                  <div className="flex">
                    <label className="font-semibold">Selected Employees</label>
                  </div>
                  <div className="flex">
                    {selectedEmployees?.length > 0 ? (
                      <ul className="list-none p-0 m-0">
                        {selectedEmployees.map((emp, index) => (
                          <li key={emp.RefUserId || index} className="mb-1">
                            ✅ {emp.RefUserFName} ({emp.RefUserCustId})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500">No employees selected</span>
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
            style={{ minWidth: '6rem' }}
          />
          <Column
            field="Discount"
            header="Discount %"
            editor={numberEditor}
            style={{ minWidth: '5rem' }}
          />
          <Column
            field="DiscountPrice"
            header="Discount in ₹"
            editor={numberEditor}
            style={{ minWidth: '5rem' }}
          />
          <Column
            field="totalPrice"
            header="Total Price"
            editor={numberEditor}
            style={{ minWidth: '5rem' }}
          />
          <Column
            rowEditor
            header="Edit Price"
            bodyStyle={{ textAlign: 'center' }}
            style={{ minWidth: '5rem' }}
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
        {/* <div className="mt-3"></div> */}
      </div>

      {/* Vertical Divider */}
      <Divider layout="vertical" className="verticalDivider" />

      {/* Right Panel (Actions) */}
      <div
        style={{ width: '23%' }}
        className="flex flex-column justify-content-between align-items-center mr-2"
      >
        <div className="flex gap-2 pb-3">
          <div className="flex flex-column gap-2">
            <h4 className="text-lg font-bold m-0 ">💰 Payment Summary</h4>

            <div className="flex flex-column gap-2 mt-3 ">
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
                    onValueChange={(e) => setCashAmount(e.value || 0)}
                  />
                </FloatLabel>
                <FloatLabel className="always-float">
                  <label>Amount Given by Customer</label>
                  <InputNumber
                    value={amountGiven}
                    onValueChange={(e) => {
                      const given = e.value || 0
                      setAmountGiven(given)
                      setChangeReturned(given - cashAmount)
                    }}
                  />
                </FloatLabel>

                <label>Change Returned</label>
                <InputNumber value={changeReturned} disabled />
              </div>
            )}

            {paymentModes.some((mode) => mode !== 'Cash') && (
              <div className="flex flex-column gap-2">
                <label>Online Amount Paid</label>
                <InputNumber
                  value={onlineAmount}
                  onValueChange={(e) => setOnlineAmount(e.value || 0)}
                />
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
        </div>
      </div>

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
