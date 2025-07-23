import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import {
  Employee,
  EmployeeBranch,
  EmployeeFormData,
  EmployeeRoleType,
  EmployeeStatusOptions,
  SettingsAddEditEmployeeProps
} from './SettingsAddEditEmployees.interface'
import {
  createEmployee,
  // fetchBranch,
  // fetchRoleType,
  updateEmployee
} from './SettingsAddEditEmployees.function'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

const SettingsAddEditEmployees: React.FC<SettingsAddEditEmployeeProps> = ({
  selectedEmployees,
  onClose,
  reloadData
}) => {
  const toast = useRef<Toast>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roleTypes, _setRoleTypes] = useState<EmployeeRoleType[]>([])
  console.log('roleTypes', roleTypes)
  const [branches, _setBranches] = useState<EmployeeBranch[]>([])
  console.log('branches', branches)

  const [formData, setFormData] = useState<EmployeeFormData>({
    RefUserBranchId: 0,
    refRTId: 0,
    RefUserCustId: '',
    RefUserRefUserDesignation: '',
    RefUserFName: '',
    RefUserLName: '',
    selectedStatus: { name: 'Active', RefUserStatus: 'Active' },
    city: '',
    doorNumber: '',
    streetName: '',
    state: '',
    username: '',
    email: '',
    mobile: '',
    selectedRoleType: null,
    selectedBranch: null
  })

  const statusOptions: EmployeeStatusOptions[] = [
    { name: 'Active', RefUserStatus: 'Active' },
    { name: 'Inactive', RefUserStatus: 'Inactive' }
  ]

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        // const [roleTypeData, branchData] = await Promise.all([fetchRoleType(), fetchBranch()])

        // setRoleTypes(roleTypeData)
        // setBranches(branchData)
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch dropdown data',
          life: 3000
        })
      }
    }

    loadDropdownData()
  }, [])

  useEffect(() => {
    if (selectedEmployees && roleTypes.length > 0 && branches.length > 0) {
      const emp = selectedEmployees

      const selectedRole = roleTypes.find((rt) => rt.refRTId === emp.roleTypeId) || null
      const selectedBr = branches.find((br) => br.refBranchId === emp.branchId) || null

      setFormData({
        RefUserBranchId: emp.branchId,
        refRTId: emp.roleTypeId,
        RefUserCustId: emp.RefUserCustId,
        RefUserRefUserDesignation: emp.RefUserDesignation,
        RefUserFName: emp.RefUserFName,
        RefUserLName: emp.RefUserLName,
        city: emp.city,
        doorNumber: emp.doorNumber,
        streetName: emp.streetName,
        state: emp.state,
        username: emp.username,
        email: emp.email,
        mobile: emp.mobile,
        selectedStatus:
          emp.refUserStatus === 'Active'
            ? { name: 'Active', RefUserStatus: 'Active' }
            : { name: 'Inactive', RefUserStatus: 'Inactive' },
        selectedRoleType: selectedRole,
        selectedBranch: selectedBr
      })
    }
  }, [selectedEmployees, roleTypes, branches])

  const isDropdownLoading = branches.length === 0 || roleTypes.length === 0
  if (isDropdownLoading) {
    return <div className="p-4">Loading employee data...</div>
  }

  const handleInputChange = (
    field: keyof EmployeeFormData,
    value: string | EmployeeStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }
  const handleSubmit = async () => {
    if (!formData.username || !formData.mobile || !formData.selectedStatus) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields',
        life: 3000
      })
      return
    }

    const payload: Partial<Employee> = {
      RefUserDesignation: formData.RefUserRefUserDesignation,
      RefUserFName: formData.RefUserFName,
      RefUserLName: formData.RefUserLName,
      doorNumber: formData.doorNumber,
      streetName: formData.streetName,
      state: formData.state,
      username: formData.username,
      email: formData.email,
      mobile: formData.mobile,
      refUserStatus: formData.selectedStatus?.RefUserStatus || 'Inactive', // keep string value
      roleTypeId: formData.refRTId,
      branchId: formData.RefUserBranchId
    }
    try {
      setIsSubmitting(true)
      let result
      if (selectedEmployees) {
        // Update employee by passing ID and payload
        result = await updateEmployee(selectedEmployees.RefUserId, payload)
      } else {
        // Create new employee
        result = await createEmployee(payload)
      }

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
      <div className="flex gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="RefUserFName"
              value={formData.RefUserFName}
              className="w-full"
              onChange={(e) => handleInputChange('RefUserFName', e.target.value)}
            />
            <label htmlFor="RefUserFName">First Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="RefUserLName"
              value={formData.RefUserLName}
              className="w-full"
              onChange={(e) => handleInputChange('RefUserLName', e.target.value)}
            />
            <label htmlFor="RefUserLName">Last Name</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="username"
              value={formData.username}
              className="w-full"
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
            <label htmlFor="username">User Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="RefUserRefUserDesignation"
              keyfilter="pint"
              value={formData.RefUserRefUserDesignation}
              className="w-full"
              onChange={(e) => handleInputChange('RefUserRefUserDesignation', e.target.value)}
            />
            <label htmlFor="RefUserRefUserDesignation"> User RefUserDesignation</label>
          </FloatLabel>
        </div>
      </div>
      <p className="mt-3">Communication Details</p>
      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="email"
              value={formData.email}
              className="w-full"
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="mobile"
              keyfilter="pint"
              value={formData.mobile}
              className="w-full"
              onChange={(e) => handleInputChange('mobile', e.target.value)}
            />
            <label htmlFor="mobile"> Mobile Number</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="doorNumber"
              value={formData.doorNumber}
              className="w-full"
              onChange={(e) => handleInputChange('doorNumber', e.target.value)}
            />
            <label htmlFor="doorNumber">Door Number</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="streetName"
              keyfilter="pint"
              value={formData.streetName}
              className="w-full"
              onChange={(e) => handleInputChange('streetName', e.target.value)}
            />
            <label htmlFor="streetName"> Street Name</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="city"
              value={formData.city}
              className="w-full"
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
            <label htmlFor="city">City</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="state"
              keyfilter="pint"
              value={formData.state}
              className="w-full"
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
            <label htmlFor="state"> state</label>
          </FloatLabel>
        </div>
      </div>

      <p className="mt-3">Configurations</p>
      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="selectedRoleType"
              value={formData.selectedRoleType}
              onChange={(e) => {
                handleInputChange('selectedRoleType', e.value)
                setFormData((prev) => ({
                  ...prev,
                  refRTId: e.value?.refRTId
                }))
              }}
              options={roleTypes}
              optionLabel="refRTName"
              placeholder="Select Role Type"
              className="w-full"
            />
            <label htmlFor="selectedRoleType">Role Type</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="status"
              value={formData.selectedStatus}
              onChange={(e) => handleInputChange('selectedStatus', e.value)}
              options={statusOptions}
              optionLabel="name"
              className="w-full"
            />
            <label htmlFor="status">Status</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="selectedBranch"
              value={formData.selectedBranch}
              onChange={(e) => {
                handleInputChange('selectedBranch', e.value)
                setFormData((prev) => ({
                  ...prev,
                  RefUserBranchId: e.value?.RefUserBranchId
                }))
              }}
              options={branches}
              optionLabel="refBranchName"
              placeholder="Select Branch"
              className="w-full"
            />
            <label htmlFor="selectedBranch">Branch</label>
          </FloatLabel>
        </div>
        <div className="flex-1"></div>
      </div>

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right z-10">
        <Button
          label={selectedEmployees ? 'Update' : 'Save'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}
export default SettingsAddEditEmployees
