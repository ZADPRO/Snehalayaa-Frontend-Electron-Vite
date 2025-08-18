export interface SettingsOverview {
  totalOrders: number
  totalIncome: number
  notifications: number
  paymentSuccessRate: number
  sales: number
  views: number
  activeUsers: number
  ongoingProjects: number
  campaignStats: {
    name: string
    value: number
  }[]
  transactions: {
    id: string
    date: string
    amount: number
    status: 'Success' | 'Pending' | 'Failed'
  }[]
}


interface CardMetrics {
  Attributes: number
  Branches: number
  Categories: number
  Supplier: number
}

interface LatestCategory {
  refCategoryId: number
  refCategoryName: string
  createdAt: string
}

interface LatestSupplier {
  refSupplierId: number
  refSupplierName: string
  createdAt: string
}

interface MonthlyCount {
  month: string
  Categories: number
  SubCategories: number
}

export interface DashboardData {
  cards: CardMetrics
  latestCategories: LatestCategory[]
  latestSuppliers: LatestSupplier[]
  monthlyCounts: MonthlyCount[]
}
