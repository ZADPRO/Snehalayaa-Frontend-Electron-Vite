import axios from 'axios'
import { Branch, Supplier, Category, SubCategory } from './AddNewPurchaseOrder.interface'
import { baseURL } from '../../../../utils/helper'

export const fetchBranches = async (): Promise<Branch[]> => {
  const res = await axios.get(`${baseURL}/admin/settings/branches`, {
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

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`${baseURL}/admin/settings/categories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return res.data.data
}

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  const res = await axios.get(`${baseURL}/admin/settings/subcategories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  return res.data.data.filter((sub: SubCategory) => !sub.isDelete)
}

export const createPurchaseOrder = async (payload: any): Promise<any> => {
  const token = localStorage.getItem('token') || ''

  const response = await axios.post(`${baseURL}/admin/purchaseOrder/create`, payload, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    }
  })

  if (response.data?.status) {
    return response.data
  } else {
    throw new Error(response.data.message || 'Failed to create purchase order')
  }
}
