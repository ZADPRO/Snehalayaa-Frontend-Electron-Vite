import React, { useState, useEffect, useRef } from 'react'
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

interface StockItem {
  'S.No': number
  ProductName: string
  SKU: string
  ProductType: string
  Category: string
  SubCategory: string
  Fabric: string
  SellingPrice: number
  CostPrice: number
  Discount: number
}

const ReportsStockSummary: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'Inventory Reports', command: () => navigate('/reports') },
    { label: 'Stock Summary Report' }
  ]

  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState({ csv: false, excel: false })

  const [stockData, setStockData] = useState<StockItem[]>([])

  // Fetch data from localStorage
  useEffect(() => {
    const data: StockItem[] = JSON.parse(localStorage.getItem('inventoryData') || '[]')
    setStockData(data)
  }, [])

  // Filter by date if needed (optional)
  const filteredData = stockData.filter((row) => {
    console.log('row', row)
    return true // No date filter by default; can be customized if date exists
  })

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(filteredData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'StockSummary')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, `stock_summary.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 1000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader
        title="Stock Summary Report"
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
          value={filteredData}
          paginator
          rows={5}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
          <Column field="S.No" header="S.No" />
          <Column field="ProductName" header="Product Name" />
          <Column field="SKU" header="SKU" />
          <Column field="ProductType" header="Product Type" />
          <Column field="Category" header="Category" />
          <Column field="SubCategory" header="Sub Category" />
          <Column field="Fabric" header="Fabric" />
          <Column field="SellingPrice" header="Selling Price" />
          <Column field="CostPrice" header="Cost Price" />
          <Column field="Discount" header="Discount" />
        </DataTable>
      </div>
    </div>
  )
}

export default ReportsStockSummary
