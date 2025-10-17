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

export interface AcceptedProduct {
  po_product_id: number
  category_id: number
  product_description: string
  unit_price: string
  accepted_quantity: string
  accepted_total: string
  status: string
  updated_at: string
  updated_by: string
}

export interface PurchaseOrder {
  purchase_order_id: number
  invoice_number: string
  branch_id: number
  supplier_id: number
  total_amount: string
  created_at: string
  accepted_products: AcceptedProduct[]
}

export interface Props {
  purchaseOrder: PurchaseOrder
}

export interface DialogRow {
  id: number
  sNo: number
  referenceNumber: string
  productDescription: string
  price: number
  margin: number
  totalAmount: any
}
