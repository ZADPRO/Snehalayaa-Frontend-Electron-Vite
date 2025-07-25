import React, { useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { inventory } from './InventoryTracker.interface'
import { exportCSV, exportPdf, exportExcel } from './InventoryTracker.function'
import { Button } from 'primereact/button'
import {
  FileSignature,
  FileSpreadsheet,
  FileText,
  ShoppingCart,
  Truck,
  Book,
  Boxes
} from 'lucide-react'
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

  const timelineEvents: TimelineEvent[] = selectedProduct
    ? [
        {
          status: 'PO Initiated',
          date: new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString(),
          color: '#9C27B0',
          icon: <ShoppingCart size={18} className="text-white" />
        },
        {
          status: 'Product Received',
          date: new Date('2025-07-25T02:20:42.724Z').toLocaleString(),
          color: '#673AB7',
          icon: <Truck size={18} className="text-white" />
        },
        {
          status: 'Catalog Created',
          date: new Date(selectedProduct.createdAt).toLocaleString(),
          color: '#FF9800',
          icon: <Book size={18} className="text-white" />
        },
        {
          status: 'Moved to Inventory',
          date: new Date(selectedProduct.createdAt).toLocaleString(),
          color: '#607D8B',
          icon: <Boxes size={18} className="text-white" />
        }
      ]
    : []

  const [inventory, _setInventory] = useState<inventory[]>([
    {
      id: 6,
      ProductName: 'New saree 01',
      skuCode: 'SS072500001',
      hsnCode: '45678i',
      price: 7800,
      quantity: 2,
      movement: '8580.00',
      branchName: 'GST_2',
      createdBy: 'Admin',
      createdAt: '2025-07-25 09:35:56'
    },
    {
      id: 7,
      ProductName: 'New saree 02',
      skuCode: 'SS072500002',
      hsnCode: '9i876545678',
      price: 7800,
      quantity: 2,
      movement: '8580.00',
      branchName: 'GST_0',
      createdBy: 'Admin',
      createdAt: '2025-07-25 09:42:23'
    }
  ])

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
        <Column field="skuCode" header="SKU Code" sortable style={{ minWidth: '200px' }} />
        <Column field="hsnCode" header="HSN Code" />
        <Column field="price" header="Price" />
        <Column field="movement" header="Movement" />
        <Column field="quantity" header="Quantity" />
        <Column field="branchName" header="Branch " style={{ minWidth: '100px' }} />
        <Column field="createdBy" header="Created By" style={{ minWidth: '200px' }} />
        <Column field="createdAt" header="Created At" sortable style={{ minWidth: '200px' }} />
      </DataTable>

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
                  <span className="text-gray-500">By: Admin</span>
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
