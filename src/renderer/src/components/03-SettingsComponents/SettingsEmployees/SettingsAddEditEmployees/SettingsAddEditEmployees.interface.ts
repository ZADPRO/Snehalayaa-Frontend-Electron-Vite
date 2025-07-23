export interface Employee {
    RefUserId:number
  RefUserDesignation: string
  doorNumber: string
  email: string
  RefUserFName: string
  RefUserLName: string
  mobile: string
  refUserStatus: string // e.g., "Active" or "Inactive"
  roleTypeId: number
  state: string
  streetName: string
  username: string
  branchId: number // Include if you're using it in your form or state
  city: string
  RefUserCustId:string
}

export interface EmployeeStatusOptions {
  name: string
  RefUserStatus: string
}

export interface EmployeeFormData {
  RefUserBranchId: number
  refRTId: number

  RefUserCustId: string
  RefUserRefUserDesignation: string
  RefUserFName: string
  //   RefUserId: number
  RefUserLName: string
  selectedStatus: EmployeeStatusOptions | null
  city: string
  doorNumber: string
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
