import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputSwitch } from 'primereact/inputswitch'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { fetchModule, Module as ModuleType, saveUserRoles, SubModule } from './SettingsAddEditUserRoles.function'
import { Dropdown } from 'primereact/dropdown'
import { UserRoleTypes } from '../SettingsUserRoles.interface'
import { fetchRoleType } from '../SettingsUserRoles.function'
import { RolePermissionPayload } from './SettingsAddEditUserRoles.interface'

const SettingsAddEditUserRoles: React.FC = () => {
  const [modules, setModules] = useState<ModuleType[]>([])
  const [expandedRows, setExpandedRows] = useState<any>(null)
  const [roleTypeOptions, setRoleTypeOptions] = useState<UserRoleTypes[]>([])
  const [selectedRole, setSelectedRole] = useState<number | null>(null)

  useEffect(() => {
    const loadRoles = async () => {
      const data = await fetchRoleType()
      setRoleTypeOptions(data)
    }
    loadRoles()
  }, [])

  useEffect(() => {
    const loadModules = async () => {
      const data = await fetchModule()
      setModules(data)
    }
    loadModules()
  }, [])

  // Centralized disabled logic
  const isDisabled = (
    row: ModuleType | SubModule,
    field: keyof ModuleType | keyof SubModule,
    parentModule?: ModuleType
  ) => {
    // Module
    if (!parentModule) {
      if (field !== 'visibility' && !row.visibility) return true
    }
    // Submodule
    else {
      if (!parentModule.visibility) return true
      //   Remove this line to allow toggling submodule visibility even if it is currently false:
      if (field !== 'visibility' && !row.visibility) return true
    }
    return false
  }

  // Toggle handler
  const onToggle = (
    row: ModuleType | SubModule,
    field: keyof ModuleType | keyof SubModule,
    parentIndex?: number,
    rowIndex?: number
  ) => {
    setModules((prevModules) =>
      prevModules.map((mod, modIdx) => {
        // Submodule
        if (parentIndex !== undefined && rowIndex !== undefined && modIdx === parentIndex) {
          const updatedSub = mod.submodule.map((sub, subIdx) => {
            if (subIdx === rowIndex) {
              // Prevent last visible submodule from being unchecked
              if (field === 'visibility' && sub.visibility) {
                const visibleCount = mod.submodule.filter((s) => s.visibility).length
                if (visibleCount === 1) {
                  return sub
                }
              }
              return { ...sub, [field]: !sub[field] }
            }
            return sub
          })
          return { ...mod, submodule: updatedSub }
        }

        // Module
        if (parentIndex === undefined && mod.moduleId === (row as ModuleType).moduleId) {
          return { ...mod, [field]: !mod[field] }
        }

        return mod
      })
    )
  }

  // Module toggle body
  const moduleToggleBody = (field: keyof ModuleType) => (rowData: ModuleType) => (
    <InputSwitch
      checked={rowData[field]}
      onChange={() => onToggle(rowData, field)}
      disabled={isDisabled(rowData, field)}
    />
  )

  // Module action checkbox body
  const moduleCheckboxBody = (field: keyof ModuleType) => (rowData: ModuleType) => (
    <Checkbox
      checked={rowData[field]}
      onChange={() => onToggle(rowData, field)}
      disabled={isDisabled(rowData, field)}
    />
  )

  // Submodule toggle body
  const subToggleBody = (field: keyof SubModule, parentIndex: number) => {
    return (rowData: SubModule, rowProps: any) => {
      const parentModule = modules[parentIndex]
      console.log('parentModule', parentModule)
      return (
        <InputSwitch
          checked={rowData[field]}
          onChange={() => onToggle(rowData, field, parentIndex, rowProps.rowIndex)} // use submodule rowIndex here
          disabled={isDisabled(rowData, field, parentModule)}
        />
      )
    }
  }

  // Submodule checkbox body
  const subCheckboxBody = (field: keyof SubModule, parentIndex: number) => {
    return (rowData: SubModule, rowProps: any) => {
      const parentModule = modules[parentIndex]
      return (
        <Checkbox
          checked={rowData[field]}
          onChange={() => onToggle(rowData, field, parentIndex, rowProps.rowIndex)} // use submodule rowIndex
          disabled={isDisabled(rowData, field, parentModule)}
        />
      )
    }
  }

  // Row expansion template
  const rowExpansionTemplate = (mod: ModuleType) => {
    const parentIndex = modules.findIndex((m) => m.moduleId === mod.moduleId)
    console.log('parentIndex', parentIndex)

    return (
      <div
        className="ml-6"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,1)',
          borderRadius: '8px'
        }}
      >
        <DataTable value={mod.submodule} dataKey="subModuleId">
          <Column field="subModuleName" header="Submodule Name" />
          <Column header="Visibility" body={subToggleBody('visibility', parentIndex)} />
          <Column header="Add" body={subCheckboxBody('add', parentIndex)} />
          <Column header="Edit" body={subCheckboxBody('edit', parentIndex)} />
          <Column header="View" body={subCheckboxBody('view', parentIndex)} />
          <Column header="Delete" body={subCheckboxBody('delete', parentIndex)} />
        </DataTable>
      </div>
    )
  }

const savePermissions = async () => {
  const payload: RolePermissionPayload = {
    roleId: selectedRole,
    modules: modules
  .filter(mod =>
    mod.visibility === true ||
    mod.add === true ||
    mod.edit === true ||
    mod.view === true ||
    mod.delete === true ||
    (mod.submodule?.some(sub =>
      sub.visibility === true ||
      sub.add === true ||
      sub.edit === true ||
      sub.view === true ||
      sub.delete === true
    ))
  )
  .map(mod => ({
    moduleId: mod.moduleId,
    visibility: !!mod.visibility,
    add: !!mod.add,
    edit: !!mod.edit,
    view: !!mod.view,
    delete: !!mod.delete,
    submodules: mod.submodule
      ?.filter(sub =>
        sub.visibility === true ||
        sub.add === true ||
        sub.edit === true ||
        sub.view === true ||
        sub.delete === true
      )
      .map(sub => ({
        subModuleId: sub.submoduleId,
        visibility: !!sub.visibility,
        add: !!sub.add,
        edit: !!sub.edit,
        view: !!sub.view,
        delete: !!sub.delete
      })) || []
  }))

  };

  try {
    const success = await saveUserRoles(payload);
    if (success) {
      console.log('User roles saved successfully');
    }
  } catch (err: any) {
    console.error(err.message);
  }
};


  return (
    <div>
      <div className="flex mb-3">
        <div className="flex-1">
          <Dropdown
            id="roleDropdown"
            className="w-full"
            value={selectedRole}
            options={roleTypeOptions}
            onChange={(e) => setSelectedRole(e.value)}
            optionLabel="rolename"
            optionValue="id"
            placeholder="Select Role"
          />
        </div>
        <div className="flex-1"></div>
      </div>

      <DataTable
        value={modules}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="moduleId"
      >
        <Column expander style={{ width: '3em' }} />
        <Column field="moduleName" header="Module Name" />
        <Column header="Visibility" body={moduleToggleBody('visibility')} />
        <Column header="Add" body={moduleCheckboxBody('add')} />
        <Column header="Edit" body={moduleCheckboxBody('edit')} />
        <Column header="View" body={moduleCheckboxBody('view')} />
        <Column header="Delete" body={moduleCheckboxBody('delete')} />
      </DataTable>

      <Button label="Save" className="mt-3 flex justify-content-end" onClick={savePermissions} />
    </div>
  )
}

export default SettingsAddEditUserRoles
