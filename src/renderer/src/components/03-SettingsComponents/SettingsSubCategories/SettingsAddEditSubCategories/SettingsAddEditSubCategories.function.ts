import axios from 'axios'
import { baseURL } from '../../../../utils/helper'
import { SubCategory } from '../SettingsSubCategories.interface'

export const createSubCategory = async (payload: Partial<SubCategory>) => {
  const response = await axios.post(`${baseURL}/admin/settings/subcategories`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  console.log('response.data', response.data)
  return response.data
}

export const updateSubCategory  = async (payload: Partial<SubCategory>) => {
  const response = await axios.put(`${baseURL}/admin/settings/subcategories`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  console.log('response.data', response.data)
  return response.data
}

