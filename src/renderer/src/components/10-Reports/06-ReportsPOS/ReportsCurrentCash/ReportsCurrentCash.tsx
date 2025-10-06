import React, { useState, useRef, useEffect } from 'react'
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

interface CurrentCash {
  cashier: string
  openingBalance: number
  cashSales: number
  cardSales: number
  upiSales: number
  expenses: number
  closingBalance: number
}

const ReportsCurrentCash: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'POS Reports', command: () => navigate('/reports') },
    { label: 'Current Cash Report' }
  ]

  // Filters
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState({ csv: false, excel: false })

  // Sample Data - mimicking O2Vend current cash
  const [currentCashData, setCurrentCashData] = useState<CurrentCash[]>([])

  useEffect(() => {
    const today = new Date()
    console.log('today', today)
    const sampleData: CurrentCash[] = [
      {
        cashier: 'Thiru',
        openingBalance: 50000,
        cashSales: 15000,
        cardSales: 10000,
        upiSales: 8000,
        expenses: 2000,
        closingBalance: 61000
      },
      {
        cashier: 'Thiru',
        openingBalance: 60000,
        cashSales: 20000,
        cardSales: 15000,
        upiSales: 10000,
        expenses: 3000,
        closingBalance: 102000
      },
      {
        cashier: 'Thiru',
        openingBalance: 40000,
        cashSales: 12000,
        cardSales: 8000,
        upiSales: 5000,
        expenses: 1000,
        closingBalance: 55000
      }
    ]

    setCurrentCashData(sampleData)
  }, [])

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(
        currentCashData.map((d) => ({
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'CurrentCash')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, `current_cash.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 3000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader
        title="Current Cash Report"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />

      <div className="p-3">
        <BreadCrumb model={items} />

        {/* Filters & Export */}
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

        {/* DataTable */}
        <DataTable
          value={currentCashData}
          paginator
          rows={5}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
          <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ width: '60px' }} />
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

export default ReportsCurrentCash
