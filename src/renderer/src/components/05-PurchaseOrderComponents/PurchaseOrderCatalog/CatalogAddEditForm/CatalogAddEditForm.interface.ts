export interface CatalogFormData {
  name: string
  sku: string
  gtin: string
  brand: string
  category: string
  subcategory: string
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
