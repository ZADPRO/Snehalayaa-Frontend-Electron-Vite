import api from '../../../utils/api'

export const getPoProductsAccepted = async () => {
  try {
    const response = await api.get('/admin/acceptedPOs')
    console.log('PO Products Response:', response)
    return response.data
  } catch (err) {
    console.error('❌ Error creating PO Products:', err)
    throw err
  }
}
