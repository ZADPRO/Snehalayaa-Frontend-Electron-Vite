import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BreadCrumb } from 'primereact/breadcrumb'
import { MenuItem } from 'primereact/menuitem'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import ComponentHeader from '../../00-Header/ComponentHeader'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface InventoryItem {
  ProductName: string
  SKU: string
  Category: string
  SubCategory: string
  CostPrice: number
  Quantity?: number
  ReceivedDate?: string
}

interface StockAgeingRow {
  ProductName: string
  Category: string
  SubCategory: string
  '0-30 Days': number
  '31-60 Days': number
  '61-90 Days': number
  '90+ Days': number
  StockCount: number
}

const StockAgeing: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'Inventory Reports', command: () => navigate('/reports') },
    { label: 'Stock Ageing' }
  ]

  const [ageingData, setAgeingData] = useState<StockAgeingRow[]>([])
  const [loading, setLoading] = useState({ csv: false, excel: false })

  useEffect(() => {
    const inventory: InventoryItem[] = JSON.parse(localStorage.getItem('inventoryData') || '[]')
    const today = new Date()
    const ageingMap: { [key: string]: StockAgeingRow } = {}

    inventory.forEach((item) => {
      const receivedDate = item.ReceivedDate ? new Date(item.ReceivedDate) : today
      const diffDays = Math.floor(
        (today.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      const quantity = item.Quantity ?? 1

      const key = `${item.ProductName}-${item.Category}-${item.SubCategory}`
      if (!ageingMap[key]) {
        ageingMap[key] = {
          ProductName: item.ProductName,
          Category: item.Category,
          SubCategory: item.SubCategory,
          '0-30 Days': 0,
          '31-60 Days': 0,
          '61-90 Days': 0,
          '90+ Days': 0,
          StockCount: 0
        }
      }

      if (diffDays <= 30) ageingMap[key]['0-30 Days'] += quantity
      else if (diffDays <= 60) ageingMap[key]['31-60 Days'] += quantity
      else if (diffDays <= 90) ageingMap[key]['61-90 Days'] += quantity
      else ageingMap[key]['90+ Days'] += quantity

      ageingMap[key].StockCount += quantity
    })

    setAgeingData(Object.values(ageingMap))
  }, [])

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(
        ageingData.map((d) => ({
          'Product Name': d.ProductName,
          Category: d.Category,
          'Sub Category': d.SubCategory,
          '0-30 Days': d['0-30 Days'],
          '31-60 Days': d['31-60 Days'],
          '61-90 Days': d['61-90 Days'],
          '90+ Days': d['90+ Days'],
          'Stock Count': d.StockCount
        }))
      )
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'StockAgeing')
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      saveAs(blob, `stock_ageing.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 1000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader title="Stock Ageing Report" subtitle={new Date().toLocaleDateString()} />
      <div className="p-3">
        <BreadCrumb model={items} />

        {/* Export Buttons */}
        <div className="flex gap-3 mb-3 mt-3">
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
          value={
            ageingData.length
              ? ageingData
              : [
                  {
                    ProductName: '-',
                    Category: '-',
                    SubCategory: '-',
                    '0-30 Days': 0,
                    '31-60 Days': 0,
                    '61-90 Days': 0,
                    '90+ Days': 0,
                    StockCount: 0
                  }
                ]
          }
          paginator
          rows={10}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
          <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ width: '60px' }} />
          <Column field="ProductName" header="Product Name" />
          <Column field="Category" header="Category" />
          <Column field="SubCategory" header="Sub Category" />
          <Column field="0-30 Days" header="0-30 Days" />
          <Column field="31-60 Days" header="31-60 Days" />
          <Column field="61-90 Days" header="61-90 Days" />
          <Column field="90+ Days" header="90+ Days" />
          <Column field="StockCount" header="Stock Count" />
        </DataTable>
      </div>
    </div>
  )
}

export default StockAgeing
