import { Check, Search } from 'lucide-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import React, { useRef, useState } from 'react'
import { addNewCustomer, fetchCustomerByMobile } from './POScustomers.function'
import { Toast } from 'primereact/toast'
import { CustomerPayload } from './POScustomers.interface'

const POScustomers: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('')
  const [customerData, setCustomerData] = useState({
    refCustomerName: '',
    refAddress: '',
    refCity: '',
    refPincode: '',
    refState: '',
    refCountry: '',
    refMembershipNumber: '',
    refTaxNumber: ''
  })
  const [customerFound, setCustomerFound] = useState<boolean | null>(null) // null: no search yet
  const toast = useRef<Toast>(null)

  const handleSearch = async () => {
    if (!mobileNumber) return

    const result = await fetchCustomerByMobile(mobileNumber)
    if (result) {
      setCustomerData(result as any)
      setCustomerFound(true)
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Customer added successfully',
        life: 3000
      })
    } else {
      // No customer found
      setCustomerData({
        refCustomerName: '',
        refAddress: '',
        refCity: '',
        refPincode: '',
        refState: '',
        refCountry: '',
        refMembershipNumber: '',
        refTaxNumber: ''
      })
      setCustomerFound(false)
      toast.current?.show({
        severity: 'warn',
        summary: 'Customer Not Found',
        detail: 'Please add a new customer.',
        life: 3000
      })
    }
  }

   const handleAddCustomer = async () => {
    if (!mobileNumber) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Mobile Number Missing',
        detail: 'Please enter a mobile number before adding a customer.',
        life: 3000
      })
      return
    }

    // Prepare payload
    const payload: CustomerPayload = {
      refMobileNo: mobileNumber,
      refCustomerName: customerData.refCustomerName,
      refAddress: customerData.refAddress,
      refCity: customerData.refCity,
      refPincode: customerData.refPincode,
      refState: customerData.refState,
      refCountry: customerData.refCountry,
      refMembershipNumber: customerData.refMembershipNumber,
      refTaxNumber: customerData.refTaxNumber
    }

    try {
      const result = await addNewCustomer(payload)
      console.log('result', result)
      toast.current?.show({
        severity: 'success',
        summary: 'Customer Added',
        detail: 'New customer has been added successfully.',
        life: 3000
      })
      setCustomerFound(true)
      // Optionally reset form or update UI
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Add Failed',
        detail: 'Failed to add customer. Please try again.',
        life: 3000
      })
    }
  }


  return (
    <div className="">
      <Toast ref={toast} />

      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refMobileNo"
              keyfilter="int"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value)
                setCustomerFound(null) // reset on change
              }}
              className="w-full"
            />
            <label htmlFor="refMobileNo">Mobile Number</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          {customerFound === false ? (
            <Button
              label="Add Customer"
              icon={<Check size={20} />}
              className="gap-2"
              onClick={handleAddCustomer}
            />
          ) : (
            <Button
              label="Search"
              icon={<Search size={20} />}
              className="gap-2"
              onClick={handleSearch}
              disabled={!mobileNumber}
            />
          )}
        </div>
      </div>
      <Divider />

      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refCustomerName"
              value={customerData.refCustomerName}
              onChange={(e) =>
                setCustomerData({ ...customerData, refCustomerName: e.target.value })
              }
              className="w-full"
            />
            <label htmlFor="refCustomerName">Customer Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refAddress"
              value={customerData.refAddress}
              onChange={(e) => setCustomerData({ ...customerData, refAddress: e.target.value })}
              className="w-full"
            />
            <label htmlFor="refAddress">Address</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refCity"
              value={customerData.refCity}
              onChange={(e) => setCustomerData({ ...customerData, refCity: e.target.value })}
              className="w-full"
            />
            <label htmlFor="refCity">City</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refPincode"
              value={customerData.refPincode}
              onChange={(e) => setCustomerData({ ...customerData, refPincode: e.target.value })}
              className="w-full"
            />
            <label htmlFor="refPincode">Pincode</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refState"
              value={customerData.refState}
              onChange={(e) => setCustomerData({ ...customerData, refState: e.target.value })}
              className="w-full"
            />
            <label htmlFor="refState">State</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refCountry"
              value={customerData.refCountry}
              onChange={(e) => setCustomerData({ ...customerData, refCountry: e.target.value })}
              className="w-full"
            />
            <label htmlFor="refCountry">Country</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refMembershipNumber"
              value={customerData.refMembershipNumber}
              onChange={(e) =>
                setCustomerData({ ...customerData, refMembershipNumber: e.target.value })
              }
              className="w-full"
            />
            <label htmlFor="refMembershipNumber">Membership Number</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refTaxNumber"
              value={customerData.refTaxNumber}
              onChange={(e) => setCustomerData({ ...customerData, refTaxNumber: e.target.value })}
              className="w-full"
            />
            <label htmlFor="refTaxNumber">Tax Number</label>
          </FloatLabel>
        </div>
      </div>
    </div>
  )
}

export default POScustomers
