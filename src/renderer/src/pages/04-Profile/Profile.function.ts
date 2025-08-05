import axios from 'axios'
import { baseURL } from '../../utils/helper'
import { Employee } from './Profile.interface'



export const fetchEmployees = async (): Promise<Employee> => {
  const response = await axios.get(`${baseURL}/admin/settings/getEmployees`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  
  console.log('response', response)
  const employeeData = response?.data?.data
  console.log('employeeData', employeeData)

  if (response.data?.status) {
    return employeeData // directly return the single employee object
  } else {
    throw new Error(response.data.message || 'Failed to fetch Employee')
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
    console.log('response.data', response.data)
    return response.data
  } catch (error: any) {
    console.error('Error updating employee profile:', error)
    throw error?.response?.data || { status: false, message: 'Update failed' }
  }
}
