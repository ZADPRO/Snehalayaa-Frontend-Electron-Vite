import { FileSpreadsheet, Pencil, Plus, Search } from 'lucide-react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { UserRoles } from './SettingsUserRoles.interface'
import { exportExcel, fetchUserRole } from './SettingsUserRoles.function'
import { Sidebar } from 'primereact/sidebar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import SettingsAddEditUserRoles from './SettingsAddEditUserRoles/SettingsAddEditUserRoles'

const SettingsUserRoles: React.FC = () => {
  const [userRoles, setUserRoles] = useState<UserRoles[]>([])
  const [selectedUserRoles, setSelectedUserRoles] = useState<UserRoles[]>([])
  const [visibleRight, setVisibleRight] = useState(false)

  const [exportLoading, setExportLoading] = useState({
    excel: false
  })

  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<UserRoles[]>>(null)

  const load = async () => {
    try {
      const data = await fetchUserRole()
      setUserRoles(data)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load role',
        life: 3000
      })
    }
  }

  useEffect(() => {
    load()
  }, [])

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon={<Pencil size={16} />}
        className="p-button-rounded p-button-text p-button-warning"
        onClick={() => console.log('Edit', rowData)}
      />
    )
  }

  const handleExportExcel = () => {
    setExportLoading((prev) => ({ ...prev, excel: true }))
    setTimeout(() => {
      exportExcel(userRoles)
      setExportLoading((prev) => ({ ...prev, excel: false }))
    }, 300)
  }

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <div className="custom-icon-field">
        <Search className="lucide-search-icon" size={18} />
        <InputText placeholder="Search" className="search-input" />
      </div>
    </div>
  )

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
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
        icon={<Plus size={16} strokeWidth={2} />}
        tooltip="Add New Role"
        tooltipOptions={{ position: 'left' }}
        onClick={() => setVisibleRight(true)}
      />{' '}
    </div>
  )

  return (
    <div>
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />
      <Toast ref={toast} />

      <DataTable
        ref={dt}
        id="Suppliers-table"
        value={userRoles}
        selection={selectedUserRoles}
        onSelectionChange={(e) => setSelectedUserRoles(e.value as UserRoles[])}
        dataKey="supplierId"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

        <Column field="userName" header="User Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="role" header="Role" sortable />
        <Column field="createdAt" header="Created At" />
        <Column field="createdBy" header="Created By" />
        <Column header="Actions" body={actionBodyTemplate} />
      </DataTable>

      {/* Right Sidebar */}
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
        style={{ width: '50%' }}
      >
        <SettingsAddEditUserRoles/>
      </Sidebar>
    </div>
  )
}

export default SettingsUserRoles
