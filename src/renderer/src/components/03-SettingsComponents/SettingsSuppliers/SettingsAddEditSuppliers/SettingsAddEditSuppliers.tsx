import React, { useEffect, useRef, useState } from 'react'
import {
  SettingsAddEditSupplierProps,
  Supplier,
  SupplierFormData,
  SupplierStatusOptions
} from './SettingsAddEditSuppliers.interface'
import { Toast } from 'primereact/toast'
import { createSupplier, updateSupplier } from './SettingsAddEditSuppliers.function'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'

const SettingsAddEditSuppliers: React.FC<SettingsAddEditSupplierProps> = ({
  selectedSupplier,
  onClose,
  reloadData
}) => {
  const toast = useRef<Toast>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<SupplierFormData>({
    supplierName: '',
    supplierCompanyName: '',
    supplierCode: '',
    supplierEmail: '',
    supplierGSTNumber: '',
    supplierPaymentTerms: '',
    supplierBankACNumber: '',
    supplierIFSC: '',
    supplierBankName: '',
    supplierUPI: '',
    supplierContactNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    supplierDoorNumber: '',
    supplierStreet: '',
    supplierCity: '',
    supplierState: '',
    supplierCountry: '',
    selectedStatus: { name: 'Active', isActive: true }
  })

  const [creditedDays, setCreditedDays] = useState<number>(0)
  const [creditedUntilDate, setCreditedUntilDate] = useState<Date>(new Date())

  const statusOptions: SupplierStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'Inactive', isActive: false }
  ]

  const handleCreditedDaysChange = (value: string) => {
    const numeric = value.replace(/\D/g, '')
    const days = parseInt(numeric || '0', 10)
    setCreditedDays(days)

    const calculatedDate = new Date()
    calculatedDate.setDate(calculatedDate.getDate() + days)
    setCreditedUntilDate(calculatedDate)
  }

  const handleCreditedDateChange = (date: Date) => {
    setCreditedUntilDate(date)

    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setCreditedDays(diffDays > 0 ? diffDays : 0)
  }

  useEffect(() => {
    if (selectedSupplier) {
      setFormData({
        supplierName: selectedSupplier.supplierName,
        supplierCompanyName: selectedSupplier.supplierCompanyName,
        supplierCode: selectedSupplier.supplierCode,
        supplierEmail: selectedSupplier.supplierEmail,
        supplierGSTNumber: selectedSupplier.supplierGSTNumber,
        supplierPaymentTerms: selectedSupplier.supplierPaymentTerms,
        supplierBankACNumber: selectedSupplier.supplierBankACNumber,
        supplierIFSC: selectedSupplier.supplierIFSC,
        supplierBankName: selectedSupplier.supplierBankName,
        supplierUPI: selectedSupplier.supplierUPI,
        supplierContactNumber: selectedSupplier.supplierContactNumber,
        emergencyContactName: selectedSupplier.emergencyContactName,
        emergencyContactNumber: selectedSupplier.emergencyContactNumber,
        supplierDoorNumber: selectedSupplier.supplierDoorNumber,
        supplierStreet: selectedSupplier.supplierStreet,
        supplierCity: selectedSupplier.supplierCity,
        supplierState: selectedSupplier.supplierState,
        supplierCountry: selectedSupplier.supplierCountry,
        selectedStatus: selectedSupplier.supplierIsActive
          ? { name: 'Active', isActive: true }
          : { name: 'Inactive', isActive: false }
      })
    }
  }, [selectedSupplier])

  const handleInputChange = (
    field: keyof SupplierFormData,
    value: string | SupplierStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.supplierName || !formData.supplierCompanyName || !formData.supplierCode) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields',
        life: 3000
      })
      return
    }

    const payload: Partial<Supplier> = {
      supplierName: formData.supplierName,
      supplierCompanyName: formData.supplierCompanyName,
      supplierCode: formData.supplierCode,
      supplierEmail: formData.supplierEmail,
      supplierGSTNumber: formData.supplierGSTNumber,
      supplierPaymentTerms: formData.supplierPaymentTerms,
      supplierBankACNumber: formData.supplierBankACNumber,
      supplierIFSC: formData.supplierIFSC,
      supplierBankName: formData.supplierBankName,
      supplierUPI: formData.supplierUPI,
      supplierContactNumber: formData.supplierContactNumber,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactNumber: formData.emergencyContactNumber,
      supplierDoorNumber: formData.supplierDoorNumber,
      supplierStreet: formData.supplierStreet,
      supplierCity: formData.supplierCity,
      supplierState: formData.supplierState,
      supplierCountry: formData.supplierCountry,
      supplierIsActive: formData.selectedStatus?.isActive ? 'true' : 'false'
    }

    if (selectedSupplier) payload.supplierId = selectedSupplier.supplierId

    try {
      setIsSubmitting(true)

      const result = selectedSupplier
        ? await updateSupplier(payload)
        : await createSupplier(payload)

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: result.message || 'Operation successful',
        life: 3000
      })

      onClose()
      reloadData()
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Operation failed',
        life: 3000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-3">
      <Toast ref={toast} />
      <div className="">
        <p>Basic details</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierName"
                value={formData.supplierName}
                className="w-full"
                onChange={(e) => handleInputChange('supplierName', e.target.value)}
              />
              <label htmlFor="supplierName">Supplier Name</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierCompanyName"
                value={formData.supplierCompanyName}
                className="w-full"
                onChange={(e) => handleInputChange('supplierCompanyName', e.target.value)}
              />
              <label htmlFor="supplierCompanyName">Supplier Company Name</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierCode"
                value={formData.supplierCode}
                className="w-full"
                onChange={(e) => handleInputChange('supplierCode', e.target.value)}
              />
              <label htmlFor="supplierCode">Supplier code</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="supplier-status"
                value={formData.selectedStatus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedStatus: e.value
                  }))
                }
                options={statusOptions}
                optionLabel="name"
                className="w-full"
              />
              <label htmlFor="status">Status</label>
            </FloatLabel>
          </div>
        </div>

        <p className="mt-3">Credited Days</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="creditedDays"
                value={creditedDays.toString()}
                className="w-full"
                keyfilter="int"
                onChange={(e) => handleCreditedDaysChange(e.target.value)}
              />
              <label htmlFor="creditedDays">Credited Days</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                id="creditedUntilDate"
                value={creditedUntilDate}
                className="w-full"
                onChange={(e) => handleCreditedDateChange(e.value as Date)}
                dateFormat="dd/mm/yy"
              />
              <label htmlFor="creditedUntilDate">Credited Until</label>
            </FloatLabel>
          </div>
        </div>

        <p className="mt-3">Communication details</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierEmail"
                value={formData.supplierEmail}
                className="w-full"
                onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
              />
              <label htmlFor="supplierEmail"> Email</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierContactNumber"
                value={formData.supplierContactNumber}
                className="w-full"
                onChange={(e) => handleInputChange('supplierContactNumber', e.target.value)}
              />
              <label htmlFor="supplierContactNumber">Contact Number</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierDoorNumber"
                value={formData.supplierDoorNumber}
                className="w-full"
                onChange={(e) => handleInputChange('supplierDoorNumber', e.target.value)}
              />
              <label htmlFor="supplierDoorNumber">Door Number</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierStreet"
                value={formData.supplierStreet}
                className="w-full"
                onChange={(e) => handleInputChange('supplierStreet', e.target.value)}
              />
              <label htmlFor="supplierStreet"> Street</label>
            </FloatLabel>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierCity"
                value={formData.supplierCity}
                className="w-full"
                onChange={(e) => handleInputChange('supplierCity', e.target.value)}
              />
              <label htmlFor="supplierCity">City</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierState"
                value={formData.supplierState}
                className="w-full"
                onChange={(e) => handleInputChange('supplierState', e.target.value)}
              />
              <label htmlFor="supplierState"> State</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierCountry"
                value={formData.supplierCountry}
                className="w-full"
                onChange={(e) => handleInputChange('supplierCountry', e.target.value)}
              />
              <label htmlFor="supplierCountry">Country</label>
            </FloatLabel>
          </div>
          <div className="flex-1"></div>
        </div>

        <p className="mt-3">Bank details</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierBankName"
                value={formData.supplierBankName}
                className="w-full"
                onChange={(e) => handleInputChange('supplierBankName', e.target.value)}
              />
              <label htmlFor="supplierBankName">Account Holder Name</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierBankACNumber"
                value={formData.supplierBankACNumber}
                className="w-full"
                onChange={(e) => handleInputChange('supplierBankACNumber', e.target.value)}
              />
              <label htmlFor="supplierBankACNumber">Account Number</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierIFSC"
                value={formData.supplierIFSC}
                className="w-full"
                onChange={(e) => handleInputChange('supplierIFSC', e.target.value)}
              />
              <label htmlFor="supplierIFSC">IFSC Code</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierGSTNumber"
                value={formData.supplierGSTNumber}
                className="w-full"
                onChange={(e) => handleInputChange('supplierGSTNumber', e.target.value)}
              />
              <label htmlFor="supplierGSTNumber">GST Number</label>
            </FloatLabel>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierUPI"
                value={formData.supplierUPI}
                className="w-full"
                onChange={(e) => handleInputChange('supplierUPI', e.target.value)}
              />
              <label htmlFor="supplierUPI">UPI Id</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="supplierPaymentTerms"
                value={formData.supplierPaymentTerms}
                className="w-full"
                onChange={(e) => handleInputChange('supplierPaymentTerms', e.target.value)}
              />
              <label htmlFor="supplierPaymentTerms">Payment Terms</label>
            </FloatLabel>
          </div>
        </div>

        <p className="mt-3">Emergency Contact </p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="emergencyContactName"
                value={formData.emergencyContactName}
                className="w-full"
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              />
              <label htmlFor="emergencyContactName">Emergency Contact Name</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                className="w-full"
                onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
              />
              <label htmlFor="emergencyContactNumber">Emergency Contact Number</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex justify-content-end mt-3">
          <Button
            // label="Save"
            label={selectedSupplier ? 'Update' : 'Save'}
            icon="pi pi-check"
            className="bg-[#8e5ea8] border-none gap-2"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right z-10">
        <Button
          label="Save"
          // label={selectedCategory ? 'Update' : 'Save'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          // onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div> */}
    </div>
  )
}

export default SettingsAddEditSuppliers
