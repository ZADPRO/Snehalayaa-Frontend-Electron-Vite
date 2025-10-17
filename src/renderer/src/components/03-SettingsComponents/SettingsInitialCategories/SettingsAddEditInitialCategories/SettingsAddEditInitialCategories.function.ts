import api from '../../../../utils/api'
import { InitialCategory } from './SettingsAddEditInitialCategories.interface'

export const createInitialCategory = async (payload: Partial<InitialCategory>) => {
  const response = await api.post('/admin/settings/initialCategories', payload)
  console.log('\n\nCreate initial Category Response', response)
  return response.data
}

export const updateInitialCategory = async (payload: Partial<InitialCategory>) => {
  const response = await api.put('/admin/settings/initialCategories', payload)
  console.log('\n\n\nUpdate Initial Category Response', response)
  return response.data
}
