import { FileSignature, FileSpreadsheet, FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import SettingsAddEditInitialCategories from './SettingsAddEditInitialCategories/SettingsAddEditInitialCategories'
import { fetchInitialCategories } from './SettingsInitialCategories.function'
import { InitialCategory } from './SettingsAddEditInitialCategories/SettingsAddEditInitialCategories.interface'

const SettingsInitialCategories: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [visibleRight, setVisibleRight] = useState<boolean>(false)
  const [initialCategories, setInitialCategories] = useState<InitialCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<InitialCategory[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const editMode = Array.isArray(selectedCategories) && selectedCategories.length === 1
  const selectedCategory = editMode ? selectedCategories[0] : null

  const dt = useRef<DataTable<InitialCategory[]>>(null)

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        tooltipOptions={{ position: 'left' }}
        // disabled={!!selectedCategory}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Category"
        tooltipOptions={{ position: 'left' }}
        // disabled={!isSingleSelected}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Categories"
        tooltipOptions={{ position: 'left' }}
        // disabled={!isAnySelected}
        // onClick={handleDelete}
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
        // onClick={handleExportCSV}
        // loading={exportLoading.csv}
        // disabled={exportLoading.csv}
      />
      <Button
        icon={<FileSpreadsheet size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Export as Excel"
        tooltipOptions={{ position: 'left' }}
        // onClick={handleExportExcel}
        // loading={exportLoading.excel}
        // disabled={exportLoading.excel}
      />
      <Button
        icon={<FileSignature size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Export as PDF"
        tooltipOptions={{ position: 'left' }}
        // onClick={handleExportPDF}
        // loading={exportLoading.pdf}
        // disabled={exportLoading.pdf}
      />
    </div>
  )

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchInitialCategories()
      console.log('\n\ndata', data)
      setInitialCategories(data)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load initialCategories',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        ref={dt}
        id="initialCategories-table"
        value={initialCategories}
        selection={selectedCategories}
        onSelectionChange={(e) => setSelectedCategories(e.value as any[])}
        dataKey="initialCategoryId"
        selectionMode="multiple"
        paginator
        showGridlines
        loading={loading}
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

        <Column field="initialCategoryCode" header="Code" sortable />
        <Column field="initialCategoryName" header="Name" sortable />
        <Column field="createdBy" header="Created By" />
        <Column field="createdAt" header="Created At" />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        header={editMode ? 'Edit Category' : 'Add Initial Category'}
        onHide={() => {
          setVisibleRight(false)
          setSelectedCategories([])
        }}
        style={{ width: '50vw' }}
      >
        <SettingsAddEditInitialCategories
          selectedInitialCategory={selectedCategory}
          onClose={() => {
            setVisibleRight(false)
            setSelectedCategories([])
          }}
          reloadData={load}
        />
      </Sidebar>
    </div>
  )
}

export default SettingsInitialCategories
