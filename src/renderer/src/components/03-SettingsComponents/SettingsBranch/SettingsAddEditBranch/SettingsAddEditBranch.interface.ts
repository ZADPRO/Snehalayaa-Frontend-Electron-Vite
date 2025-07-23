export interface Branch {
  refBranchName: string
  refBranchCode: string
  refLocation: string
  refMobile: string
  refEmail: string
  isMainBranch: boolean
  isActive: boolean
  refBTId: number
  refBranchId?: number
}

export interface BranchStatusOptions {
  name: string
  isActive: boolean
}

export interface BranchFormData {
  // refBranchId: number
  refBranchName: string
  refBranchCode: string
  refLocation: string
  refMobile: string
  refEmail: string
  isMainBranch: boolean
//   refBTId: number
  selectedStatus: BranchStatusOptions | null
}

export interface SettingsAddEditBranchProps {
  selectedBranches: Branch | null
  onClose: () => void
  reloadData: () => void
}
