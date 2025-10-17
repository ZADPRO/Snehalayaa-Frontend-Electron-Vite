import api from '../../../../utils/api'
import { POProductPayload } from './NewPOGRNSidebar.interface'

export const createPOProducts = async (payload: POProductPayload) => {
  try {
    const response = await api.post('/admin/poProductsUpdate', payload)
    console.log('PO Products Response:', response)
    return response.data
  } catch (err) {
    console.error('❌ Error creating PO Products:', err)
    throw err
  }
}
