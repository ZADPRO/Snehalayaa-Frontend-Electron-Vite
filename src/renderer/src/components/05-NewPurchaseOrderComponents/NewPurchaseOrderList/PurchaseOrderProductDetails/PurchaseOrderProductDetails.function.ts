import api from '../../../../utils/api'
import { baseURL } from '../../../../utils/helper'

export interface UpdatePOProductRequest {
  purchase_order_id: number
  purchase_order_number: string
  category_id: number | null
  po_product_id: number
  accepted_quantity: number
  rejected_quantity: number
  status: string
}

// ✅ Save PO Product updates
export const savePurchaseOrderProducts = async (
  payload: UpdatePOProductRequest[]
): Promise<boolean> => {
  try {
    const response = await api.post(`${baseURL}/admin/updatePurchaseOrderProducts`, payload)

    if (response.data?.status) {
      return true
    } else {
      throw new Error(response.data.message || 'Failed to update purchase order products')
    }
  } catch (error: any) {
    console.error('❌ Error in savePurchaseOrderProducts:', error)
    throw new Error(error.response?.data?.message || error.message || 'Something went wrong')
  }
}
