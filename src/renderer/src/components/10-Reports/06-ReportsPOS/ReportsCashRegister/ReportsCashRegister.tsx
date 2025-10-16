import React, { useState, useRef } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import { MenuItem } from 'primereact/menuitem'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Calendar } from 'primereact/calendar'
import ComponentHeader from '../../../00-Header/ComponentHeader'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface CashRegisterRow {
  date: Date
  invoiceNo: string
  cashier: string
  openingBalance: number
  cashSales: number
  cardSales: number
  upiSales: number
  expenses: number
  closingBalance: number
}

const ReportsCashRegister: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'POS Reports', command: () => navigate('/reports') },
    { label: 'Cash Register Reports' }
  ]

  const today = new Date()
  const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

  // Generate balanced sample data
  const [cashRegisterData] = useState<CashRegisterRow[]>(
    Array.from({ length: 10 }).map((_, idx) => {
      const openingBalance = 10000 + idx * 5000
      const cashSales = 15000 + idx * 2000
      const cardSales = 12000 + idx * 1000
      const upiSales = 10000 + idx * 800
      const expenses = 5000 + idx * 1000

      return {
        date: new Date(2025, 8, 20, 10 + idx, idx * 5),
        invoiceNo: `SS-${monthDay}-${10001 + idx}`,
        cashier: `Thiru`,
        openingBalance,
        cashSales,
        cardSales,
        upiSales,
        expenses,
        closingBalance: openingBalance + cashSales + cardSales + upiSales - expenses
      }
    })
  )

  // Filters
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState({ csv: false, excel: false })

  const filteredData = cashRegisterData.filter((row) => {
    if (!fromDate && !toDate) return true
    if (fromDate && row.date < fromDate) return false
    if (toDate && row.date > toDate) return false
    return true
  })

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData.map((d) => ({
          Date: d.date.toLocaleString('en-US', { hour12: true }),
          Invoice: d.invoiceNo,
          Cashier: d.cashier,
          'Opening Balance': d.openingBalance,
          'Cash Sales': d.cashSales,
          'Card Sales': d.cardSales,
          'UPI/Online Sales': d.upiSales,
          Expenses: d.expenses,
          'Closing Balance': d.closingBalance
        }))
      )
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'CashRegister')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, `cash_register.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 3000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader
        title="Cash Register Report"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />

      <div className="p-3">
        <BreadCrumb model={items} />

        <div className="flex gap-3 mt-4 mb-3 items-center">
          <Calendar
            value={fromDate}
            onChange={(e) => setFromDate(e.value as Date)}
            showIcon
            placeholder="From Date"
          />
          <Calendar
            value={toDate}
            onChange={(e) => setToDate(e.value as Date)}
            showIcon
            placeholder="To Date"
          />
          <Button
            label="Export CSV"
            className="p-button-secondary"
            loading={loading.csv}
            onClick={() => exportData('csv')}
          />
          <Button
            label="Export Excel"
            className="p-button-success"
            loading={loading.excel}
            onClick={() => exportData('excel')}
          />
        </div>

        <DataTable
          value={filteredData}
          paginator
          rows={5}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
          <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ width: '60px' }} />
          <Column
            field="date"
            header="Date/Time"
            body={(rowData) =>
              rowData.date.toLocaleString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          />
          <Column field="invoiceNo" header="Invoice No" />
          <Column field="cashier" header="Cashier" />
          <Column field="openingBalance" header="Opening Balance" />
          <Column field="cashSales" header="Cash Sales" />
          <Column field="cardSales" header="Card Sales" />
          <Column field="upiSales" header="UPI/Online Sales" />
          <Column field="expenses" header="Expenses" />
          <Column field="closingBalance" header="Closing Balance" />
        </DataTable>
      </div>
    </div>
  )
}

export default ReportsCashRegister
