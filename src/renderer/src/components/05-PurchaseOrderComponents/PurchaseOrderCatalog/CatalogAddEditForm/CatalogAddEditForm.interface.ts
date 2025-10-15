export interface CatalogFormData {
  name: string
  sku: string
  gtin: string
  brand: string
  category: number // changed from string
  subcategory: number
  description: string
  detailedDescription: string
  price: string
  mrp: string
  cost: string
  splPrice: string
  startDate: Date | null
  endDate: Date | null
  taxClass: string
  productImage?: File | null
  featured: boolean
}

export interface CatalogAddEditFormProps {
  selectedProduct?: any
  onSuccess?: () => void
}

export interface Option {
  label: string
  value: string | number
}

export interface Attribute {
  column_label: string
  column_name: string
  createdAt: string
  createdBy: string
  data_type: string
  id: number
  isDelete: boolean
  is_required: boolean
  type: string
  updatedAt: string
  updatedBy: string
}
