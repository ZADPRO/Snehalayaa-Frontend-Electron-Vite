import axios from 'axios'
import { Category } from './SettingsCategories.interface'
import { baseURL } from '../../../utils/helper'

console.log('baseURL', baseURL)

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/categories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch categories')
  }
}
