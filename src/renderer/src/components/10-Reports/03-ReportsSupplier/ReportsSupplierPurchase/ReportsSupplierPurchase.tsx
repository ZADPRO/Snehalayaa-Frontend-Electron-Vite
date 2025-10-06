import React, { useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BreadCrumb } from 'primereact/breadcrumb'
import { MenuItem } from 'primereact/menuitem'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ComponentHeader from '../../../00-Header/ComponentHeader'

interface SupplierPurchase {
  purchaseId: number
  supplierName: string
  supplierCode: string
  purchaseDate: string
  invoiceNumber: string
  totalAmount: number
  paymentStatus: string
  createdBy: string
}

const ReportsSupplierPurchase: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'Supplier Reports', command: () => navigate('/reports') },
    { label: 'Supplier Purchase' }
  ]

  const [purchases] = useState<SupplierPurchase[]>([
    {
      purchaseId: 1,
      supplierName: 'Testing Supplier 01',
      supplierCode: 'TS01',
      purchaseDate: '2025-09-04',
      invoiceNumber: 'SS-SP-0925-10001',
      totalAmount: 50000,
      paymentStatus: 'Paid',
      createdBy: 'Admin'
    },
    {
      purchaseId: 2,
      supplierName: 'Testing Supplier 02',
      supplierCode: 'TS02',
      purchaseDate: '2025-09-18',
      invoiceNumber: 'SS-SP-0925-10002',
      totalAmount: 75000,
      paymentStatus: 'Pending',
      createdBy: 'Super Admin'
    }
  ])

  const [loading, setLoading] = useState({ csv: false, excel: false })

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(purchases)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SupplierPurchase')
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      saveAs(blob, `supplier_purchase.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 1000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader
        title="Supplier Purchase Report"
        subtitle={new Date().toLocaleDateString()}
      />
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
          value={purchases}
          paginator
          rows={10}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
          <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ width: '60px' }} />
          <Column field="supplierName" header="Supplier Name" />
          <Column field="supplierCode" header="Supplier Code" />
          <Column field="purchaseDate" header="Purchase Date" />
          <Column field="invoiceNumber" header="Invoice Number" />
          <Column field="totalAmount" header="Total Amount" />
          <Column field="paymentStatus" header="Payment Status" />
          <Column field="createdBy" header="Created By" />
        </DataTable>
      </div>
    </div>
  )
}

export default ReportsSupplierPurchase
