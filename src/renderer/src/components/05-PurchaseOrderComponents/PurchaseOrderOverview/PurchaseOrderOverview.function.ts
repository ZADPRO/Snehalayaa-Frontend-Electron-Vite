export type PurchaseOverviewItem = {
  type: 'PO Taken' | 'PO Returned'
  count: number
  date: string
  percent?: number // optional property
}

export type PurchaseOverviewSummary = {
  suppliers: number
  invoices: number
}

export type PurchaseOverviewResponse = {
  data: PurchaseOverviewItem[]
  summary: PurchaseOverviewSummary
}

export const fetchPurchaseOverview = async (): Promise<PurchaseOverviewResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { type: 'PO Taken', count: 2, date: '2025-07-01' },
          { type: 'PO Returned', count: 0, date: '2025-07-01' },
          { type: 'PO Taken', count: 0, date: '2025-07-03' },
          { type: 'PO Returned', count: 0, date: '2025-07-03' },
          { type: 'PO Taken', count: 0, date: '2025-07-05' }
        ],
        summary: {
          suppliers: 3,
          invoices: 2
        }
      })
    }, 800)
  })
}
