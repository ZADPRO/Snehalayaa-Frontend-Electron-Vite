import { Check } from 'lucide-react'
import { Button } from 'primereact/button'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import React from 'react'

const POScustomers: React.FC = () => {
  return (
    <div className="">
      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refCustomerName"
              // value={refCustomerName}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refCustomerName">Customer Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refMobileNo"
              keyfilter="int"
              // value={refMobileNo}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refMobileNo">Mobile Number</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refAddress"
              // value={refAddress}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refAddress">Address</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refCity"
              // value={refCity}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refCity">City</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refPincode"
              // value={refPincode}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refPincode">Pincode</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refState"
              // value={refState}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refState">State</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refCountry"
              // value={refCountry}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refCountry">Country</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3"></div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refMembershipNumber"
              // value={refMembershipNumber}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refMembershipNumber">Membership Number</label>
          </FloatLabel>
        </div>
        <div className="flex-1 gap-3">
          <FloatLabel className="always-float">
            <InputText
              id="refTaxNumber"
              // value={refTaxNumber}
              // onChange={(e) => setHsnCode(e.target.value)}
              className="w-full"
            />
            <label htmlFor="refTaxNumber">Tax Number</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex justify-content-between gap-2 mt-3">
        <div className="gap-2 flex">
          <Button
            // label={productToEdit ? 'Update' : 'Add'}
            label="Save"
            icon={<Check size={20} />}
            className="gap-2"
            // onClick={handleAdd}
          />
        </div>
      </div>
    </div>
  )
}

export default POScustomers
