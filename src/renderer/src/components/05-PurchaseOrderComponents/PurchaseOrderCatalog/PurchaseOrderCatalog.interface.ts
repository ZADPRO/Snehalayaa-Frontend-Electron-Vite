export interface PurchaseOrderProduct {
  DummyProductsID: number
  PurchaseOrderID: number
  ProductName: string
  RefCategoryID: number
  RefSubCategoryID: number
  HSNCode: string
  DummySKU: string
  Price: string
  DiscountPercent: string
  DiscountAmount: string
  IsReceived: string
  AcceptanceStatus: string
  CreatedAt: string
  CreatedBy: string
  UpdatedAt: string
  UpdatedBy: string
  IsDelete: string
}

export interface Category {
  refCategoryId: number
  categoryName: string
}

export interface SubCategory {
  refSubCategoryId: number
  subCategoryName: string
  refCategoryId: number
}
