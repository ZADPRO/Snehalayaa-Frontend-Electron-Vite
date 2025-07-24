import React, { useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { inventory } from './InventoryTracker.interface'
import { exportCSV, exportPdf, exportExcel } from './InventoryTracker.function'
import { Button } from 'primereact/button'
import { FileSignature, FileSpreadsheet, FileText } from 'lucide-react'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import { Column } from 'primereact/column'

const InventoryTracker: React.FC = () => {
  const [inventory, _setInventory] = useState<inventory[]>([])
  const [selectedinventory, _setSelectedInventory] = useState<inventory[]>([])

  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<inventory[]>>(null)
  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false
  })

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
      exportExcel(inventory)
      setExportLoading((prev) => ({ ...prev, excel: false }))
    }, 300)
  }

  const handleExportPDF = () => {
    setExportLoading((prev) => ({ ...prev, pdf: true }))
    setTimeout(() => {
      exportPdf(inventory)
      setExportLoading((prev) => ({ ...prev, pdf: false }))
    }, 300)
  }

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
      <Toolbar className="mb-2" right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        value={inventory}
        selection={selectedinventory}
        // onSelectionChange={(e) => setSelectedSubCategories(e.value as SubCategory[])}
        dataKey="refSubCategoryId"
        selectionMode="multiple"
        paginator
        rows={10}
        stripedRows
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} />
        <Column header="SNo" sortable body={(_, opts) => opts.rowIndex + 1} />
        <Column field="ProductName" header="Product Name" sortable />
        <Column field="skuCode" header="SKU Code" sortable />
        <Column field="hsnCode" header="HSN Code" />
        <Column field="price" header="Price" />
        <Column field="movement" header="Movement" />
        <Column field="quantity" header="Quantity" />
        <Column field="branchName" header="Branch Name" />
        <Column field="createdBy" header="Created By" />
        <Column field="createdAt" header="Created At" sortable />
        {/* <Column
          field="isActive"
          header="Status"
          body={(rowData) => (rowData.isActive ? 'Active' : 'Inactive')}
        /> */}
      </DataTable>
    </div>
  )
}

export default InventoryTracker
