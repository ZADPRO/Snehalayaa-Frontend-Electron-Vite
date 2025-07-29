import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'

import React, { useRef, useState } from 'react'

import { Plus, Pencil, Trash2, FileText, FileSpreadsheet, FileSignature } from 'lucide-react'
import { Tooltip } from 'primereact/tooltip'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Sidebar } from 'primereact/sidebar'
import AddNewPurchaseOrder from './AddNewPurchaseOrder/AddNewPurchaseOrder'

interface Category {}

const PurchaseOrderCreation: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<Category[]>([])

  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false
  })

  const editMode = Array.isArray(selectedPurchaseOrder) && selectedPurchaseOrder.length === 1
  const selectedCategory = editMode ? selectedPurchaseOrder[0] : null
  console.log('selectedCategory', selectedCategory)

  const isSingleSelected = selectedPurchaseOrder.length === 1
  const isAnySelected = selectedPurchaseOrder.length > 0

  const handleExportCSV = () => {
    setExportLoading((prev) => ({ ...prev, csv: true }))
    setTimeout(() => {
      // exportCSV(dt)
      setExportLoading((prev) => ({ ...prev, csv: false }))
    }, 300)
  }

  const handleExportExcel = () => {
    setExportLoading((prev) => ({ ...prev, excel: true }))
    setTimeout(() => {
      // exportExcel(categories)
      setExportLoading((prev) => ({ ...prev, excel: false }))
    }, 300)
  }

  const handleExportPDF = () => {
    setExportLoading((prev) => ({ ...prev, pdf: true }))
    setTimeout(() => {
      // exportPdf(categories)
      setExportLoading((prev) => ({ ...prev, pdf: false }))
    }, 300)
  }

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        tooltipOptions={{ position: 'left' }}
        disabled={isAnySelected}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Category"
        tooltipOptions={{ position: 'left' }}
        disabled={!isSingleSelected}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Categories"
        tooltipOptions={{ position: 'left' }}
        disabled={!isAnySelected}
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
        // ref={dt}
        id="categories-table"
        // value={categories}
        selection={selectedPurchaseOrder}
        // onSelectionChange={(e) => setSelectedPurchaseOrder(e.value as Category[])}
        // dataKey="refCategoryId"
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

      <Sidebar
        visible={visibleRight}
        position="right"
        header={editMode ? 'Edit Products' : 'Add New Products'}
        onHide={() => {
          setVisibleRight(false)
          setSelectedPurchaseOrder([])
        }}
        style={{ width: '60vw' }}
      >
        <AddNewPurchaseOrder />
      </Sidebar>
    </div>
  )
}

export default PurchaseOrderCreation
