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
  refBranchDoorNo?: string
  refBranchStreet?: string
  refBranchCity?: string
  refBranchState?: string
  refBranchPincode?: string
}

export interface InitialCategory {
  initialCategoryId: number
  initialCategoryName: string
  initialCategoryCode: string
  isDelete: boolean
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

export interface Branch {
  refBranchId: number
  branchName: string
}

export interface Supplier {
  supplierId: number
  supplierName: string
}

export interface InitialCategory {
  refCategoryId: number
  initialCategoryName: string
}

export interface PurchaseOrderProduct {
  categoryId: number
  description: string
  unitPrice: string // text in DB
  discount: string // text in DB
  quantity: string // text in DB
  total: string // text in DB
}

export interface PurchaseOrderSummary {
  subTotal: string
  taxEnabled: boolean
  taxPercentage: string
  taxAmount: string
  totalAmount: string
}

export interface PurchaseOrderPayload {
  purchaseOrderID?: number // optional for create, required for update
  supplier: Supplier
  branch: Branch
  products: PurchaseOrderProduct[]
  summary: PurchaseOrderSummary
  creditedDate: string // text in DB
}

export interface PurchaseOrderListResponse {
  purchaseOrderId: number
  purchaseOrderNumber: string
  status: string
  totalOrderedQuantity: number
  totalAcceptedQuantity: number
  totalRejectedQuantity: number
  totalAmount: string
  createdAt: string
  taxableAmount: string
  supplierId: number
  supplierName: string
  branchId: number
  branchName: string
  products?: PurchaseOrderProduct[]
}
