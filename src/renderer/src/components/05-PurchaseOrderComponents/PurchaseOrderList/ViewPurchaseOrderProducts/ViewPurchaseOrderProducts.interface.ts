// ViewPurchaseOrderProducts.interface.ts

export interface Product {
  productName: string
  refCategoryid: number
  refSubCategoryId: number
  HSNCode: string
  purchaseQuantity: string
  purchasePrice: string
  discountAmount: string
  totalAmount: string
  isReceived: boolean
  acceptanceStatus: string
}

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

export interface TableRow extends Product {
  id: number
  status: 'Pending' | 'Accepted' | 'Rejected - Mismatch' | 'Rejected - Missing'
  categoryName: string
  subCategoryName: string
}

export interface ViewPurchaseOrderProductsProps {
  rowData: PurchaseOrder
}
