import React, { useEffect, useRef, useState } from 'react'
import {  Plus, Search, Upload } from 'lucide-react'
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import POScustomers from '../POScustomers/POScustomers'
import { InputNumber } from 'primereact/inputnumber'
import { Employee, Product } from './POSsalesOrder.interface'
import { fetchEmployees, fetchProductBySKU } from './POSsalesOrder.function'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { MultiSelect } from 'primereact/multiselect'
import { Toast } from 'primereact/toast'

const POSsalesOrder: React.FC = () => {
  const [visibleRight, setVisibleRight] = useState(false)
  const [sku, setSku] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [showCustomDialog, setShowCustomDialog] = useState(false)

  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState<number | null>(null)

  console.log('Selected employees:----------------line 27', selectedEmployees)

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

  // const handleSKUFetch = async () => {
  //   try {
  //     const product = await fetchProductBySKU(sku)
  //     setProducts((prev) => [...prev, product])
  //     setSku('')
  //     setShowCustomDialog(true) // show custom dialog with input box
  //   } catch (error) {
  //     confirmDialog({
  //       message: 'No product found for this SKU. Do you want to try again?',
  //       header: 'Product Not Found',
  //       // icon: 'pi pi-exclamation-triangle',
  //       acceptLabel: 'Yes',
  //       rejectLabel: 'No',
  //       accept: () => setSku(''),
  //       reject: () => console.log('User cancelled')
  //     })
  //   }
  // }

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

  // const handleCustomDialogAccept = () => {
  //   const selectedEmployeeIds = selectedEmployees.map((emp) => emp.RefUserId)
  //   console.log('Selected employee IDs:', selectedEmployeeIds)
  //   setShowCustomDialog(false)
  //   setSelectedEmployees([])

  //   // Return or pass the selectedEmployeeIds as needed
  //   return selectedEmployeeIds
  // }

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
    <div className="pt-3 flex h-full w-full gap-3">
      <ConfirmDialog />
      {/* Left Section */}
      <div className="flex-1">
        {/* Search Field */}
        <div className="custom-icon-field mb-3 flex gap-2">
          {/* <Search className="lucide-search-icon" size={18} /> */}
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
          stripedRows
          editMode="row"
          onRowEditComplete={onRowEditComplete}
        >
          <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ maxWidth: '50px' }} />
          <Column
            field="productName"
            header="Product Name"
            editor={textEditor}
            style={{ maxWidth: '250px' }}
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

          <Column
            field="Price"
            header="Price"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="quantity"
            header="Quantity"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="Discount"
            header="Discount %"
            editor={numberEditor}
            style={{ maxWidth: '100px' }}
          />
          <Column
            field="DiscountPrice"
            header="Discount in ₹"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="totalPrice"
            header="Total Price"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            rowEditor
            header="Edit Price"
            headerStyle={{ width: '10%', maxWidth: '100px' }}
            bodyStyle={{ textAlign: 'center' }}
          />
        </DataTable>
        <div className="mt-3">
       
        </div>
      </div>

      {/* Vertical Divider */}
      <Divider layout="vertical" />

      {/* Right Panel (Actions) */}
      <div style={{ width: '17%' }} className="flex flex-column justify-content-between">
        <div className="flex flex-column gap-2">
          <Button
            label="Add Customer"
            className="w-full p-button-primary gap-2"
            icon={<Plus size={20} />}
            onClick={() => setVisibleRight(true)}
          />

          <Button
            label="Upload Invoice"
            icon={<Upload size={20} />}
            className="w-full p-button-primary gap-2"
          />
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
    </div>
  )
}

export default POSsalesOrder
