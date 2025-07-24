import axios from 'axios'
import { Category } from './SettingsCategories.interface'
import { baseURL } from '../../../utils/helper'
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/categories`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch categories')
  }
}

export const deleteCategory = async (
  categoryId: number,
  forceDelete: boolean = false
): Promise<any> => {
  const token = localStorage.getItem('token') || ''
  const url = `${baseURL}/admin/settings/categories/${categoryId}${forceDelete ? '?forceDelete=true' : ''}`

  const response = await axios.delete(url, {
    headers: { Authorization: token }
  })

  return response.data
}

export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV()
}

export const exportPdf = (categories: Category[]) => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['Code', 'Name', 'Created By', 'Created At', 'Status']],
    body: categories.map((item) => [
      item.categoryCode,
      item.categoryName,
      item.createdBy,
      item.createdAt,
      item.isActive ? 'Active' : 'Inactive'
    ])
  })
  doc.save('categories.pdf')
}

export const exportExcel = (categories: Category[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    categories.map((item) => ({
      Code: item.categoryCode,
      Name: item.categoryName,
      CreatedBy: item.createdBy,
      CreatedAt: item.createdAt,
      Status: item.isActive ? 'Active' : 'Inactive'
    }))
  )
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  })
  saveAs(blob, `categories_export_${new Date().getTime()}.xlsx`)
}

export const bulkDeleteCategories = async (
  categoryIds: number[],
  forceDelete: boolean = false
): Promise<any> => {
  const token = localStorage.getItem('token') || ''
  const response = await axios.delete(`${baseURL}/admin/settings/categories`, {
    headers: { Authorization: token },
    data: {
      categoryIds,
      forceDelete
    }
  })
  return response.data
}
