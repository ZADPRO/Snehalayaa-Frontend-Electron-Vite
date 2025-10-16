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

interface Supplier {
  supplierId: number
  supplierName: string
  supplierCompanyName: string
  supplierCode: string
  supplierEmail: string
  supplierGSTNumber: string
  supplierPaymentTerms: string
  supplierBankACNumber: string
  supplierIFSC: string
  supplierBankName: string
  supplierUPI: string
  supplierIsActive: string
  supplierContactNumber: string
  emergencyContactName: string
  emergencyContactNumber: string
  supplierDoorNumber: string
  supplierStreet: string
  supplierCity: string
  supplierState: string
  supplierCountry: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
  creditedDays: number
}

const ReportsSupplier: React.FC = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)

  const items: MenuItem[] = [
    { label: 'Reports', command: () => navigate('/reports') },
    { label: 'Supplier Reports', command: () => navigate('/reports') },
    { label: 'Supplier Details' }
  ]

  const [suppliers] = useState<Supplier[]>([
    {
      supplierId: 3,
      supplierName: 'Testing Supplier 01',
      supplierCompanyName: 'Testing Chennai',
      supplierCode: 'TS01',
      supplierEmail: 'thiru@gmail.com',
      supplierGSTNumber: 'SADF87678',
      supplierPaymentTerms: 'Monthly',
      supplierBankACNumber: '98765432123',
      supplierIFSC: 'CNRB100210',
      supplierBankName: 'Testing Supplier',
      supplierUPI: 'thiru@upi',
      supplierIsActive: 'true',
      supplierContactNumber: '9876543212',
      emergencyContactName: 'No',
      emergencyContactNumber: '0',
      supplierDoorNumber: '12',
      supplierStreet: 'Gandhi St',
      supplierCity: 'Salem',
      supplierState: 'TN',
      supplierCountry: 'India',
      createdAt: '2025-08-27 12:01:38',
      createdBy: 'Super Admin',
      updatedAt: '',
      updatedBy: '',
      isDelete: false,
      creditedDays: 30
    },
    {
      supplierId: 4,
      supplierName: 'Testing Supplier 02',
      supplierCompanyName: 'Testing Company 2',
      supplierCode: 'TS02',
      supplierEmail: 'mailtothirukumara@gmail.com',
      supplierGSTNumber: 'ASFD9876',
      supplierPaymentTerms: 'Twice',
      supplierBankACNumber: '987654324567',
      supplierIFSC: 'CNRB100210',
      supplierBankName: 'Testing Supplier 02',
      supplierUPI: 'thiru@okicici',
      supplierIsActive: 'true',
      supplierContactNumber: '788579373',
      emergencyContactName: 'FAISAL KHAN',
      emergencyContactNumber: '9876543212',
      supplierDoorNumber: '12',
      supplierStreet: 'Industriestrasse 24',
      supplierCity: 'Zürich',
      supplierState: 'Swiss',
      supplierCountry: 'Switzerland',
      createdAt: '2025-08-28 12:59:42',
      createdBy: 'Super Admin',
      updatedAt: '2025-08-28 12:59:54',
      updatedBy: 'Admin',
      isDelete: false,
      creditedDays: 50
    }
  ])

  const [loading, setLoading] = useState({ csv: false, excel: false })

  const exportData = (type: 'csv' | 'excel') => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(
        suppliers.map((s) => ({
          'Supplier Name': s.supplierName,
          'Company Name': s.supplierCompanyName,
          Code: s.supplierCode,
          Email: s.supplierEmail,
          'GST Number': s.supplierGSTNumber,
          'Payment Terms': s.supplierPaymentTerms,
          'Bank AC': s.supplierBankACNumber,
          IFSC: s.supplierIFSC,
          'Bank Name': s.supplierBankName,
          UPI: s.supplierUPI,
          'Is Active': s.supplierIsActive,
          'Contact Number': s.supplierContactNumber,
          'Emergency Contact Name': s.emergencyContactName,
          'Emergency Contact Number': s.emergencyContactNumber,
          Address: `${s.supplierDoorNumber}, ${s.supplierStreet}, ${s.supplierCity}, ${s.supplierState}, ${s.supplierCountry}`,
          'Created At': s.createdAt,
          'Created By': s.createdBy,
          'Updated At': s.updatedAt,
          'Updated By': s.updatedBy,
          'Credited Days': s.creditedDays
        }))
      )
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers')
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      saveAs(blob, `suppliers.${type === 'csv' ? 'csv' : 'xlsx'}`)
      setLoading((prev) => ({ ...prev, [type]: false }))
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Export completed!' })
    }, 1000)
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader title="Supplier Report" subtitle={new Date().toLocaleDateString()} />
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
          <Column field="supplierCode" header="Code" />
          <Column field="supplierEmail" header="Email" />
          <Column field="supplierGSTNumber" header="GST Number" />
          <Column field="supplierPaymentTerms" header="Payment Terms" />
          <Column field="supplierContactNumber" header="Contact Number" />
          <Column field="creditedDays" header="Credited Days" />
          <Column
            header="Address"
            body={(row) =>
              `${row.supplierDoorNumber}, ${row.supplierStreet}, ${row.supplierCity}, ${row.supplierState}, ${row.supplierCountry}`
            }
          />
        </DataTable>
      </div>
    </div>
  )
}

export default ReportsSupplier
