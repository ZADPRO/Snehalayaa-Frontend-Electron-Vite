import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { Category } from './SettingsCategories.interface'
import { fetchCategories } from './SettingsCategories.function'
import { Pencil, Plus, Trash2, Upload } from 'lucide-react'

const SettingsCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const toast = useRef<Toast>(null)

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

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button label="Add" icon={<Plus size={16} strokeWidth={2} />} />
      <Button
        label="Edit"
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        disabled={!isSingleSelected}
      />
      <Button
        label="Delete"
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        disabled={!isAnySelected}
      />
    </div>
  )

  const rightToolbarTemplate = () => (
    <Button
      label="Export CSV"
      icon={<Upload size={16} strokeWidth={2} />}
      severity="success"
      onClick={() => {
        const table: any = document.getElementById('categories-table')
        if (table?.exportCSV) {
          table.exportCSV()
        }
      }}
    />
  )

  return (
    <div className="">
      <Toast ref={toast} />
      <Toolbar className="mb-1" left={leftToolbarTemplate} right={rightToolbarTemplate} />

      <DataTable
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
