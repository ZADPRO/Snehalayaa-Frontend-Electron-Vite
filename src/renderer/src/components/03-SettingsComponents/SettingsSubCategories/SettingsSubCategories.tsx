/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Toast } from 'primereact/toast'

import {
  fetchSubCategories,
  deleteSubCategory,
  exportCSV,
  exportPdf,
  exportExcel
} from './SettingsSubCategories.function'
import { SubCategory } from './SettingsSubCategories.interface'
import { FileSignature, FileSpreadsheet, FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { Tooltip } from 'primereact/tooltip'
import { Sidebar } from 'primereact/sidebar'
import SettingsAddEditSubCategories from './SettingsAddEditSubCategories/SettingsAddEditSubCategories'

const SettingsSubCategories: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<SubCategory[]>([])
  const [editSubCategory, setEditSubCategory] = useState<SubCategory | null>(null)

  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<SubCategory[]>>(null)
  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false
  })

  const load = async () => {
    try {
      const data = await fetchSubCategories()
      setSubCategories(data)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load subcategories',
        life: 3000
      })
    }
  }

  const handleExportCSV = () => {
    setExportLoading((prev) => ({ ...prev, csv: true }))
    setTimeout(() => {
      exportCSV(dt)
      setExportLoading((prev) => ({ ...prev, csv: false }))
    }, 300)
  }

  const handleExportExcel = () => {
    setExportLoading((prev) => ({ ...prev, excel: true }))
    setTimeout(() => {
      exportExcel(subCategories)
      setExportLoading((prev) => ({ ...prev, excel: false }))
    }, 300)
  }

  const handleExportPDF = () => {
    setExportLoading((prev) => ({ ...prev, pdf: true }))
    setTimeout(() => {
      exportPdf(subCategories)
      setExportLoading((prev) => ({ ...prev, pdf: false }))
    }, 300)
  }

  const handleDelete = async () => {
    if (!selectedSubCategories.length) return

    const subCat = selectedSubCategories[0]

    try {
      const res = await deleteSubCategory(subCat.refSubCategoryId)
      if (res.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Deleted',
          detail: res.message
        })
        setSelectedSubCategories([])
        load()
      }
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Delete failed'
      })
    }
  }

  useEffect(() => {
    load()
  }, [])

  const isSingleSelected = selectedSubCategories.length === 1
  const isAnySelected = selectedSubCategories.length > 0

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        disabled={!isAnySelected}
        tooltipOptions={{ position: 'left' }}
        onClick={() => {
          setEditSubCategory(null)
          setVisibleRight(true)
        }}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Category"
        tooltipOptions={{ position: 'left' }}
        disabled={!isSingleSelected}
        onClick={() => {
          setEditSubCategory(selectedSubCategories[0])
          setVisibleRight(true)
        }}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Categories"
        tooltipOptions={{ position: 'left' }}
        disabled={!isAnySelected}
        onClick={handleDelete}
      />
    </div>
  )

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<FileText size={16} strokeWidth={2} />}
        severity="secondary"
        tooltip="Export as CSV"
        tooltipOptions={{ position: 'left' }}
        onClick={handleExportCSV}
        loading={exportLoading.csv}
        disabled={exportLoading.csv}
      />
      <Button
        icon={<FileSpreadsheet size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Export as Excel"
        tooltipOptions={{ position: 'left' }}
        onClick={handleExportExcel}
        loading={exportLoading.excel}
        disabled={exportLoading.excel}
      />
      <Button
        icon={<FileSignature size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Export as PDF"
        tooltipOptions={{ position: 'left' }}
        onClick={handleExportPDF}
        loading={exportLoading.pdf}
        disabled={exportLoading.pdf}
      />
    </div>
  )

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        value={subCategories}
        selection={selectedSubCategories}
        onSelectionChange={(e) => setSelectedSubCategories(e.value as SubCategory[])}
        dataKey="refSubCategoryId"
        selectionMode="multiple"
        paginator
        rows={10}
        stripedRows
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
        <Column field="subCategoryCode" header="Code" sortable />
        <Column field="subCategoryName" header="Name" sortable />
        <Column field="refCategoryId" header="Category ID" />
        <Column field="createdBy" header="Created By" />
        <Column field="createdAt" header="Created At" />
        <Column
          field="isActive"
          header="Status"
          body={(rowData) => (rowData.isActive ? 'Active' : 'Inactive')}
        />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        header={editSubCategory ? 'Edit Sub-category' : 'Add Sub-category'}
        onHide={() => {
          setVisibleRight(false)
          setSelectedSubCategories([])
          setEditSubCategory(null)
        }}
        style={{ width: '50vw' }}
      >
        <SettingsAddEditSubCategories
          selectedSubCategory={editSubCategory}
          onClose={() => {
            setVisibleRight(false)
            setEditSubCategory(null)
          }}
          reloadData={load}
        />
      </Sidebar>
    </div>
  )
}

export default SettingsSubCategories
