
export interface Category {
  refCategoryId: number
  categoryName: string
}

export interface SubCategory {
  refSubCategoryId: number
  subCategoryName: string
  refCategoryId: number
  isDelete: boolean
}

export interface Products {
  refPtId: number
  refCategoryId:number
  refSubCategoryId:number
  poDescription: string
  poDisc: string
  poDiscPercent: string
  poHSN: string
  poId: number
  poPrice: string
  poQuantity: string
  poSKU: string
  poTotalPrice: string
  poName: string
  updatedAt: string
  updatedBy: string
  createdAt: string
  createdBy: string
  isDelete: boolean
}

