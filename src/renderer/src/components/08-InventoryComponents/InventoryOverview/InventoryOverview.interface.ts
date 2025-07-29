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
  count?: number // optional static count for UI
}
