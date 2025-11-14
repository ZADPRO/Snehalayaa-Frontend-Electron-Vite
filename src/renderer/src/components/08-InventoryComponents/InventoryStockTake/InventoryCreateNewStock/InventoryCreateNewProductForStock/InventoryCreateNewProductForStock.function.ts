// import axios from "axios"
import { baseURL } from '../../../../../utils/helper'
import axios from 'axios'

export const formatINRCurrency = (value: string | number) => {
  const num = Number(value)
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(num)
}

export const fetchProducts = async (
  fromBranchId: number,
  sku: string
): Promise<{ status: boolean; data?: any; message?: string }> => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/products/check-sku`,
      {
        fromBranchId,
        sku
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    const resData = response.data
    if (resData.status) {
      return { status: true, data: resData.data }
    } else {
      return { status: false, message: resData.message || 'SKU not found' }
    }
  } catch (error) {
    console.error('Error fetching product by SKU:', error)
    return { status: false, message: 'Failed to fetch product' }
  }
}
