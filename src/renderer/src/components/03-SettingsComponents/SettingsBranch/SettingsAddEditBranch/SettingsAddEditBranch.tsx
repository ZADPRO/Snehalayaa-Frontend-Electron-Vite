import React, { useEffect, useRef, useState } from 'react'
import {
  Branch,
  BranchFormData,
  BranchStatusOptions,
  SettingsAddEditBranchProps
} from './SettingsAddEditBranch.interface'
import { Toast } from 'primereact/toast'
import { createBranch, updateBranch } from './SettingsAddEditBranch.function'
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

type FloorWithSections = {
  floorName: string
  sections: string[]
}

const SettingsAddEditBranch: React.FC<SettingsAddEditBranchProps> = ({
  selectedBranches,
  onClose,
  reloadData
}) => {
  const toast = useRef<Toast>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [floorCount, setFloorCount] = useState(0)

  const [floorsWithSections, setFloorsWithSections] = useState<FloorWithSections[]>([])

  // Handle floor count input
  const handleFloorCountChange = (value: string) => {
    const count = parseInt(value) || 0
    setFloorCount(count)
    const updatedFloors = Array.from({ length: count }, (_, i) => {
      return floorsWithSections[i] || { floorName: '', sections: [] }
    })
    setFloorsWithSections(updatedFloors)
  }

  // Handle section count input
  const handleSectionCountChange = (floorIndex: number, countStr: string) => {
    const count = parseInt(countStr) || 0
    setFloorsWithSections((prev) => {
      const updated = [...prev]
      updated[floorIndex].sections = Array.from(
        { length: count },
        (_, i) => updated[floorIndex].sections?.[i] || ''
      )
      return updated
    })
  }

  const [formData, setFormData] = useState<BranchFormData>({
    // refBranchId:0,
    refBranchName: '',
    refBranchCode: '',
    refLocation: '',
    refMobile: '',
    refEmail: '',
    isMainBranch: false,
    isOnlineORoffline: false,
    selectedStatus: { name: 'Active', isActive: true }
  })

  const statusOptions: BranchStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'Inactive', isActive: false }
  ]

  useEffect(() => {
    if (selectedBranches) {
      setFormData({
        // refBranchId:selectedBranches.refBranchId??0,
        refBranchName: selectedBranches.refBranchName,
        refBranchCode: selectedBranches.refBranchCode,
        refLocation: selectedBranches.refLocation,
        refMobile: selectedBranches.refMobile,
        refEmail: selectedBranches.refEmail,
        isMainBranch: selectedBranches.isMainBranch,
        isOnlineORoffline: selectedBranches.isOnlineORoffline,
        selectedStatus: selectedBranches.isActive
          ? { name: 'Active', isActive: true }
          : { name: 'Inactive', isActive: false }
      })
    }
  }, [selectedBranches])

  const handleInputChange = (
    field: keyof BranchFormData,
    value: string | BranchStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.refBranchName) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields',
        life: 3000
      })
      return
    }

    const payload: Partial<Branch> = {
      refBranchName: formData.refBranchName,
      refBranchCode: formData.refBranchCode,
      refLocation: formData.refLocation,
      refMobile: formData.refMobile,
      refEmail: formData.refEmail,
      isMainBranch: formData.isMainBranch,
      isActive: formData.selectedStatus?.isActive ? true : false
    }

    if (selectedBranches) payload.refBranchId = selectedBranches.refBranchId

    try {
      setIsSubmitting(true)

      const result = selectedBranches ? await updateBranch(payload) : await createBranch(payload)

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
  const booleanOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ]

  const Options = [
    { label: 'Online', value: true },
    { label: 'Offline', value: false }
  ]
  return (
    <div className="mt-3">
      <Toast ref={toast} />
      <div className="">
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchName"
                value={formData.refBranchName}
                className="w-full"
                onChange={(e) => handleInputChange('refBranchName', e.target.value)}
              />
              <label htmlFor="refBranchName">Branch Name</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchCode"
                value={formData.refBranchCode}
                className="w-full"
                onChange={(e) => handleInputChange('refBranchCode', e.target.value)}
              />
              <label htmlFor="refBranchCode">Branch code</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refMobile"
                value={formData.refMobile}
                className="w-full"
                onChange={(e) => handleInputChange('refMobile', e.target.value)}
              />
              <label htmlFor="refMobile">Contact Number</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refEmail"
                value={formData.refEmail}
                className="w-full"
                onChange={(e) => handleInputChange('refEmail', e.target.value)}
              />
              <label htmlFor="refEmail">Email</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refLocation"
                value={formData.refLocation}
                className="w-full"
                onChange={(e) => handleInputChange('refLocation', e.target.value)}
              />
              <label htmlFor="refLocation">Location</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="isMainBranch"
                className="w-full"
                value={formData.isMainBranch} // should be boolean: true or false
                options={booleanOptions}
                onChange={(e) => handleInputChange('isMainBranch', e.value)} // e.value is true/false
                placeholder="Select"
              />
              <label htmlFor="isMainBranch">Is Main Branch</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="selectedStatus"
                className="w-full"
                value={formData.selectedStatus}
                options={statusOptions}
                onChange={(e) => handleInputChange('selectedStatus', e.value)}
                optionLabel="name"
                placeholder="Select"
              />
              <label htmlFor="selectedStatus">Status</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="isOnlineORoffline"
                className="w-full"
                value={formData.isOnlineORoffline}
                options={Options}
                onChange={(e) => handleInputChange('isOnlineORoffline', e.value)}
                placeholder="Select"
              />
              <label htmlFor="isOnlineORoffline">Online OR Offline</label>
            </FloatLabel>
          </div>
        </div>

        {/* <div className="flex  gap-4 mt-3"> */}
        {/* Count Inputs Row */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="floorCount"
                value={floorCount > 0 ? floorCount.toString() : ''}
                onChange={(e) => handleFloorCountChange(e.target.value)}
                className="w-full"
              />
              <label htmlFor="floorCount">Floor Count</label>
            </FloatLabel>
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="flex gap-3 mt-5">
          {floorsWithSections.map((floor, floorIndex) => (
            <div
              key={`floor-${floorIndex}`}
              className="mb-4 border p-3 rounded shadow-md bg-gray-50"
            >
              <FloatLabel className="always-float mb-2">
                <InputText
                  value={floor.floorName}
                  onChange={(e) => {
                    const updated = [...floorsWithSections]
                    updated[floorIndex].floorName = e.target.value
                    setFloorsWithSections(updated)
                  }}
                  className="w-full"
                />
                <label>Floor {floorIndex + 1} Name</label>
              </FloatLabel>

              <FloatLabel className="always-float mb-2">
                <InputText
                  value={floor.sections.length.toString()}
                  onChange={(e) => handleSectionCountChange(floorIndex, e.target.value)}
                  className="w-full"
                />
                <label>Section Count</label>
              </FloatLabel>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                {floor.sections.map((section, sectionIndex) => (
                  <FloatLabel
                    key={`section-${floorIndex}-${sectionIndex}`}
                    className="always-float"
                  >
                    <InputText
                      value={section}
                      onChange={(e) => {
                        const updated = [...floorsWithSections]
                        updated[floorIndex].sections[sectionIndex] = e.target.value
                        setFloorsWithSections(updated)
                      }}
                      className="w-full"
                    />
                    <label>Section {sectionIndex + 1}</label>
                  </FloatLabel>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="sectionCount"
                value={sectionCount > 0 ? sectionCount.toString() : ''}
                // onChange={(e) => handleSectionCountChange(e.target.value)}
                className="w-full"
              />
              <label htmlFor="sectionCount">Section Count</label>
            </FloatLabel>
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="flex gap-3 mt-5">
          {sections.length > 0 && (
            <div className="flex gap-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sections.map((value, index) => (
                  <FloatLabel key={`section-${index}`} className="always-float">
                    <InputText
                      id={`section-${index}`}
                      value={value}
                      onChange={(e) => {
                        const updated = [...sections]
                        updated[index] = e.target.value
                        setSections(updated)
                      }}
                      className="w-full"
                    />
                    <label htmlFor={`section-${index}`}>Section {index + 1} Name</label>
                  </FloatLabel>
                ))}
              </div>
            </div>
          )}
        </div> */}

        <div className="flex justify-content-end mt-3">
          <Button
            // label="Save"
            label={selectedBranches ? 'Update' : 'Save'}
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

export default SettingsAddEditBranch
