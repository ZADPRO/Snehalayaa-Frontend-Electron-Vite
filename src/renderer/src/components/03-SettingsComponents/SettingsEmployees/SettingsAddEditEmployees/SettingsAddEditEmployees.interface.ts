export interface Employee {
  RefUserId: number
  designation: string
  doorNumber: string
  email: string
  firstName: string
  lastName: string
  mobile: string
  refUserStatus: any // keep this as string, e.g. "Active" or "Inactive"
  roleTypeId: number
  state: string
  streetName: string
  username: string
  branchId: number
  city: string
  RefUserCustId: string
}

export interface EmployeeStatusOptions {
  name: string
  refUserStatus: string
}

export interface EmployeeFormData {
  branchId: number
  roleTypeId: number
  RefUserCustId: string
  designation: string
  firstName: string
  lastName: string
  selectedStatus: EmployeeStatusOptions | null
  city: string
  doorNumber: string
  refRTId: number
  email: string
  mobile: string
  state: string
  streetName: string
  username: string
  selectedRoleType?: EmployeeRoleType | null
  selectedBranch?: EmployeeBranch | null
}

export interface SettingsAddEditEmployeeProps {
  selectedEmployees: Employee | null
  onClose: () => void
  reloadData: () => void
}

export interface EmployeeRoleType {
  refRTId: number
  refRTName: string
}

export interface EmployeeBranch {
  refBranchId: number
  refBranchName: string
}
