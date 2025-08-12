import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { Attribute, dataType } from './SettingsAttribute.interface'
import { Sidebar } from 'primereact/sidebar'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputSwitch } from 'primereact/inputswitch'
import { fetchAttribute, fetchDataType, saveAttributeAPI } from './SettingsAttribute.function'
import { FileUpload } from 'primereact/fileupload'

const SettingsAttribute: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>([])
  const [visibleRight, setVisibleRight] = useState(false)
  const [editAttribute, setEditAttribute] = useState<Attribute | null>(null)

  const [nameInput, setNameInput] = useState('')
  const [dataTypeInput, setDataTypeInput] = useState<number | null>(null)

  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<Attribute[]>>(null)

  const isSingleSelected = selectedAttributes.length === 1
  const isAnySelected = selectedAttributes.length > 0
  const editMode = Array.isArray(selectedAttributes) && selectedAttributes.length === 1

  const [selectedDataType, setSelectedDataType] = useState<dataType | null>(null)

  const [previewVisible, setPreviewVisible] = useState(false)
  const [toggleValue, setToggleValue] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [dataTypeOptions, setDataTypeOptions] = useState<dataType[]>([])

  useEffect(() => {
    const loadDataTypes = async () => {
      try {
        const data = await fetchDataType()
        setDataTypeOptions(data)
      } catch (error: any) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load data types',
          life: 3000
        })
      }
    }

    loadDataTypes()
  }, [])

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

  // Initial load
  useEffect(() => {
    loadAttributes()
  }, [])

  // Render input based on selected data type
  const renderPreviewInput = () => {
    console.log('selectedDataType?.dataType', selectedDataType?.AttributeGroupName)
    switch (selectedDataType?.AttributeGroupName) {
      case 'NUMBER':
        return (
          <InputText
            type="number"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            className="w-full"
            placeholder="Enter number"
          />
        )
      case 'TEXT':
        return (
          <InputText
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full"
            placeholder="Enter text"
          />
        )
      case 'TEXT AREA':
        return (
          <InputTextarea
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            rows={3}
            className="w-full"
            placeholder="Enter text"
          />
        )
      case 'TOGGLE':
        return <InputSwitch checked={toggleValue} onChange={(e) => setToggleValue(e.value)} />
      case 'IMAGE':
        return (
          <FileUpload
            name="image"
            accept="image/*"
            maxFileSize={1000000} // 1MB limit, adjust as needed
            chooseLabel="Choose Image"
            customUpload
            uploadHandler={(event) => {
              console.log('Uploading files:', event.files)
            }}
            className="w-full"
          />
        )
      default:
        return null
    }
  }

  // Toolbar Buttons Handlers
  const onAddClick = () => {
    setEditAttribute(null)
    setNameInput('')
    setDataTypeInput(null)
    setVisibleRight(true)
  }

  const onEditClick = () => {
    if (isSingleSelected) {
      const attr = selectedAttributes[0]
      console.log('selectedAttributes', selectedAttributes)
      setEditAttribute(attr)
      setNameInput(attr.AttributeValue)
      setDataTypeInput(attr.AttributeGroupId)
      setVisibleRight(true)
    }
  }

  const onDeleteClick = () => {
    if (isAnySelected) {
      const idsToDelete = selectedAttributes.map((a) => a.AttributeId)
      setAttributes((prev) => prev.filter((a) => !idsToDelete.includes(a.AttributeId)))
      setSelectedAttributes([])
      toast.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Selected attribute(s) deleted',
        life: 3000
      })
    }
  }

  // Save attribute (add or update)
  const saveAttribute = async () => {
    if (!nameInput.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Name is required',
        life: 3000
      })
      return
    }
    if (!dataTypeInput) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Data Type is required',
        life: 3000
      })
      return
    }

    try {
      const payload = {
        attributeGroupId: dataTypeInput,
        attributeValue: nameInput,
        attributeKey: '-'
      }
      const savedAttribute = await saveAttributeAPI(payload)

      if (editMode && editAttribute) {
        setAttributes((prev) =>
          prev.map((a) =>
            a.AttributeId === editAttribute.AttributeId
              ? { ...a, name: savedAttribute.name, dataType: savedAttribute.dataType }
              : a
          )
        )
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Attribute updated successfully',
          life: 3000
        })
      } else {
        // Assuming savedAttribute contains the saved record with id
        setAttributes((prev) => [...prev, savedAttribute])
        await loadAttributes()
        toast.current?.show({
          severity: 'success',
          summary: 'Added',
          detail: 'Attribute added successfully',
          life: 3000
        })
      }

      setVisibleRight(false)
      setSelectedAttributes([])
      setEditAttribute(null)
      setNameInput('')
      setDataTypeInput(null)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to save attribute',
        life: 3000
      })
    }
  }

  useEffect(() => {
    if (nameInput && selectedDataType) {
      setPreviewVisible(true)
    } else {
      setPreviewVisible(false)
    }
  }, [nameInput, selectedDataType])

  return (
    <div>
      <div className="mt-0">
        <h3 className="mt-0 font-semibold">Products</h3>
      </div>
      <Toast ref={toast} />
      <Toolbar
        className="mb-2"
        left={() => (
          <div className="flex gap-2">
            <Button
              icon={<Plus size={16} strokeWidth={2} />}
              severity="success"
              tooltip="Add Attribute"
              disabled={isAnySelected}
              tooltipOptions={{ position: 'left' }}
              onClick={onAddClick}
            />
            <Button
              icon={<Pencil size={16} strokeWidth={2} />}
              severity="info"
              tooltip="Edit Attribute"
              tooltipOptions={{ position: 'left' }}
              disabled={!isSingleSelected}
              onClick={onEditClick}
            />
            <Button
              icon={<Trash2 size={16} strokeWidth={2} />}
              severity="danger"
              tooltip="Delete Attribute"
              tooltipOptions={{ position: 'left' }}
              disabled={!isAnySelected}
              onClick={onDeleteClick}
            />
          </div>
        )}
        right={() => <div className="flex gap-2">{/* Add export buttons here if needed */}</div>}
      />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        ref={dt}
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
        <Column field="AttributeValue" header="Name" sortable />
        <Column field="attributeGroupName" header="Data Type" sortable />
      </DataTable>
      <Sidebar
        visible={visibleRight}
        position="right"
        header={editMode ? 'Edit Attribute' : 'Add Attribute'}
        onHide={() => {
          setVisibleRight(false)
          setSelectedAttributes([])
          setEditAttribute(null)
          setNameInput('')
          setDataTypeInput(null)
        }}
        style={{ width: '50vw' }}
      >
        <div className="p-4 gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full"
                />
                <label htmlFor="name"> Name</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <Dropdown
                  id="dataType"
                  options={dataTypeOptions}
                  optionLabel="AttributeGroupName"
                  optionValue="AttributeGroupId"
                  value={dataTypeInput}
                  onChange={(e) => {
                    setDataTypeInput(e.value)
                    const selected =
                      dataTypeOptions.find((dt) => dt.AttributeGroupId === e.value) || null
                    setSelectedDataType(selected)
                  }}
                  className="w-full"
                  placeholder="Select Data Type"
                />

                <label htmlFor="dataType"> Data Type</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => {
                setPreviewVisible(false)
                setVisibleRight(false)
              }}
            />
            <Button
              label={editMode ? 'Edit ' : 'Add '}
              className="bg-[#8e5ea8] border-none gap-2"
              onClick={() => saveAttribute()}
            />
          </div>

          {previewVisible && (
            <div className="mt-6 p-4" style={{ borderRadius: '5px', border: '1px solid #ccc' }}>
              <div className="mb-3">
                <strong>Name:</strong> {nameInput}
              </div>
              <div className="mb-2">
                <strong>Input Preview:</strong>
                <div className="mt-1">{renderPreviewInput()}</div>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  )
}

export default SettingsAttribute
