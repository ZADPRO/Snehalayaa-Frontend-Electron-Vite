import axios from 'axios'
import { baseURL } from '../../../../utils/helper'
import { PurchaseReturnPayload } from './ViewPurchaseOrderProducts.interface'

// Create axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor → add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || ''
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// Response interceptor → check invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('error', error)
    const message = error?.response?.error || error?.response?.message
    if (message === 'Invalid token') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ========== API FUNCTIONS ========== //

export const fetchDummyProductsByPOId = async (purchaseOrderId: number) => {
  try {
    const response = await api.get(`/admin/purchaseOrder/dummy-products/${purchaseOrderId}`)
    return response.data?.data || []
  } catch (error) {
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

    const response = await api.put(`/admin/purchaseOrder/dummy-products/update`, payload)
    return response.data
  } catch (error) {
    console.error('Failed to update product status:', error)
    return null
  }
}

export const bulkAcceptDummyProducts = async (dummyProductIds: number[]) => {
  try {
    const response = await api.put(`/admin/purchaseOrder/dummy-products/bulk-accept`, {
      dummyProductIds
    })
    return response.data
  } catch (error) {
    console.error('Failed to bulk accept products:', error)
    return null
  }
}

export const bulkRejectDummyProducts = async (dummyProductIds: number[], reason: string) => {
  try {
    const response = await api.put(`/admin/purchaseOrder/dummy-products/bulk-reject`, {
      dummyProductIds,
      reason
    })
    return response.data
  } catch (error) {
    console.error('Failed to bulk reject products:', error)
    return null
  }
}

export const bulkUndoDummyProducts = async (dummyProductIds: number[]) => {
  try {
    const response = await api.put(`/admin/purchaseOrder/dummy-products/bulk-undo`, {
      dummyProductIds
    })
    return response.data
  } catch (error) {
    console.error('Failed to bulk undo products:', error)
    return null
  }
}

export const fetchCategories = async () => {
  try {
    const response = await api.get(`/admin/settings/categories`)
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export const fetchSubCategories = async () => {
  try {
    const response = await api.get(`/admin/settings/subcategories`)
    return response.data?.data || []
  } catch (error) {
    console.error('Failed to fetch subcategories:', error)
    return []
  }
}

export const createPurchaseReturn = async (payload: PurchaseReturnPayload): Promise<any> => {
  try {
    const response = await api.post(`/admin/purchaseReturn`, payload)
    if (response.data?.status) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to create purchase return')
    }
  } catch (error) {
    console.error('Failed to create purchase return:', error)
    throw error
  }
}
