import { Coins, Search, X } from 'lucide-react'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import React, { useEffect, useRef, useState } from 'react'
import { Employee, Product } from './POSsalesReturn.interface'
import { fetchEmployees, fetchProductBySKU } from './POSsalesReturn.function'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

const POSsalesReturn: React.FC = () => {
  const toast = useRef<Toast>(null)

  const [sku, setSku] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [showCustomDialog, setShowCustomDialog] = useState(false)

  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [selectedReturnEmployees, setSelectedReturnEmployees] = useState<any[]>([])
  const [soldEmployees, setSoldEmployees] = useState<any[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState<number | null>(null)

  const [customerMobile, setCustomerMobile] = useState<string>('')

  const handleSKUFetch = async () => {
    try {
      const product = await fetchProductBySKU(sku)
      console.log('product', product)
      setProducts((prev) => [...prev, product])
      setSoldEmployees(product.SoldEmployee || [])
      setCustomerMobile(product.customerPhoneNumber || '') // capture mobile number

      setSku('')
      setCurrentProductIndex(products.length) // Index of the product just added
      setShowCustomDialog(true)
    } catch (error) {
      console.log('error', error)
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

  const handleReturnClick = () => {
    confirmDialog({
      header: 'Add Credit Confirmation',
      message: (
        <div>
          <p>
            <strong>Customer Mobile:</strong> {customerMobile || 'N/A'}
          </p>
          <p>Are you sure you want to add the credit to the customer?</p>
        </div>
      ),
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        toast.current?.show({
          severity: 'success',
          summary: 'Credit Added',
          detail: `Amount successfully added to the customer's credit.`,
          life: 3000
        })

        // ✅ Empty the table after successful return
        setProducts([])
      },
      reject: () => {
        console.log('Credit addition cancelled')
      }
    })
  }

  useEffect(() => {
    if (showCustomDialog) {
      fetchEmployees().then((data) => setEmployeeList(data))
    }
  }, [showCustomDialog])

  const handleCustomDialogAccept = () => {
    if (selectedReturnEmployees.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No employee selected',
        detail: 'Please select at least one employee',
        life: 3000
      })
      return
    }

    if (currentProductIndex !== null) {
      const assignedEmployeeData = selectedReturnEmployees.map((emp) => ({
        RefUserId: emp.RefUserId,
        RefUserFName: emp.RefUserFName,
        RefUserCustId: emp.RefUserCustId
      }))

      console.log('assignedEmployeeData', assignedEmployeeData)
      const updatedProducts = [...products]
      updatedProducts[currentProductIndex] = {
        ...updatedProducts[currentProductIndex],
        SoldEmployee: assignedEmployeeData
      }

      setProducts(updatedProducts)
    }

    setShowCustomDialog(false)
    setSelectedReturnEmployees([])
    setCurrentProductIndex(null)
  }

  const handleEditEmployees = (index: number, product: Product) => {
    setCurrentProductIndex(index)
    setSelectedReturnEmployees(product.SoldEmployee || [])
    setSoldEmployees(product.SoldEmployee || [])
    setShowCustomDialog(true)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="" style={{ width: '100%' }}>
        <div className="custom-icon-field mb-3 flex justify-content-between w-full gap-2">
          <div className="flex gap-2 ">
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
              label="Return"
              icon={<Coins size={20} />}
              onClick={handleReturnClick} // ✅ return click handler
              severity="secondary"
            />
          </div>

          {/* Custom Dialog */}
          <ConfirmDialog
            visible={showCustomDialog}
            onHide={() => setShowCustomDialog(false)}
            header="Sales Return - Employee Details"
            message={
              <div className="flex gap-4 w-full">
                {/* Left: Select Return Handlers */}
                <div className="gap-3 w-1/2">
                  <div className="flex mb-3">
                    <label className="font-semibold">Select Return Handlers</label>
                  </div>
                  <div className="flex w-full">
                    <MultiSelect
                      value={selectedReturnEmployees}
                      onChange={(e) => setSelectedReturnEmployees(e.value || [])}
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

                {/* Right: Sold By + Selected Return Handlers */}
                <div className="gap-2 w-1/2 border-left-1 pl-3">
                  {/* Sold By Section */}
                  <div className="mb-3">
                    <label className="font-semibold flex">Sold By</label>
                    {soldEmployees?.length > 0 ? (
                      <ul className="list-none p-0 m-0">
                        {soldEmployees.map((emp, index) => (
                          <li key={emp.RefUserId || index} className="mb-1">
                            🛒 {emp.RefUserFName} ({emp.RefUserCustId})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500">No sale employee data</span>
                    )}
                  </div>

                  {/* Selected Return Handlers Section */}
                  <div>
                    <label className="font-semibold flex">Return Handlers</label>
                    {selectedReturnEmployees?.length > 0 ? (
                      <ul className="list-none p-0 m-0">
                        {selectedReturnEmployees.map((emp, index) => (
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
          className="flex gap-3 p-datatable-sm"
        >
          <Column
            header="S.No"
            body={(_, opts) => opts.rowIndex + 1}
            style={{ minWidth: '2rem', textAlign: 'center' }}
          />
          <Column
            field="refSaleCode"
            header="Sale Code"
            style={{ minWidth: '12rem', textAlign: 'center', cursor: 'pointer' }}
            body={(rowData, options) => (
              <div
                className="gap-1 hover:bg-gray-100 p-2 rounded transition"
                onClick={() => handleEditEmployees(options.rowIndex, rowData)}
              >
                <div className="flex">
                  <div className="font-semibold">{rowData.productName}</div>
                </div>
                <div className="flex">
                  {rowData.SoldEmployee?.length > 0 && (
                    <div className="text-sm text-gray-600">
                      👤 {rowData.SoldEmployee.map((emp) => emp.RefUserFName).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}
          />

          <Column field="Price" header="Price" style={{ minWidth: '5rem', textAlign: 'center' }} />
          <Column
            field="isDiscountApplied"
            header="Is Discount Applied"
            style={{ minWidth: '7rem', textAlign: 'center' }}
          />
          <Column
            field="quantity"
            header="Quantity"
            style={{ minWidth: '7rem', textAlign: 'center' }}
          />
          <Column
            field="customerName"
            header="Customer Name"
            style={{ minWidth: '6rem', textAlign: 'center' }}
          />
          <Column
            field="customerPhoneNumber"
            header="Customer Phone Numer"
            style={{ minWidth: '6rem', textAlign: 'center' }}
          />

          <Column
            header="Cancel"
            style={{ minWidth: '5rem' }}
            body={(rowData) => (
              <Button
                icon={<X size={20} />}
                className="p-button-danger p-button-2xl"
                tooltip="Remove"
                style={{ backgroundColor: 'white', borderColor: 'white', color: 'gray' }}
                onClick={() => {
                  setProducts((prev) => prev.filter((p) => p.productId !== rowData.productId))
                }}
              />
            )}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default POSsalesReturn
