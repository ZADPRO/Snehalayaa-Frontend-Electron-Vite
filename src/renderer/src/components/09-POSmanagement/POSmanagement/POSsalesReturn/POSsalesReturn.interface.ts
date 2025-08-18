export interface Product {
  productId: number
  productName: string
  Price: number
  quantity: number
  customerName: string
  customerPhoneNumber: string
  assignedEmployees?: AssignedEmployee[] // ✅ update this!
  isDiscountApplied: boolean
SoldEmployee?: { RefUserId: number; RefUserFName: string; RefUserCustId: string }[]
}

export interface ProductDetail {
  refProductId: number
  refProductQty: number
  refProductPrice: number
  refDiscount: number
  refTotalPrice: number
}

export interface SaveSalePayload {
  refSaleCode: string
  refProductDetails: ProductDetail[]
  amountGiven?: number
  changeReturned?: number
  refEmployeeId: string[]
  refCustomerId?: string
  refSaleDate: string
  refPaymentMode: string[]
  refInvoiceNumber: string
}
export interface AssignedEmployee {
  RefUserId: string
  RefUserFName: string
  RefUserCustId: string
}
export interface Employee {
  CreatedAt: string
  CreatedBy: string
  roleTypeId: number
  branchId: number
  RefUserCustId: string
  RefUserDesignation: string
  RefUserFName: string
  RefUserId: number
  RefUserLName: string
  refUserStatus: string
  UpdatedAt: string
  UpdatedBy: string
  city: string
  doorNumber: string
  email: string
  isDelete: boolean
  mobile: string
  state: string
  streetName: string
  username: string
}
