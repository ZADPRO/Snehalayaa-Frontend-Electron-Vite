export interface Products {
  refPtId: number
  refCategoryId: number
  refSubCategoryId: number
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
  floorId?:number
  sectionId?:number
}


export interface ProductFormData {
  productId: number[]    
selectedFloor?:Floor | null
selectedSection?: Section | null
}
export interface Floor {
floorId:number
floorName:string
}
export interface Section {
  floorId:number
sectionId:number
sectionName:string
}

