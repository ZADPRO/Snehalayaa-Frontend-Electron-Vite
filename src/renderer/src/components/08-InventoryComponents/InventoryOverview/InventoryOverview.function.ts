import { baseURL } from '../../../utils/helper'
import { Category } from "./InventoryOverview.interface"
import axios from "axios"

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/categories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch categories')
  }
}