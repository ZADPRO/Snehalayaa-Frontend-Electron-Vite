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

export interface Supplier {
  createdAt: string
  createdBy: string
  emergencyContactName: string
  emergencyContactNumber: string
  isDelete: boolean
  supplierBankACNumber: string
  supplierBankName: string
  supplierCity: string
  supplierCode: string
  supplierCompanyName: string
  supplierContactNumber: string
  supplierCountry: string
  supplierDoorNumber: string
  supplierEmail: string
  supplierGSTNumber: string
  supplierIFSC: string
  supplierId: number
  supplierIsActive: string
  supplierName: string
  supplierPaymentTerms: string
  supplierState: string
  supplierStreet: string
  supplierUPI: string
  updatedAt: string
  updatedBy: string
  creditedDays: number
}

export interface Category {
  refCategoryId: number
  categoryName: string
  categoryCode: string
  profitMargin: any
  isActive: boolean
  isDelete: boolean
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

export interface SubCategory {
  createdAt: string
  createdBy: string
  isActive: boolean
  isDelete: boolean
  refCategoryId: any
  refSubCategoryId: number
  subCategoryCode: string
  subCategoryName: string
  updatedAt: string
  updatedBy: string
}
