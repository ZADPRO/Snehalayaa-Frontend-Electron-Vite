import api from '../../../../utils/api'

export const createPOProducts = async (payload: any) => {
  try {
    const response = await api.post('/admin/poProductsUpdate', payload)
    console.log('PO Products Response:', response)
    return response.data
  } catch (err) {
    console.error('❌ Error creating PO Products:', err)
    throw err
  }
}
