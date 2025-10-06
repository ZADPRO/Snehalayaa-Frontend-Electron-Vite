import React, { JSX, useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { inventory } from './InventoryTracker.interface'
import { exportCSV, exportPdf, exportExcel } from './InventoryTracker.function'
import { Button } from 'primereact/button'
import { FileSignature, FileSpreadsheet, FileText, Upload } from 'lucide-react'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import { Sidebar } from 'primereact/sidebar'
import { Column } from 'primereact/column'
import { Timeline } from 'primereact/timeline'

interface TimelineEvent {
  status: string
  date: string
  color: string
  icon: JSX.Element
}

const InventoryTracker: React.FC = () => {
  const [visibleSidebar, setVisibleSidebar] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<inventory | null>(null)
  const [inventory, setInventory] = useState<inventory[]>([])
  const [selectedinventory, _setSelectedInventory] = useState<inventory[]>([])
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<inventory[]>>(null)
  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false
  })

  // ✅ Load inventory from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('inventoryData')
      if (storedData) {
        setInventory(JSON.parse(storedData))
      } else {
        setInventory([])
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load inventory data',
        life: 3000
      })
    }
  }, [])

  // ✅ Timeline content
  const timelineEvents: TimelineEvent[] = selectedProduct
    ? [
        {
          status: 'Product uploaded via bulk update',
          date: new Date().toLocaleDateString(), // only today's date
          color: '#2196F3',
          icon: <Upload size={18} className="text-white" />
        }
      ]
    : []

  // ✅ Export handlers
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

      {/* ✅ Inventory Table */}
      <DataTable
        value={inventory}
        selection={selectedinventory}
        dataKey="id"
        selectionMode="multiple"
        paginator
        rows={10}
        showGridlines
        stripedRows
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

        <Column
          header="Product Name"
          field="ProductName"
          body={(rowData) => (
            <span
              className="text-primary cursor-pointer underline"
              onClick={() => {
                setSelectedProduct(rowData)
                setVisibleSidebar(true)
              }}
            >
              {rowData.ProductName}
            </span>
          )}
          style={{ minWidth: '200px' }}
        />

        <Column field="SKU" header="SKU Code" sortable style={{ minWidth: '200px' }} />

        <Column
          field="hsnCode"
          header="HSN Code"
          body={(rowData) =>
            rowData.hsnCode && rowData.hsnCode.trim() !== '' ? rowData.hsnCode : '-'
          }
        />

        <Column field="SellingPrice" header="Selling Price" />
        <Column field="CostPrice" header="Cost Price" />

        <Column
          field="movement"
          header="Movement"
          body={(rowData) =>
            rowData.movement && rowData.movement.trim() !== '' ? rowData.movement : '-'
          }
        />

        <Column
          field="quantity"
          header="Quantity"
          body={(rowData) => (rowData.quantity && !isNaN(rowData.quantity) ? rowData.quantity : 1)}
        />
      </DataTable>

      {/* ✅ Sidebar with timeline */}
      <Sidebar
        visible={visibleSidebar}
        position="right"
        style={{ width: '50vw' }}
        onHide={() => setVisibleSidebar(false)}
        header={selectedProduct?.ProductName || 'Product Details'}
      >
        {selectedProduct && (
          <div className="p-2">
            <h5 className="mb-3">Inventory Timeline</h5>
            <Timeline
              value={timelineEvents}
              align="left"
              opposite={(item) => <span className="font-semibold">{item.status}</span>}
              content={(item) => (
                <div className="flex flex-column text-sm text-gray-700">
                  <span>{item.date}</span>
                  <span className="text-gray-500">By: Super Admin</span>
                </div>
              )}
              marker={(item) => (
                <span
                  className="border-circle flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: item.color,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                  }}
                >
                  {item.icon}
                </span>
              )}
            />
          </div>
        )}
      </Sidebar>
    </div>
  )
}

export default InventoryTracker
