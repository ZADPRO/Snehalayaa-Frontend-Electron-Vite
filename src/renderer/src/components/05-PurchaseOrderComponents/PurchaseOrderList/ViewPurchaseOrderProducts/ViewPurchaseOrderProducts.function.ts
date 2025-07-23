import axios from 'axios'
import { baseURL } from '../../../../utils/helper'

export const fetchDummyProductsByPOId = async (purchaseOrderId: number) => {
  console.log('purchaseOrderId', purchaseOrderId)
  const token = localStorage.getItem('token') || ''

  try {
    const response = await axios.get(
      `${baseURL}/admin/purchaseOrder/dummy-products/${purchaseOrderId}`,
      {
        headers: {
          Authorization: token
        }
      }
    )
    console.log('response', response)
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch dummy products:', error)
    return []
  }
}
