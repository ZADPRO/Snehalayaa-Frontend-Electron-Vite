export interface SupplierDetails {
  supplierId: number
  supplierName: string
  supplierCompanyName: string
  supplierGSTNumber: string
  supplierAddress: string
  supplierPaymentTerms: string
  supplierEmail: string
  supplierContactNumber: string
}

export interface BranchDetails {
  branchId: number
  branchName: string
  branchEmail: string
  branchAddress: string
}

export interface ProductDetails {
  productName: string
  refCategoryid: number
  refSubCategoryId: number
  HSNCode: string
  purchaseQuantity: string
  purchasePrice: string
  discountPrice: string
  discountAmount: string
  totalAmount: string
  isReceived: boolean
  acceptanceStatus: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
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
  supplierDetails: SupplierDetails
  branchDetails: BranchDetails
  productDetails: ProductDetails[]
  totalSummary: TotalSummary
  purchaseOrderId: number
}

export interface InvoiceItem {
  category: string
  subCategory: string
  productName: string
  hsnCode?: string
  quantity: number
  purchasePrice: number
  discount: number
}
export interface PartyDetails {
  name: string
  address?: string
  email?: string
  phone?: string
  taxNo?: string
}

export interface InvoiceProps {
  from: PartyDetails
  to: PartyDetails
  items: InvoiceItem[]
}
