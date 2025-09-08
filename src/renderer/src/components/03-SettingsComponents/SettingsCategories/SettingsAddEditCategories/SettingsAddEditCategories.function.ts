// src/pages/Admin/Settings/Categories/services/categoryApi.ts
import api from '../../../../utils/api'
import { Category } from '../SettingsCategories.interface'

export const createCategory = async (payload: Partial<Category>) => {
  const response = await api.post('/admin/settings/categories', payload)
  return response.data
}

export const updateCategory = async (payload: Partial<Category>) => {
  const response = await api.put('/admin/settings/categories', payload)
  return response.data
}
