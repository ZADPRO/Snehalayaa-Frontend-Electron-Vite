import axios from 'axios'
import {
  Branch,
  Supplier,
  InitialCategory,
  PurchaseOrderPayload
} from './NewPurchaseOrderCreation.interface'
import { baseURL, baseURLV2 } from '../../../utils/helper'
import api from '../../../utils/api'

export const fetchBranches = async (): Promise<Branch[]> => {
  const res = await axios.get(`${baseURLV2}/admin/settings/branches`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return res.data.data.filter((branch: Branch) => branch.isActive)
}

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const res = await axios.get(`${baseURL}/admin/suppliers/read`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return res.data.data.filter((supplier: Supplier) => supplier.supplierIsActive === 'true')
}

export const fetchInitialCategories = async (): Promise<InitialCategory[]> => {
  const res = await axios.get(`${baseURL}/admin/settings/initialCategories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return res.data.data
}

// export const createPurchaseOrder = async (payload: any): Promise<any> => {
//   const token = localStorage.getItem('token') || ''

//   const response = await axios.post(`${baseURL}/admin/purchaseOrder/create`, payload, {
//     headers: {
//       Authorization: token,
//       'Content-Type': 'application/json'
//     }
//   })

//   if (response.data?.status) {
//     return response.data
//   } else {
//     throw new Error(response.data.message || 'Failed to create purchase order')
//   }
// }

export const getSignedUploadUrl = async (file: File) => {
  const token = localStorage.getItem('token') || ''

  const extension = file.name.split('.').pop() || ''
  console.log('extension', extension)

  const res = await axios.post(
    `${baseURL}/imageUpload/productImages`,
    { fileName: extension },
    {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    }
  )
  console.log('res', res)

  return res.data
}

export const uploadFileToS3 = async (uploadUrl: string, file: File) => {
  const res = await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type
    }
  })

  return res.status
}

// Create a new Purchase Order
export const createPurchaseOrder = async (payload: PurchaseOrderPayload) => {
  try {
    const response = await api.post('/admin/purchaseOrder', payload)
    console.log('Create PO Response:', response)
    return response.data
  } catch (err) {
    console.error('Error creating PO:', err)
    throw err
  }
}

// Get all Purchase Orders
export const getAllPurchaseOrders = async () => {
  try {
    const response = await api.get('/admin/purchaseOrder')
    console.log('All POs:', response)
    return response.data
  } catch (err) {
    console.error('Error fetching POs:', err)
    throw err
  }
}

// Update a Purchase Order
export const updatePurchaseOrder = async (payload: PurchaseOrderPayload) => {
  try {
    const response = await api.put('/admin/purchaseOrder', payload)
    console.log('Update PO Response:', response)
    return response.data
  } catch (err) {
    console.error('Error updating PO:', err)
    throw err
  }
}
