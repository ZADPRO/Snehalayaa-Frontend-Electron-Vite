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
          { type: 'PO Taken', count: 5, date: '2025-07-01' },
          { type: 'PO Returned', count: 1, date: '2025-07-01' },
          { type: 'PO Taken', count: 7, date: '2025-07-03' },
          { type: 'PO Returned', count: 2, date: '2025-07-03' },
          { type: 'PO Taken', count: 6, date: '2025-07-05' },
          { type: 'PO Returned', count: 3, date: '2025-07-05' },
          { type: 'PO Taken', count: 10, date: '2025-07-07' },
          { type: 'PO Returned', count: 4, date: '2025-07-07' },
          { type: 'PO Taken', count: 8, date: '2025-07-10' },
          { type: 'PO Returned', count: 2, date: '2025-07-10' },
          { type: 'PO Taken', count: 11, date: '2025-07-12' },
          { type: 'PO Returned', count: 1, date: '2025-07-12' },
          { type: 'PO Taken', count: 9, date: '2025-07-15' },
          { type: 'PO Returned', count: 3, date: '2025-07-15' },
          { type: 'PO Taken', count: 6, date: '2025-07-18' },
          { type: 'PO Returned', count: 2, date: '2025-07-18' },
          { type: 'PO Taken', count: 13, date: '2025-07-20' },
          { type: 'PO Returned', count: 5, date: '2025-07-20' },
          { type: 'PO Taken', count: 7, date: '2025-07-22' },
          { type: 'PO Returned', count: 1, date: '2025-07-22' },
          { type: 'PO Taken', count: 12, date: '2025-07-25' },
          { type: 'PO Returned', count: 4, date: '2025-07-25' },
          { type: 'PO Taken', count: 8, date: '2025-07-28' },
          { type: 'PO Returned', count: 3, date: '2025-07-28' },
          { type: 'PO Taken', count: 10, date: '2025-07-30' },
          { type: 'PO Returned', count: 2, date: '2025-07-30' }
        ],
        summary: {
          suppliers: 9,
          invoices: 22
        }
      })
    }, 800)
  })
}
