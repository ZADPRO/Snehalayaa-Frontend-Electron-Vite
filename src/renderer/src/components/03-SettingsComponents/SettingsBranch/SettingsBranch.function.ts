import axios from 'axios'
import { Branch } from './SettingsBranch.interface'
import { baseURL } from '../../../utils/helper'
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export const fetchBranch = async (): Promise<Branch[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/branches`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  console.log('response', response)
  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch Branch')
  }
}

export const deleteBranch = async (
  refBranchId: number,
  forceDelete: boolean = false
): Promise<any> => {
  console.log('refBranchId', refBranchId)
  const token = localStorage.getItem('token') || ''
  const url = `${baseURL}/admin/settings/branches/${refBranchId}${forceDelete ? '?forceDelete=true' : ''}`

  const response = await axios.delete(url, {
    headers: { Authorization: token }
  })

  return response.data
}
export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV()
}

export const exportPdf = (branches: Branch[]) => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['Code', 'Name', 'Location', 'Contact Number', 'Email', 'is Main Branch', 'Status']],
    body: branches.map((item) => [
      item.refBranchCode,
      item.refBranchName,
      item.refLocation,
      item.refMobile,
      item.refEmail,
      item.isMainBranch ? 'Yes' : 'No',
      item.isActive ? 'Active' : 'Inactive'
    ])
  })
  doc.save('suppliers.pdf')
}

export const exportExcel = (branches: Branch[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    branches.map((item) => ({
      Code: item.refBranchCode,
      Name: item.refBranchName,
      refLocation: item.refLocation,
      ContactNumber: item.refMobile,
      Email: item.refEmail,
      isMainBranch: item.isMainBranch ? 'Yes' : 'No',
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
