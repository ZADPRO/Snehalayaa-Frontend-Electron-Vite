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
  ordered_quantity: string
  ordered_total: string
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
  purchaseOrder: any
}

export interface DialogRow {
  id: number
  sNo: number
  lineNumber: any
  referenceNumber: string
  productDescription: string
  price: number
  discount: any
  discountPrice: any
  margin: number
  totalAmount: any
}

export interface TableRow {
  id: number
  sNo: number
  category: Category | null
  subCategory: SubCategory | null
  lineNumber: number
  quantity: number
  productName: string
  brand: string
  taxClass: string
  price: number
  mrp: number
  cost: number
  profitMargin: number
  sellingPrice: number
  dialogRows: DialogRow[]
}
