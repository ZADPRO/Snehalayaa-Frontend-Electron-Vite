import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'

import React, { useRef, useState, useEffect } from 'react'

import { FileText, FileSpreadsheet, FileSignature } from 'lucide-react'
import { Tooltip } from 'primereact/tooltip'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Sidebar } from 'primereact/sidebar'
import ViewPurchaseOrderProducts from './ViewPurchaseOrderProducts/ViewPurchaseOrderProducts'

import { fetchCategories } from './PurchaseOrderList.function'
import { PurchaseOrder } from './PurchaseOrderList.interface'

const PurchaseOrderList: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [selectedRowData, setSelectedRowData] = useState<PurchaseOrder | null>(null)

  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false
  })

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
      {/* <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        tooltipOptions={{ position: 'left' }}
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
      /> */}
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

  useEffect(() => {
    fetchCategories()
      .then((data) => setPurchaseOrders(data))
      .catch((err) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000
        })
      })
  }, [])

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        // ref={dt}
        id="categories-table"
        value={purchaseOrders}
        selection={selectedPurchaseOrder}
        onSelectionChange={(e) => {
          const newValue = e.value
          const currentValue = selectedPurchaseOrder

          if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
            setSelectedPurchaseOrder(newValue)
          }
        }}
        // dataKey="refCategoryId"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        {/* <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} /> */}
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
        <Column
          field="totalSummary.poNumber"
          header="PO Number"
          body={(rowData) => (
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setSelectedRowData(rowData)
                setVisibleRight(true)
              }}
            >
              {rowData.totalSummary.poNumber}
            </span>
          )}
        />
        <Column field="supplierDetails.supplierName" header="Supplier" sortable />
        <Column field="branchDetails.branchName" header="Branch" sortable />
        <Column
          field="totalSummary.status"
          header="Status"
          body={(rowData) => (rowData.totalSummary.status === 1 ? 'Open' : 'Closed')}
        />
        <Column field="totalSummary.createdBy" header="Created By" />
        <Column field="totalSummary.createdAt" header="Created At" />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        header={'View Products'}
        onHide={() => {
          setVisibleRight(false)
          setSelectedPurchaseOrder([])
        }}
        style={{ width: '60vw' }}
      >
        {/* <ViewPurchaseOrderProducts
          rowData={selectedRowData ?? { productDetails: [], totalSummary: {} }}
        /> */}
        {selectedRowData && <ViewPurchaseOrderProducts rowData={selectedRowData} />}
      </Sidebar>
    </div>
  )
}

export default PurchaseOrderList
