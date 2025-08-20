import axios from 'axios'
import { Floor, ProductFormData, Products, Section } from './InventoryProducts.interface'
import { baseURL } from '../../../utils/helper'

export const fetchProducts = async (): Promise<Products[]> => {
  return [
    {
      refPtId: 101,
      refCategoryId: 24,
      refSubCategoryId: 1,
      poHSN: '6204',
      poId: 1,
      poPrice: '1500.00',
      poQuantity: '10',
      poSKU: 'S-PATTU-001',
      poTotalPrice: '1350.00',
      poName: 'Red Kanjeevaram Silk Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 102,
      refCategoryId: 25,
      refSubCategoryId: 2,
      poHSN: '6203',
      poId: 2,
      poPrice: '1250.00',
      poQuantity: '20',
      poSKU: 'S-S-001',
      poTotalPrice: '1150.00',
      poName: 'Golden Banarasi Silk Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 103,
      refCategoryId: 26,
      refSubCategoryId: 3,
      poHSN: '6204',
      poId: 3,
      poPrice: '1600.00',
      poQuantity: '15',
      poSKU: 'D-PATTU-002',
      poTotalPrice: '1400.00',
      poName: 'Pink Floral Chiffon Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 104,
      refCategoryId: 24,
      refSubCategoryId: 1,
      poHSN: '6203',
      poId: 4,
      poPrice: '1000.00',
      poQuantity: '25',
      poSKU: 'S-SAREE-002',
      poTotalPrice: '920.00',
      poName: 'Pastel Linen Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 105,
      refCategoryId: 25,
      refSubCategoryId: 2,
      poHSN: '6204',
      poId: 5,
      poPrice: '1550.00',
      poQuantity: '18',
      poSKU: 'SS-PATTU-003',
      poTotalPrice: '1370.00',
      poName: 'Beige Handloom Cotton Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 106,
      refCategoryId: 26,
      refSubCategoryId: 3,
      poHSN: '6203',
      poId: 6,
      poPrice: '1300.00',
      poQuantity: '22',
      poSKU: 'S-SAREE-003',
      poTotalPrice: '1180.00',
      poName: 'Blue Georgette Stonework Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    }
  ]
}

export const saveAcceptProducts = async (payload: ProductFormData): Promise<boolean> => {
  const response = await axios.post(`${baseURL}/admin/accept`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || '',
      'Content-Type': 'application/json'
    }
  })

  if (response.data?.status) {
    return true // or you could return response.data if you need more info
  } else {
    throw new Error(response.data?.message || 'Failed to save User Roles')
  }
}



export const fetchFloor = async (): Promise<Floor[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/employeeRoleType`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.roles 
  } else {
    throw new Error(response.data.message || 'Failed to fetch Employee')
  }
}
export const fetchSection = async (): Promise<Section[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/branches`, {
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