import axios from 'axios'
import { PurchaseOrderProduct } from './PurchaseOrderCatalog.interface'
import { baseURL } from '../../../../src/utils/helper'

export const fetchAllPurchaseOrderProducts = async (): Promise<PurchaseOrderProduct[]> => {
  try {
    const response = await axios.get(`${baseURL}/admin/purchaseOrder/list-all-products`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data.data.filter((item: PurchaseOrderProduct) => item.IsReceived === 'true')
  } catch (error) {
    console.error('Error fetching purchase order products:', error)
    throw new Error('Failed to fetch purchase order products')
  }
}

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/admin/settings/categories`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export const fetchSubCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/admin/settings/subcategories`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch subcategories:', error)
    return []
  }
}
