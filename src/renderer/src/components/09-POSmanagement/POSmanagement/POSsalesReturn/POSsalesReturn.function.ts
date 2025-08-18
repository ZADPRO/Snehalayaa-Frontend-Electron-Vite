import axios from 'axios'
import { Product, Employee, SaveSalePayload } from './POSsalesReturn.interface'
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
  // Define dummy database
 const dummyDatabase: Record<
  string,
  {
    refSaleCode: string
    price: number
    isDiscountApplied: boolean
    quantity: number
    customerName: string
    customerPhoneNumber: string
    SoldEmployee?: { RefUserId: number; RefUserFName: string; RefUserCustId: string }[]
  }
> = {
  SKU001: {
    refSaleCode: 'SALE01',
    price: 79999,
    isDiscountApplied: false,
    quantity: 2,
    customerName: 'soniya',
    customerPhoneNumber: '1234567890',
    SoldEmployee: [
      { RefUserId: 1, RefUserFName: 'Thiru', RefUserCustId: 'EMP001' }
    ]
  },
  SKU002: {
    refSaleCode: 'SALE01',
    price: 69999,
    isDiscountApplied: false,
    quantity: 2,
    customerName: 'soniya',
    customerPhoneNumber: '1234567890',
    SoldEmployee: [
      { RefUserId: 1, RefUserFName: 'Thiru', RefUserCustId: 'EMP001' }
    ]
  },
  SKU003: {
    refSaleCode: 'SALE01',
    price: 18999,
    isDiscountApplied: true,
    quantity: 1,
    customerName: 'soniya',
    customerPhoneNumber: '1234567890',
    SoldEmployee: [
      { RefUserId: 1, RefUserFName: 'Thiru', RefUserCustId: 'EMP001' }
    ]
  }
}

  const data = dummyDatabase[skuCode]

  if (!data) {
    throw new Error('Product not found') // will be caught by UI
  }

  return {
    productId: Date.now(),
    productName: data.refSaleCode,
    Price: data.price,
    quantity: data.quantity,
    isDiscountApplied: data.isDiscountApplied,
    customerName: data.customerName,
    customerPhoneNumber: data.customerPhoneNumber,
    SoldEmployee: data.SoldEmployee || []
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
