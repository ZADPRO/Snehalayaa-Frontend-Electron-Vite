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
  isOnlineORoffline: boolean
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
  isOnlineORoffline: boolean
}

export interface SettingsAddEditBranchProps {
  selectedBranches: Branch | null
  onClose: () => void
  reloadData: () => void
}

export interface FloorForm {
  refFloorName: string
  refFloorOrder: number
  isActive: boolean
  sections: SectionForm[]
}

export interface SectionForm {
  refSectionName: string
  refSectionCode: string
  isActive: boolean
}
