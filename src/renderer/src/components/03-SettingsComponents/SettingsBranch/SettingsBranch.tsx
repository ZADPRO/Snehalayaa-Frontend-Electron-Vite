import React, { useEffect, useRef, useState } from 'react'
import { Branch } from './SettingsBranch.interface'
import {
  deleteBranch,
  exportCSV,
  exportExcel,
  exportPdf,
  fetchBranch
} from './SettingsBranch.function'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { FileSignature, FileSpreadsheet, FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { Sidebar } from 'primereact/sidebar'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import SettingsAddEditBranch from './SettingsAddEditBranch/SettingsAddEditBranch'

const SettingsBranch: React.FC = () => {
  const [branch, setBranch] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch[]>([])
  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<Branch[]>>(null)
  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false
  })
  const load = async () => {
    try {
      const data = await fetchBranch()
      setBranch(data)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load branch',
        life: 3000
      })
    }
  }
  useEffect(() => {
    load()
  }, [])

  const editMode = Array.isArray(selectedBranch) && selectedBranch.length === 1
  const selectedBranches = editMode ? selectedBranch[0] : null

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
      exportExcel(branch)
      setExportLoading((prev) => ({ ...prev, excel: false }))
    }, 300)
  }

  const handleExportPDF = () => {
    setExportLoading((prev) => ({ ...prev, pdf: true }))
    setTimeout(() => {
      exportPdf(branch)
      setExportLoading((prev) => ({ ...prev, pdf: false }))
    }, 300)
  }

  const handleDelete = async () => {
    if (!setSelectedBranch.length) return

    const categoryToDelete = selectedBranch[0]
    console.log('categoryToDelete', selectedBranch)
    try {
      const res = await deleteBranch(categoryToDelete.refBranchId)
      if (res.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: res.message
        })
        setSelectedBranch([])
        load()
      } else if (res.confirmationNeeded) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Needs Confirmation',
          detail: res.message
        })
        // You can implement subcategory confirmation UI here if needed
      }
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to delete'
      })
    }
  }

  const isSingleSelected = selectedBranch.length === 1
  const isAnySelected = selectedBranch.length > 0

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Branch"
          disabled={!!isAnySelected}
        tooltipOptions={{ position: 'left' }}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Branch"
        tooltipOptions={{ position: 'left' }}
        disabled={!isSingleSelected}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Branch"
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
    <div className="">
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        ref={dt}
        id="Branch-table"
        value={branch}
        selection={selectedBranch}
        onSelectionChange={(e) => setSelectedBranch(e.value as Branch[])}
        dataKey="refBranchId"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

        <Column field="refBranchCode" header="Code" sortable />
        <Column field="refBranchName" header="Branch Name" sortable />
        <Column field="refLocation" header="Location" sortable />
        <Column field="refMobile" header="Contact Number" />
        <Column field="refEmail" header="Email" />
        <Column
          field="isActive"
          header="Status"
          body={(rowData) => (rowData.isActive ? 'Active' : 'Inactive')}
        />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        // header={editMode ? 'Edit Branch' : 'Add Branch'}
        onHide={() => {
          setVisibleRight(false)
          setSelectedBranch([])
        }}
        style={{ width: '50vw' }}
      >
        <SettingsAddEditBranch
          selectedBranches={selectedBranches}
          onClose={() => setVisibleRight(false)}
          reloadData={load}
        />
      </Sidebar>
    </div>
  )
}

export default SettingsBranch
