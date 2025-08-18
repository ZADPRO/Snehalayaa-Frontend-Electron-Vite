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
  isOnline: boolean
  isOffline: boolean
  floors: Floor[]
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
  isOnline: boolean
  isOffline: boolean
  floors: Floor[]
}

export interface Section {
  sectionName: string
  sectionCode: string
  categoryId: any
  refSubCategoryId: any
}


export interface Floor {
  floorName: string
  floorCode: string
  sections: Section[]
}
export interface Category {
  refCategoryId: number
  categoryName: string
}

export interface SubCategory {
  refSubCategoryId: number
  subCategoryName: string
  refCategoryId: number
  isDelete: boolean
}

export interface SettingsAddEditBranchProps {
  selectedBranches: Branch | null
  onClose: () => void
  reloadData: () => void
  categories: Category[]
  subCategories: SubCategory[]
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
