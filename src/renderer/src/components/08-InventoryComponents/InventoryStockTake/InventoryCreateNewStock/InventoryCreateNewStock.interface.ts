export interface Branch {
  createdAt: string
  createdBy: string
  isActive: boolean
  isDelete: boolean
  isMainBranch: boolean
  refBTId: number
  refBranchCode: string
  refBranchId: number
  refBranchName: string
  refEmail: string
  refLocation: string
  refMobile: string
  updatedAt: string
  updatedBy: string
}

// export interface Supplier {
// createdAt: string
//   createdBy: string
//   isActive: boolean
//   isDelete: boolean
//   isMainBranch: boolean
//   refBTId: number
//   refBranchCode: string
//   refBranchId: number
//   refBranchName: string
//   refEmail: string
//   refLocation: string
//   refMobile: string
//   updatedAt: string
//   updatedBy: string

// }

export interface Category {
  refCategoryId: number
  categoryName: string
}

export interface SubCategory {
  refSubCategoryId: number
  subCategoryName: string
  refCategoryId: number
  isDelete: boolean
  categoryName: string; // ← Add this
}

export interface ProductRow {
  id: number
  poName: string
  poSKU: string
  poHSN: string
  purchasePrice: string
  quantity: number
}