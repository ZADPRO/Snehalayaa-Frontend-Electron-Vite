export interface Products {
  imageUrl: string
  productInstanceId: number
  poProductId: number
  lineNumber: string
  referenceNumber: string
  productDescription: string
  discount: string
  unitPrice: string
  discountPrice: string
  margin: string
  totalAmount: string
  categoryId: number
  subCategoryId: number
  status: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
  productName: string
  purchaseOrderId: number
  sku: string
  productBranchId: number
  quantity: string
  invoiceFinalNumber: string
  categoryName: string
  subCategoryName: string
  branchName: string
}

export interface ProductFormData {
  productId: number[]
  selectedFloor?: Floor | null
  selectedSection?: Section | null
}
export interface Floor {
  floorId: number
  floorName: string
}
export interface Section {
  floorId: number
  sectionId: number
  sectionName: string
}
