import axios from 'axios'
import { baseURL } from '../../../../src/utils/helper'
import { PurchaseOrder } from './PurchaseOrderList.interface'

export const fetchCategories = async (): Promise<PurchaseOrder[]> => {
  const response = await axios.get(`${baseURL}/admin/purchaseOrder/read`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch purchase orders')
  }
}
