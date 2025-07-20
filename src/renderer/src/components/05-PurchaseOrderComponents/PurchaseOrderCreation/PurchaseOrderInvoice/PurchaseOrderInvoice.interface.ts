export interface PartyDetails {
  name: string
  address?: string
  email?: string
  phone?: string
}

export interface InvoiceItem {
  productName: string
  quantity: number
  purchasePrice: number
  discount: number
  total: number
}

export interface InvoiceProps {
  from: PartyDetails
  to: PartyDetails
  items: InvoiceItem[]
}
