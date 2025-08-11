import axios from 'axios'
import { Product, Employee, SaveSalePayload } from './POSsalesOrder.interface'
import { baseURL } from '../../../../utils/helper'

// export const fetchProductBySKU = async (skuCode: string): Promise<Product> => {
//   const res = await axios.post(`${baseURL}/products/sku/`,skuCode, {
//       headers: {
//           Authorization: localStorage.getItem('token') || ''
//         }
//     })
//     console.log('res', res)

//     const data = res.data
//     console.log('data', data)

//   return {
//     id: Date.now(),
//     productName: data.productName,
//     Price: data.price,
//     quantity: 1,
//     Discount: data.discount || 0,
//     totalPrice: data.price - (data.price * (data.discount || 0)) / 100
//   }
// }

export const fetchProductBySKU = async (skuCode: string): Promise<Product> => {
  console.log('Simulating API call for SKU:', skuCode)

  // Define dummy database
  const dummyDatabase: Record<string, { productName: string; price: number; discount: number }> = {
    SKU001: { productName: 'Red Kanjeevaram Silk Saree', price: 79999, discount: 5 },
    SKU002: { productName: 'Silk Saree', price: 69999, discount: 8 },
    SKU003: { productName: 'Red Saree', price: 18999, discount: 10 }
  }

  const data = dummyDatabase[skuCode]

  if (!data) {
    throw new Error('Product not found') // will be caught by UI
  }

  return {
    productId: Date.now(),
    productName: data.productName,
    Price: data.price,
    quantity: 1,
    Discount: data.discount,
    DiscountPrice: (data.price * (data.discount || 0)) / 100, // ₹ value
    totalPrice: data.price - (data.price * data.discount) / 100
  }
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/employees`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch Employee')
  }
}

export const saveSale = async (payload: SaveSalePayload): Promise<any> => {
  try {
    const response = await axios.post(`${baseURL}/admin/settings/addSale`, payload, {
      headers: {
        Authorization: localStorage.getItem('token') || ''
      }
    })
    return response.data
  } catch (error) {
    console.error('❌ Error saving sale:', error)
    throw error
  }
}
