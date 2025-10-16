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

interface SupplierDetails {
  supplierId: number
  supplierName: string
  supplierCompanyName: string
  supplierCode: string
  supplierEmail: string
  supplierGSTNumber: string
  supplierPaymentTerms: string
  supplierContactNumber: string
  supplierCity: string
  supplierState: string
  supplierCountry: string
  supplierIsActive: string
}

const ReportsSupplierDetails: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'Supplier Reports', command: () => navigate('/reports') },
    { label: 'Supplier Details' }
  ]

  const [suppliers] = useState<SupplierDetails[]>([
    {
      supplierId: 3,
      supplierName: 'Testing Supplier 01',
      supplierCompanyName: 'Testing Chennai',
      supplierCode: 'TS01',
      supplierEmail: 'thiru@gmail.com',
      supplierGSTNumber: 'SADF87678',
      supplierPaymentTerms: 'Monthly',
      supplierContactNumber: '9876543212',
      supplierCity: 'Salem',
      supplierState: 'TN',
      supplierCountry: 'India',
      supplierIsActive: 'true'
    },
    {
      supplierId: 4,
      supplierName: 'Testing Supplier 02',
      supplierCompanyName: 'Testing Company 2',
      supplierCode: 'TS02',
      supplierEmail: 'mailtothirukumara@gmail.com',
      supplierGSTNumber: 'ASFD9876',
      supplierPaymentTerms: 'Twice',
      supplierContactNumber: '788579373',
      supplierCity: 'Zürich',
      supplierState: 'Swiss',
      supplierCountry: 'Switzerland',
      supplierIsActive: 'true'
    }
  ])

  const [loading, setLoading] = useState({ csv: false, excel: false })

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(suppliers)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SupplierDetails')
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      saveAs(blob, `supplier_details.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 1000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader title="Supplier Details Report" subtitle={new Date().toLocaleDateString()} />
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
          value={suppliers}
          paginator
          rows={10}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
          <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ width: '60px' }} />
          <Column field="supplierName" header="Supplier Name" />
          <Column field="supplierCompanyName" header="Company Name" />
          <Column field="supplierCode" header="Supplier Code" />
          <Column field="supplierEmail" header="Email" />
          <Column field="supplierGSTNumber" header="GST Number" />
          <Column field="supplierPaymentTerms" header="Payment Terms" />
          <Column field="supplierContactNumber" header="Contact Number" />
          <Column field="supplierCity" header="City" />
          <Column field="supplierState" header="State" />
          <Column field="supplierCountry" header="Country" />
          <Column field="supplierIsActive" header="Active Status" />
        </DataTable>
      </div>
    </div>
  )
}

export default ReportsSupplierDetails
