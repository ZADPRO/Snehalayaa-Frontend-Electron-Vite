import axios from 'axios'
import { SimplifiedPurchaseOrderProduct } from './BarcodeCreation.interface'
import { baseURL } from '../../../../src/utils/helper'

export const fetchAllPurchaseOrderProducts = async (): Promise<
  SimplifiedPurchaseOrderProduct[]
> => {
  try {
    const response = await axios.get(`${baseURL}/admin/purchaseOrder/list-all-products-barcode`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data.data.filter(
      (item: SimplifiedPurchaseOrderProduct) => item.status === 'Created'
    )
  } catch (error) {
    console.error('Error fetching purchase order products:', error)
    throw new Error('Failed to fetch purchase order products')
  }
}
