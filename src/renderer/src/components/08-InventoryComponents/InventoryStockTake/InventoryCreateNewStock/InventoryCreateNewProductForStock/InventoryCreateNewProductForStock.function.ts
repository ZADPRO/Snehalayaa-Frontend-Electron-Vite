// import axios from "axios"
// import { baseURL } from "../../../../../utils/helper"
import { Products } from './InventoryCreateNewProductForStock.interface'

export const formatINRCurrency = (value: string | number) => {
  const num = Number(value)
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(num)
}

// export const fetchProducts = async (): Promise<Products[]> => {
//   const response = await axios.get(`${baseURL}/admin/products/read`, {
//     headers: {
//       Authorization: localStorage.getItem('token') || ''
//     }
//   })

//   console.log('response', response)
//   if (response.data?.status) {
//     return response.data.data
//   } else {
//     throw new Error(response.data.message || 'Failed to fetch products')
//   }
// }

export const fetchProducts = async (): Promise<Products[]> => {
  console.log('fetchProducts', fetchProducts)
  return [
    {
      refPtId: 101,
      refCategoryId: 24,
      refSubCategoryId: 1,
      poDescription: 'Traditional pink silk pattu pavadai for kids',
      poDisc: '150.00',
      poDiscPercent: '10',
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
      poDescription: 'Elegant veshti sattai with golden border',
      poDisc: '100.00',
      poDiscPercent: '8',
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
      poDescription: 'Maroon pattu pavadai with zari border',
      poDisc: '200.00',
      poDiscPercent: '12',
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
      poDescription: 'Cotton veshti sattai for boys',
      poDisc: '80.00',
      poDiscPercent: '6',
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
      poDescription: 'Green silk pavadai with golden border',
      poDisc: '180.00',
      poDiscPercent: '11',
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
      poDescription: 'Blue silk veshti with shirt combo',
      poDisc: '120.00',
      poDiscPercent: '9',
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
    },
    {
      refPtId: 107,
      refCategoryId: 24,
      refSubCategoryId: 1,
      poDescription: 'Purple pavadai with designer blouse',
      poDisc: '210.00',
      poDiscPercent: '13',
      poHSN: '6204',
      poId: 7,
      poPrice: '1700.00',
      poQuantity: '12',
      poSKU: 'SS-PATTU-004',
      poTotalPrice: '1490.00',
      poName: 'Cream Silk Cotton Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 108,
      refCategoryId: 25,
      refSubCategoryId: 2,
      poDescription: 'Cream veshti set for festivals',
      poDisc: '90.00',
      poDiscPercent: '7',
      poHSN: '6203',
      poId: 8,
      poPrice: '1150.00',
      poQuantity: '16',
      poSKU: 'RR-SAREE-004',
      poTotalPrice: '1060.00',
      poName: 'Golden Tissue Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 109,
      refCategoryId: 26,
      refSubCategoryId: 3,
      poDescription: 'Yellow and red silk pavadai',
      poDisc: '160.00',
      poDiscPercent: '10',
      poHSN: '6204',
      poId: 9,
      poPrice: '1450.00',
      poQuantity: '20',
      poSKU: 'RR-PATTU-005',
      poTotalPrice: '1290.00',
      poName: 'Red Designer Net Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    },
    {
      refPtId: 110,
      refCategoryId: 24,
      refSubCategoryId: 1,
      poDescription: 'Silk veshti with shirt for wedding wear',
      poDisc: '110.00',
      poDiscPercent: '8',
      poHSN: '6203',
      poId: 10,
      poPrice: '1400.00',
      poQuantity: '19',
      poSKU: 'RR-SAREE-005',
      poTotalPrice: '1290.00',
      poName: 'Purple Banarasi Brocade Saree',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isDelete: false
    }
  ]
}
