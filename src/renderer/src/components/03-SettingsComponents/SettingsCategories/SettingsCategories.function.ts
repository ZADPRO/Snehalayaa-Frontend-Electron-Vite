import api from '../../../utils/api'
import { Category } from './SettingsCategories.interface'
import { baseURL } from '../../../utils/helper'
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get(`${baseURL}/admin/settings/categories`)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch categories')
  }
}

// Delete a single category
export const deleteCategory = async (
  categoryId: number,
  forceDelete: boolean = false
): Promise<any> => {
  const url = `${baseURL}/admin/settings/categories/${categoryId}${
    forceDelete ? '?forceDelete=true' : ''
  }`
  const response = await api.delete(url)
  return response.data
}

// Bulk delete categories
export const bulkDeleteCategories = async (
  categoryIds: number[],
  forceDelete: boolean = false
): Promise<any> => {
  const response = await api.delete(`${baseURL}/admin/settings/categories`, {
    data: {
      categoryIds,
      forceDelete
    }
  })
  return response.data
}

// Export categories as CSV
export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV()
}

// Export categories as PDF
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

// Export categories as Excel
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
