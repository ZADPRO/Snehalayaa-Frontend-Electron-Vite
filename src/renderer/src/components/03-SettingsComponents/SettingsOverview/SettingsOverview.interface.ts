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