export interface MappedStockTransfer {
  stockTransferId: number
  totalSummary: {
    poNumber: string
    status: number
    createdBy: string
    createdAt: string
  }
  supplierDetails: {
    supplierName: string
  }
  branchDetails: {
    branchName: string
  }
  items: StockTransferItem[]
}

export interface StockTransferItem {
  stockTransferItemId: number
  stockTransferId: number
  productInstanceId: number
  productName: string
  sku: string
  isReceived: boolean
  acceptanceStatus: string
}

export interface StockTransfer {
  stockTransferId: number
  fromBranchId: number
  fromBranchName: string
  fromBranchEmail: string
  fromBranchAddress: string
  toBranchId: number
  toBranchName: string
  toBranchEmail: string
  toBranchAddress: string
  modeOfTransport: string
  subTotal: string
  discountOverall: string
  totalAmount: string
  paymentPending: string
  poNumber: string
  status: number
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
  items: StockTransferItem[]
}

export interface MappedStockTransfer {
  stockTransferId: number

  totalSummary: {
    poNumber: string
    status: number
    createdBy: string
    createdAt: string
  }

  supplierDetails: {
    supplierName: string
  }

  branchDetails: {
    branchName: string
  }

  items: StockTransferItem[]
}

export interface StockTransferResponse {
  data: StockTransfer[]
  status: boolean
}
