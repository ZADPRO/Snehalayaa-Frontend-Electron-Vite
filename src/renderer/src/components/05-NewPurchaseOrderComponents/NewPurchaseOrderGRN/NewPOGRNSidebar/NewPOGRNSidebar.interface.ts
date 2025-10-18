export interface POProductPayload {
  poInvoiceNumber: string
  poId: number
  supplierId: number
  supplier?: string
  branchId: number
  totalAmount: string
  totalOrderedQty: number
  totalReceivedQty: number
  products: {
    categoryId: number
    productName: string
    orderedQty: number
    receivedQty: number
    rejectedQty: number
    unitPrice: string
    totalPrice: number
    status: string
  }[]
}
