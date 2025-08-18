import { saveAs } from 'file-saver'

import * as XLSX from 'xlsx'
import {  UserRoles, UserRoleTypes } from './SettingsUserRoles.interface'

export const exportExcel = (userRoles: UserRoles[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    userRoles.map((item) => ({
      userName: item.userName,
      email: item.email,
      role: item.role
    }))
  )
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  })
  saveAs(blob, `categories_export_${new Date().getTime()}.xlsx`)
}

// export const fetchRoleType = async (): Promise<UserRoles[]> => {
//   const token = localStorage.getItem('token') || ''
//   const response = await axios.get(`${baseURL}/admin/settings/roleTypes`, {
//     headers: {
//       Authorization: token
//     }
//   })

//   if (response.data?.status) {
//     return response.data.data
//   } else {
//     throw new Error(response.data.message || 'Failed to fetch roleTypes')
//   }
// }

export const fetchRoleType = async (): Promise<UserRoleTypes[]> => {
  // Dummy role type data
  return [
    { id: 1, rolename: 'Super Admin' },
    { id: 2, rolename: 'Admin' },
    { id: 3, rolename: 'Accounts Manager' },
    { id: 4, rolename: 'Store Manager' },
    { id: 5, rolename: 'Purchase Manager' },
    { id: 6, rolename: 'Billing Executive' },
    { id: 7, rolename: 'Sales Executive' },
    { id: 8, rolename: 'SEO' },
    { id: 9, rolename: 'Customer Support' },
    { id: 10, rolename: 'Supplier' },
    { id: 11, rolename: 'Customer' }
  ]
}

export const fetchUserRole = async (): Promise<UserRoles[]> => {
  // Dummy role type data
  return [
    {
      userId: 1,
      userName: 'raj',
      email: 'raj@gmail.com',
      role: 'Super Admin',
      createdAt: '2025-07-08 14:42:02',
      createdBy: 'Admin'
    },
    {
      userId: 2,
      userName: 'raj',
      email: 'raj@gmail.com',
      role: 'Admin',
      createdAt: '2025-07-08 14:42:43',
      createdBy: 'Admin'
    },
    {
      userId: 3,
      userName: 'raj',
      email: 'raj@gmail.com',
      role: 'Accounts Manager',
      createdAt: '2025-07-10 13:04:47',
      createdBy: 'Admin'
    },
    {
      userId: 4,
      userName: 'raj',
      email: 'raj@gmail.com',
      role: 'Store Manager',
      createdAt: '2025-07-10 13:14:29',
      createdBy: 'Admin'
    },
    {
      userId: 5,
      userName: 'raj',
      email: 'raj@gmail.com',
      role: 'Purchase Manager',
      createdAt: '2025-07-10 13:15:42',
      createdBy: 'Admin'
    }
  ]
}

