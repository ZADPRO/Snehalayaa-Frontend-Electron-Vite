import api from '../../../utils/api'

export const getAllPurchaseOrders = async () => {
  try {
    const response = await api.get('/admin/purchaseOrder')
    console.log('All POs:', response)
    return response.data
  } catch (err) {
    console.error('Error fetching POs:', err)
    throw err
  }
}
