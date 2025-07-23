import axios from 'axios'
import { Option, CatalogFormData } from './CatalogAddEditForm.interface'
import { baseURL } from '../../../../utils/helper'

export const fetchCategories = async (): Promise<Option[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/categories`, {
    headers: { Authorization: localStorage.getItem('token') || '' }
  })

  if (response.data?.status) {
    return response.data.data.map((cat: any) => ({
      label: cat.categoryName,
      value: cat.refCategoryId
    }))
  }

  throw new Error(response.data.message || 'Failed to fetch categories')
}

export const fetchSubcategories = async (refCategoryId: number): Promise<Option[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/subcategories`, {
    headers: { Authorization: localStorage.getItem('token') || '' }
  })

  if (response.data?.status) {
    return response.data.data
      .filter((sub: any) => sub.refCategoryId === refCategoryId)
      .map((sub: any) => ({
        label: sub.subCategoryName,
        value: sub.refSubCategoryId
      }))
  }

  throw new Error(response.data.message || 'Failed to fetch subcategories')
}

export const saveProduct = async (productData: CatalogFormData) => {
  const response = await axios.post(`${baseURL}/admin/purchaseOrder/products`, productData, {
    headers: {
      Authorization: localStorage.getItem('token') || '',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}
