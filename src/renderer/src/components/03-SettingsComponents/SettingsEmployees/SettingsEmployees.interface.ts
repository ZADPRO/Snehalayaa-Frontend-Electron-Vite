export interface Employee {
  CreatedAt: string
  CreatedBy: string
  roleTypeId: number
  branchId: number
  RefUserCustId: string
  RefUserDesignation: string
  RefUserFName: string
  RefUserId: number
  RefUserLName: string
  refUserStatus: string
  UpdatedAt: string
  UpdatedBy: string
  city: string
  doorNumber: string
  email: string
  isDelete: boolean
  mobile: string
  state: string
  streetName: string
  username: string
   designation: string
  firstName: string
  lastName: string
}

export interface SettingsAddEditEmployeeProps {
  selectedEmployees: Employee | null
  onClose: () => void
  reloadData: () => void
}
