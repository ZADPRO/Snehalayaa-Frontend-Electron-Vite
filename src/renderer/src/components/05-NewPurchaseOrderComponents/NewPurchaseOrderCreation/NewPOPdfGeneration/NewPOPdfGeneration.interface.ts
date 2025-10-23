export interface BranchDetails {
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

export interface PartyDetails {
  createdAt: string
  createdBy: string
  creditedDays: number
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
}

export interface PurchaseOrderItem {}

export interface PurchaseOrderProps {
  from: PartyDetails
  to: BranchDetails
  items: PurchaseOrderItem[]
}
