export interface Product {
  id: number
  productName: string
  Price: number
  quantity: number
  Discount: number
  DiscountPrice: number 
  totalPrice: number
  assignedEmployees?: AssignedEmployee[]; // ✅ update this!

}

export interface AssignedEmployee {
  RefUserId: string
  RefUserFName: string
  RefUserCustId: string
}
export interface Employee {
  CreatedAt: string
  CreatedBy: string
  roleTypeId: number
  branchId: number
  RefUserCustId: string
  RefUserDesignation: string
  RefUserFName: string
  RefUserId: number
  RefUserLName: string
  refUserStatus: string
  UpdatedAt: string
  UpdatedBy: string
  city: string
  doorNumber: string
  email: string
  isDelete: boolean
  mobile: string
  state: string
  streetName: string
  username: string
}

