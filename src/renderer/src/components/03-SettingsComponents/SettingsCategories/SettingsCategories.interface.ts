export interface Category {
  refCategoryId: number
  categoryName: string
  categoryCode: string
  isActive: boolean
  isDelete: boolean
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}
