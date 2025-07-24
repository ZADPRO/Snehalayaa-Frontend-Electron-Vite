import { inventory } from "./InventoryTracker.interface"
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV()
}

export const exportPdf = (categories: inventory[]) => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['Code', 'Name', 'Created By', 'Created At', 'Status']],
    body: categories.map((_item) => [
    //   item.createdBy,
    //   item.createdAt,
    //   item.isActive ? 'Active' : 'Inactive'
    ])
  })
  doc.save('categories.pdf')
}

export const exportExcel = (categories: inventory[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    categories.map((_item) => ({
    //   CreatedBy: item.createdBy,
    //   CreatedAt: item.createdAt,
    //   Status: item.isActive ? 'Active' : 'Inactive'
    }))
  )
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  })
  saveAs(blob, `categories_export_${new Date().getTime()}.xlsx`)
}
