import axios from 'axios'
import { baseURL } from '../../../../utils/helper'
import { PurchaseReturnPayload } from './ViewPurchaseOrderProducts.interface'

const token = localStorage.getItem('token') || ''
const headers = {
  Authorization: token,
  'Content-Type': 'application/json'
}

export const fetchDummyProductsByPOId = async (purchaseOrderId: number) => {
  try {
    const response = await axios.get(
      `${baseURL}/admin/purchaseOrder/dummy-products/${purchaseOrderId}`,
      { headers }
    )
    return response.data?.data || []
  } catch (error: any) {
    const message = error?.response?.data?.error || error?.response?.data?.message

    if (message === 'Invalid token') {
      // Redirect to login page
      window.location.href = '/login' // or whatever your login route is
    }

    console.error('Failed to fetch dummy products:', error)
    return []
  }
}

export const updateDummyProductStatus = async (
  dummyProductId: number,
  status: any,
  reason: 'Mismatch' | 'Missing' | null = null
) => {
  try {
    const payload: any = { dummyProductId, status }
    if (!status && reason) payload.reason = reason

    const response = await axios.put(
      `${baseURL}/admin/purchaseOrder/dummy-products/update`,
      payload,
      { headers }
    )
    return response.data
  } catch (error) {
    console.error('Failed to update product status:', error)
    return null
  }
}

export const bulkAcceptDummyProducts = async (dummyProductIds: number[]) => {
  try {
    const response = await axios.put(
      `${baseURL}/admin/purchaseOrder/dummy-products/bulk-accept`,
      { dummyProductIds },
      { headers }
    )
    return response.data
  } catch (error) {
    console.error('Failed to bulk accept products:', error)
    return null
  }
}

export const bulkRejectDummyProducts = async (dummyProductIds: number[], reason: string) => {
  try {
    const response = await axios.put(
      `${baseURL}/admin/purchaseOrder/dummy-products/bulk-reject`,
      { dummyProductIds, reason },
      { headers }
    )
    return response.data
  } catch (error) {
    console.error('Failed to bulk reject products:', error)
    return null
  }
}

export const bulkUndoDummyProducts = async (dummyProductIds: number[]) => {
  try {
    const response = await axios.put(
      `${baseURL}/admin/purchaseOrder/dummy-products/bulk-undo`,
      { dummyProductIds },
      { headers }
    )
    return response.data
  } catch (error) {
    console.error('Failed to bulk undo products:', error)
    return null
  }
}

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/admin/settings/categories`, { headers })
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export const fetchSubCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/admin/settings/subcategories`, { headers })
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch subcategories:', error)
    return []
  }
}

export const createPurchaseReturn = async (payload: PurchaseReturnPayload): Promise<any> => {
  const response = await axios.post(`${baseURL}/admin/purchaseReturn`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to create purchase return')
  }
}
