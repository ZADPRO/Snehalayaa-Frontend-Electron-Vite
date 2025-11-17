import axios from 'axios'
import { baseURL } from '../../../../src/utils/helper'
import { StockTransferResponse } from './InventoryStockTransfer.interface'

export const fetchCategories = async (): Promise<StockTransferResponse> => {
  const response = await axios.get(`${baseURL}/admin/products/stock-transfer/all`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch stock transfers')
  }
}
