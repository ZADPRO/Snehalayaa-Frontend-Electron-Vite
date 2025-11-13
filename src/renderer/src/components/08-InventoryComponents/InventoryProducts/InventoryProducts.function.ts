import axios from 'axios'
import { Floor, ProductFormData, Section } from './InventoryProducts.interface'
import { baseURL } from '../../../utils/helper'

export const saveAcceptProducts = async (payload: ProductFormData): Promise<boolean> => {
  const response = await axios.post(`${baseURL}/admin/accept`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || '',
      'Content-Type': 'application/json'
    }
  })

  if (response.data?.status) {
    return true // or you could return response.data if you need more info
  } else {
    throw new Error(response.data?.message || 'Failed to save User Roles')
  }
}

export const fetchFloor = async (): Promise<Floor[]> => {
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
export const fetchSection = async (): Promise<Section[]> => {
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
