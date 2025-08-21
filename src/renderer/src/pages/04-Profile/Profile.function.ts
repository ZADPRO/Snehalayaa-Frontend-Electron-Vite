import axios from 'axios'
import { baseURL } from '../../utils/helper'
import { Employee } from './Profile.interface'

function redirectToLogin(): void {
  window.location.href = '/login'
}

export const fetchEmployees = async (): Promise<Employee> => {
  try {
    const response = await axios.get(`${baseURL}/admin/settings/getEmployees`, {
      headers: {
        Authorization: localStorage.getItem('token') || ''
      }
    })
    console.log('response', response)
    const employeeData = response?.data?.data
    console.log('employeeData', employeeData)

    if (response.data?.error === 'Invalid token') {
      redirectToLogin()
      throw new Error('Invalid token')
    }

    if (response.data?.status) {
      return employeeData
    } else {
      throw new Error(response.data.message || 'Failed to fetch Employee')
    }
  } catch (error: any) {
    if (error?.response?.data?.error === 'Invalid token') {
      redirectToLogin()
      throw new Error('Invalid token')
    }
    throw error
  }
}

export const updateEmployeeProfile = async (updatedData: any) => {
  try {
    const response = await axios.put(
      `${baseURL}/admin/settings/updateEmployeeProfile`,
      updatedData,
      {
        headers: {
          Authorization: localStorage.getItem('token') || ''
        }
      }
    )
    if (response.data?.error === 'Invalid token') {
      redirectToLogin()
      throw new Error('Invalid token')
    }
    console.log('response.data', response.data)
    return response.data
  } catch (error: any) {
    if (error?.response?.data?.error === 'Invalid token') {
      redirectToLogin()
      throw new Error('Invalid token')
    }
    console.error('Error updating employee profile:', error)
    throw error?.response?.data || { status: false, message: 'Update failed' }
  }
}
