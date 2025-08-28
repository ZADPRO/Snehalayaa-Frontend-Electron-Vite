export interface Products {
  refPtId: number
  refCategoryId: number
  refSubCategoryId: number
  poDescription: string
  poDisc: string
  poDiscPercent: string
  poHSN: string
  poId: number
  poPrice: string
  poQuantity: string
  poSKU: string
  poTotalPrice: string
  poName: string
  updatedAt: string
  updatedBy: string
  createdAt: string
  createdBy: string
  isDelete: boolean
}

export interface Supplier {
  supplierId: number
  supplierName: string
  supplierCompanyName: string
  supplierCode: string
  supplierEmail: string
  supplierGSTNumber: string
  supplierPaymentTerms: string
  supplierBankACNumber: string
  supplierIFSC: string
  supplierBankName: string
  supplierUPI: string
  supplierIsActive: boolean
  supplierContactNumber: string
  emergencyContactName: string
  emergencyContactNumber: string
  supplierDoorNumber: string
  supplierStreet: string
  supplierCity: string
  supplierState: string
  supplierCountry: string
}

export interface FilterOptions {
  fromDate: string
  toDate: string
  searchField: string
  purchaseOrderId: number
  supplierId: number
  paginationOffset: string
  paginationLimit: string
}

export interface TotalSummary {
  poNumber: string
  supplierId: number
  branchId: number
  status: number
  expectedDate: string
  modeOfTransport: string
  subTotal: string
  discountOverall: string
  payAmount: string
  isTaxApplied: boolean
  taxPercentage: string
  taxedAmount: string
  totalAmount: string
  totalPaid: string
  paymentPending: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
}

export interface PurchaseOrder {
  totalSummary: TotalSummary
  purchaseOrderId: number
}
