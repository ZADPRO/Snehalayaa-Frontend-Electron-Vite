import axios from 'axios'
import { baseURL } from '../../../../utils/helper'
import { Employee } from '../SettingsEmployees.interface'

export const createEmployee = async (payload: Partial<Employee>) => {
  const response = await axios.post(`${baseURL}/admin/settings/employees`, payload, {
      headers: {
          Authorization: localStorage.getItem('token') || ''
        }
    })
    console.log('response', response)
  return response.data
}

export const updateEmployee = async (id: number, payload: Partial<Employee>) => {
    console.log('id', id)
  const response = await axios.put(`${baseURL}/admin/settings/employees/${id}`, payload, {
      headers: {
          Authorization: localStorage.getItem('token') || ''
        }
    })
    console.log('response', response)
  return response.data
}

export const fetchRoleType = async (): Promise<Employee[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/employeeRoleType`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.roles 
  } else {
    throw new Error(response.data.message || 'Failed to fetch Employee')
  }
}
export const fetchBranch = async (): Promise<Employee[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/branches`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch Employee')
  }
}