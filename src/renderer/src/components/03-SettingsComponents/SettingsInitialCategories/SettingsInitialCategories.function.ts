import api from '../../../utils/api'
import { InitialCategory } from './SettingsAddEditInitialCategories/SettingsAddEditInitialCategories.interface'
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { baseURL } from '../../../utils/helper'

const getFormattedTimestamp = () => {
  const now = new Date()
  const date = now.toLocaleDateString('en-GB').replace(/\//g, '-')
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-')
  return `${date}_${time}`
}

export const fetchInitialCategories = async (): Promise<InitialCategory[]> => {
  const response = await api.get(`${baseURL}/admin/settings/initialCategories`)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch initial categories')
  }
}

// Export categories as CSV
export const exportCSV = (dtRef: React.RefObject<any>) => {
  const fileName = `categories_csv_${getFormattedTimestamp()}.csv`
  dtRef.current?.exportCSV({ selectionOnly: false, filename: fileName })
}

// Export categories as PDF
export const exportPdf = (categories: InitialCategory[]) => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['Code', 'Name', 'Created By', 'Created At', 'Status']],
    body: categories.map((item) => [
      item.initialCategoryCode,
      item.initialCategoryName,
      item.createdBy,
      item.createdAt
    ])
  })

  const fileName = `categories_pdf_${getFormattedTimestamp()}.pdf`
  doc.save(fileName)
}

// Export categories as Excel
export const exportExcel = (categories: InitialCategory[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    categories.map((item) => ({
      Code: item.initialCategoryCode,
      Name: item.initialCategoryName,
      CreatedBy: item.createdBy,
      CreatedAt: item.createdAt
    }))
  )
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  })

  const fileName = `categories_excel_${getFormattedTimestamp()}.xlsx`
  saveAs(blob, fileName)
}
