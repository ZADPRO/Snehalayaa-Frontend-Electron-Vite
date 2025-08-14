import axios from 'axios'
import { baseURL } from '../../../utils/helper'
import { SettingsOverview } from './SettingsOverview.interface'

export const fetchDashboardData = async (): Promise<SettingsOverview> => {
  const response = await axios.get(`${baseURL}/admin/settings/getEmployees`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  const employeeData = response?.data?.data
console.log('SettingsOverview.function.ts / employeeData / 13 -------------------  ', employeeData);

console.log('SettingsOverview.function.ts / 15 -------------------  ');
  console.log('employeeData', employeeData)

  return {
    totalOrders: 124,
    totalIncome: 527340,
    notifications: 12,
    paymentSuccessRate: 93,
    sales: 4200,
    views: 15800,
    activeUsers: 823,
    ongoingProjects: 6,
    campaignStats: [
      { name: 'Summer Sale', value: 430 },
      { name: 'Referral Program', value: 210 },
      { name: 'Email Campaign', value: 140 }
    ],
    transactions: [
      { id: 'TXN001', date: '2025-08-01', amount: 1500, status: 'Success' },
      { id: 'TXN002', date: '2025-08-02', amount: 800, status: 'Pending' },
      { id: 'TXN003', date: '2025-08-03', amount: 3200, status: 'Success' },
      { id: 'TXN004', date: '2025-08-04', amount: 420, status: 'Failed' },
      { id: 'TXN005', date: '2025-08-05', amount: 1100, status: 'Success' }
    ]
  }
}
