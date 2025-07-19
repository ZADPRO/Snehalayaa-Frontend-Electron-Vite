import axios from 'axios'
import { baseURL } from '../../../../utils/helper'
import { Category } from '../SettingsCategories.interface'

export const createCategory = async (payload: Partial<Category>) => {
  const response = await axios.post(`${baseURL}/admin/settings/categories`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return response.data
}

export const updateCategory = async (payload: Partial<Category>) => {
  const response = await axios.put(`${baseURL}/admin/settings/categories`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return response.data
}
