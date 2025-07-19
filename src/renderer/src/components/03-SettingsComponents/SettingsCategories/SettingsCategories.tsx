import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { Category } from './SettingsCategories.interface'
import { fetchCategories } from './SettingsCategories.function'
import { Tooltip } from 'primereact/tooltip'

import { Plus, Pencil, Trash2, FileText, FileSpreadsheet, FileSignature } from 'lucide-react'

const SettingsCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable>(null)

  const loadCategories = async () => {
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load categories',
        life: 3000
      })
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const isSingleSelected = selectedCategories.length === 1
  const isAnySelected = selectedCategories.length > 0

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default()
        doc.autoTable({
          head: [['Code', 'Name', 'Created By', 'Created At', 'Status']],
          body: categories.map((item) => [
            item.categoryCode,
            item.categoryName,
            item.createdBy,
            item.createdAt,
            item.isActive ? 'Active' : 'Inactive'
          ])
        })
        doc.save('categories.pdf')
      })
    })
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(
        categories.map((item) => ({
          Code: item.categoryCode,
          Name: item.categoryName,
          CreatedBy: item.createdBy,
          CreatedAt: item.createdAt,
          Status: item.isActive ? 'Active' : 'Inactive'
        }))
      )
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
      saveAsExcelFile(excelBuffer, 'categories')
    })
  }

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        const EXCEL_EXTENSION = '.xlsx'
        const data = new Blob([buffer], { type: EXCEL_TYPE })
        module.default.saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`)
      }
    })
  }

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        disabled={!isSingleSelected}
        tooltip="Edit Category"
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        disabled={!isAnySelected}
        tooltip="Delete Categories"
        tooltipOptions={{ position: 'left' }}
      />
    </div>
  )

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        type="button"
        icon={<FileText size={16} strokeWidth={2} />}
        onClick={exportCSV}
        severity="secondary"
        tooltip="Export as CSV"
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        type="button"
        icon={<FileSpreadsheet size={16} strokeWidth={2} />}
        onClick={exportExcel}
        severity="success"
        tooltip="Export as Excel"
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        type="button"
        icon={<FileSignature size={16} strokeWidth={2} />}
        onClick={exportPdf}
        severity="danger"
        tooltip="Export as PDF"
        tooltipOptions={{ position: 'left' }}
      />
    </div>
  )

  return (
    <div className="">
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".export-buttons>button, .functionality-buttons>button" position="left" />

      <DataTable
        ref={dt}
        id="categories-table"
        value={categories}
        selection={selectedCategories}
        onSelectionChange={(e) => setSelectedCategories(e.value as Category[])}
        dataKey="refCategoryId"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        />
        <Column field="categoryCode" header="Code" sortable />
        <Column field="categoryName" header="Name" sortable />
        <Column field="createdBy" header="Created By" />
        <Column field="createdAt" header="Created At" />
        <Column
          field="isActive"
          header="Status"
          body={(rowData) => (rowData.isActive ? 'Active' : 'Inactive')}
        />
      </DataTable>
    </div>
  )
}

export default SettingsCategories
