import React, { useState, useEffect, useRef } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import { MenuItem } from 'primereact/menuitem'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ComponentHeader from '../../00-Header/ComponentHeader'

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
  Quantity?: number // Optional, default 1
}

interface StockValuation {
  ProductName: string
  Category: string
  SubCategory: string
  Quantity: number
  CostPrice: number
  SellingPrice: number
  TotalCost: number
  TotalValue: number
}

const ReportsStockValuationSummary: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'Inventory Reports', command: () => navigate('/reports') },
    { label: 'Stock Valuation Summary' }
  ]

  const [stockData, setStockData] = useState<StockItem[]>([])
  console.log('stockData', stockData)
  const [valuationData, setValuationData] = useState<StockValuation[]>([])
  const [loading, setLoading] = useState({ csv: false, excel: false })

  // Fetch inventory data from localStorage
  useEffect(() => {
    const data: StockItem[] = JSON.parse(localStorage.getItem('inventoryData') || '[]')
    setStockData(data)

    // Compute valuation summary
    const summaryMap: { [key: string]: StockValuation } = {}

    data.forEach((item) => {
      const key = `${item.ProductName}-${item.Category}-${item.SubCategory}`
      const quantity = item.Quantity || 1
      if (!summaryMap[key]) {
        summaryMap[key] = {
          ProductName: item.ProductName,
          Category: item.Category,
          SubCategory: item.SubCategory,
          Quantity: quantity,
          CostPrice: item.CostPrice,
          SellingPrice: item.SellingPrice,
          TotalCost: item.CostPrice * quantity,
          TotalValue: item.SellingPrice * quantity
        }
      } else {
        summaryMap[key].Quantity += quantity
        summaryMap[key].TotalCost += item.CostPrice * quantity
        summaryMap[key].TotalValue += item.SellingPrice * quantity
      }
    })

    setValuationData(Object.values(summaryMap))
  }, [])

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(valuationData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'StockValuation')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, `stock_valuation.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 1000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader
        title="Stock Valuation Summary"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />

      <div className="p-3">
        <BreadCrumb model={items} />

        {/* Export Buttons */}
        <div className="flex gap-3 mt-4 mb-3 items-center">
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
          value={valuationData}
          paginator
          rows={5}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
          <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ width: '60px' }} />
          <Column field="ProductName" header="Product Name" />
          <Column field="Category" header="Category" />
          <Column field="SubCategory" header="Sub Category" />
          <Column field="Quantity" header="Quantity" />
          <Column field="CostPrice" header="Cost Price" />
          <Column field="SellingPrice" header="Selling Price" />
          <Column field="TotalCost" header="Total Cost" />
          <Column field="TotalValue" header="Total Value" />
        </DataTable>
      </div>
    </div>
  )
}

export default ReportsStockValuationSummary
