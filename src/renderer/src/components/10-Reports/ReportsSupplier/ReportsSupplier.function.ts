// import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { FilterOptions, Products, PurchaseOrder, Supplier } from './ReportsSupplier.interface'
import axios from 'axios'
// import * as XLSX from 'xlsx'
import { baseURL } from '../../../../src/utils/helper'

export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV()
}

export const exportReport = async (
  payload: Partial<FilterOptions>,
  format: 'csv' | 'excel' | 'pdf'
) => {
  try {
    const response = await axios.post(`${baseURL}/admin/reports/productReportsDownload`, payload, {
      headers: {
        Authorization: localStorage.getItem('token') || ''
      },
      responseType: 'blob',
      params: { format }
    })

    const fileName = `product_report_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : format}`
    saveAs(new Blob([response.data]), fileName)
  } catch (err: any) {
    throw new Error(err.message || 'Export failed')
  }
}

export const exportPdf = ([]) => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['Code', 'Name', 'Created By', 'Created At', 'Status']]
    // body: categories.map((item) => [
    //   item.categoryCode,
    //   item.categoryName,
    //   item.createdBy,
    //   item.createdAt,
    //   item.isActive ? 'Active' : 'Inactive'
    // ])
  })
  doc.save('categories.pdf')
}

export const exportExcel = ([]) => {
  //   const worksheet = XLSX.utils.json_to_sheet(
  //     categories.map((item) => ({
  //       Code: item.categoryCode,
  //       Name: item.categoryName,
  //       CreatedBy: item.createdBy,
  //       CreatedAt: item.createdAt,
  //       Status: item.isActive ? 'Active' : 'Inactive'
  //     }))
  //   )
  //   const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  //   const blob = new Blob([excelBuffer], {
  //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  //   })
  //   saveAs(blob, `categories_export_${new Date().getTime()}.xlsx`)
}

export const fetchProducts = async (): Promise<Products[]> => {
  const response = await axios.get(`${baseURL}/admin/products/read`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch products')
  }
}

export const fetchSupplier = async (): Promise<Supplier[]> => {
  const response = await axios.get(`${baseURL}/admin/suppliers/read`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch Supplier')
  }
}

export const filterOptions = async (payload: Partial<FilterOptions>) => {
  const response = await axios.post(`${baseURL}/admin/reports/productReports`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  console.log('response.data', response.data)
  return response.data
}

export const fetchInvoice = async (): Promise<PurchaseOrder[]> => {
  const response = await axios.get(`${baseURL}/admin/purchaseOrder/read`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch purchase orders')
  }
}
