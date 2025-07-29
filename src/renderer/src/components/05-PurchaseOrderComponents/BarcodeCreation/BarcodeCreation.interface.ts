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

export interface SimplifiedPurchaseOrderProduct {
  name: string
  hsnCode: string
  sku: string
  price: string
  status: string
}
