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
export interface FetchProductResponse {
  status: boolean
  data?: any
  message?: string
  isPresent: boolean
  branchName: string
}

export const fetchProducts = async (
  fromBranchId: number,
  sku: string
): Promise<FetchProductResponse> => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/products/check-sku`,
      { fromBranchId, sku },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    const res = response.data

    return {
      status: res.status ?? false,
      data: res.data,
      isPresent: res.isPresent ?? false,
      branchName: res.branchName ?? '',
      message: res.message ?? ''
    }
  } catch (error) {
    return {
      status: false,
      isPresent: false,
      branchName: '',
      message: 'Failed to fetch product'
    }
  }
}
