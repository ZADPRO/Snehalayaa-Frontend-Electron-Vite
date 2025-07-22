export interface PartyDetails {
  name: string
  address?: string
  email?: string
  phone?: string
  taxNo?: string
}

export interface InvoiceItem {
  category: string
  subCategory: string
  productName: string
  hsnCode?: string
  quantity: number
  purchasePrice: number
  discount: number
}

export interface InvoiceProps {
  from: PartyDetails
  to: PartyDetails
  items: InvoiceItem[]
}
