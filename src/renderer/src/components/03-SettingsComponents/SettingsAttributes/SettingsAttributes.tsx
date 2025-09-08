import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { Attribute } from './SettingsAttributes.interface'
import { fetchAttribute } from './SettingsAttributes.function'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { EyeOff, Pencil, Plus } from 'lucide-react'
import { Sidebar } from 'primereact/sidebar'
import SettingsAddEditAttributes from './SettingsAddEditAttributes/SettingsAddEditAttributes'
import { Dialog } from 'primereact/dialog'

const SettingsAttributes: React.FC = () => {
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<Attribute[]>>(null)

  const [attributeSidebarVisible, setAttributeSidebarVisible] = useState<boolean>(false)
  const [attributePreviewForm, setAttributePreviewForm] = useState<boolean>(false)

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>([])

  const editMode = Array.isArray(selectedAttributes) && selectedAttributes.length === 1
  const selectedAttribute = editMode ? selectedAttributes[0] : null

  const loadAttributes = async () => {
    try {
      const data = await fetchAttribute()
      setAttributes(data)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to load attributes',
        life: 3000
      })
    }
  }

  const onAddClick = () => {
    setAttributeSidebarVisible(true)
  }

  const onPreviewClick = () => {
    setAttributePreviewForm(true)
  }

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Attribute"
        // disabled={isAnySelected}
        tooltipOptions={{ position: 'left' }}
        onClick={onAddClick}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Attribute"
        tooltipOptions={{ position: 'left' }}
        // disabled={!isSingleSelected}
        // onClick={onEditClick}
      />
      <Button
        icon={<EyeOff size={16} strokeWidth={2} />}
        // severity="danger"
        tooltip="Hide Attribute"
        tooltipOptions={{ position: 'left' }}
        // disabled={!isAnySelected}
        // onClick={onDeleteClick}
      />
      <Button
        // severity="danger"
        tooltip="Preview Form"
        label="Preview Form"
        tooltipOptions={{ position: 'left' }}
        // disabled={!isAnySelected}
        onClick={onPreviewClick}
      />
    </div>
  )

  // Initial load
  useEffect(() => {
    loadAttributes()
  }, [])

  return (
    <div>
      <Toast ref={toast} />

      <Toolbar left={leftToolbarTemplate} />

      <DataTable
        ref={dt}
        className="mt-2"
        id="attribute"
        value={attributes}
        selection={selectedAttributes}
        onSelectionChange={(e) => setSelectedAttributes(e.value as Attribute[])}
        dataKey="AttributeId"
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
        <Column field="attributeGroupName" header="Group" sortable />
        <Column field="AttributeValue" header="Name" sortable />
        <Column field="attributeGroupName" header="Data Type" sortable />

        <Column
          field="isDelete"
          header="Type"
          body={(rowData) =>
            rowData.isDelete ? (
              <span className="text-red-500">Static</span>
            ) : (
              <span className="text-green-500">Dynamic</span>
            )
          }
        />
        <Column
          field="isDelete"
          header="Visibility"
          body={(rowData) =>
            rowData.isDelete ? (
              <span className="text-red-500">Hidden</span>
            ) : (
              <span className="text-green-500">Visible</span>
            )
          }
        />
      </DataTable>

      <Sidebar
        position="right"
        style={{ width: '50vw' }}
        header={editMode ? 'Edit Attributes' : 'Add Attributes'}
        visible={attributeSidebarVisible}
        onHide={() => setAttributeSidebarVisible(false)}
      >
        <SettingsAddEditAttributes
          selectedAttribute={selectedAttribute}
          onClose={() => {
            setAttributeSidebarVisible(false)
            setSelectedAttributes([])
          }}
          reloadData={loadAttributes}
        />
      </Sidebar>

      <Dialog
        header="Preview"
        visible={attributePreviewForm}
        style={{ width: '50vw' }}
        onHide={() => {
          if (!attributePreviewForm) return
          setAttributePreviewForm(false)
        }}
      ></Dialog>
    </div>
  )
}

export default SettingsAttributes
