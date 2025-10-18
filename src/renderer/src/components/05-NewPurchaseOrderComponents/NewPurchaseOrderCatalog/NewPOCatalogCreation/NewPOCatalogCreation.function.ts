import axios from 'axios'
import { Category, SubCategory } from './NewPOCatalogCreation.interface'
import { baseURL } from '../../../../utils/helper'

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`${baseURL}/admin/settings/categories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return res.data.data
}

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  const res = await axios.get(`${baseURL}/admin/settings/subcategories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return res.data.data.filter((sub: SubCategory) => !sub.isDelete)
}
