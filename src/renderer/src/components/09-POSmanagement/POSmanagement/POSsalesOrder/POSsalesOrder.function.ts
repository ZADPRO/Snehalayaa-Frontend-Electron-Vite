import axios from 'axios'
import { Product } from './POSsalesOrder.interface'
import { baseURL } from '../../../../utils/helper'

export const fetchProductBySKU = async (skuCode: string): Promise<Product> => {
  const res = await axios.post(`${baseURL}/products/sku/`, skuCode, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  console.log('res', res)

  const data = res.data
  console.log('data', data)

  return {
    id: Date.now(),
    productName: data.productName,
    Price: data.price,
    quantity: 1,
    Discount: data.discount || 0,
    totalPrice: data.price - (data.price * (data.discount || 0)) / 100
  }
}
