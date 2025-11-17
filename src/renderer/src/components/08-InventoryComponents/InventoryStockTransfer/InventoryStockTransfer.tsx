import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { MappedStockTransfer } from './InventoryStockTransfer.interface'
import { fetchCategories } from './InventoryStockTransfer.function'
import { Sidebar } from 'primereact/sidebar'
import { PurchaseOrder } from './InventoryAddEditStockTransfer/InventoryAddEditStockTransfer.interfece'

const InventoryStockTransfer: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [visibleRight, setVisibleRight] = useState<boolean>(false)
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<MappedStockTransfer[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<MappedStockTransfer[]>([])
  const [selectedRowData, setSelectedRowData] = useState<MappedStockTransfer | null>(null)

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        console.log('res', res)

        const formatted: MappedStockTransfer[] = (res.data || []).map((item) => ({
          stockTransferId: item.stockTransferId,

          totalSummary: {
            poNumber: item.poNumber,
            status: item.status,
            createdBy: item.createdBy,
            createdAt: item.createdAt
          },

          supplierDetails: {
            supplierName: item.fromBranchName
          },

          branchDetails: {
            branchName: item.toBranchName
          },

          items: item.items
        }))

        setPurchaseOrders(formatted)
      })
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
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
        <Column
          field="totalSummary.poNumber"
          header="Stock Transfer"
          body={(rowData) => (
            <span
              className="cursor-pointer font-bold underline"
              onClick={() => {
                setSelectedRowData(rowData)
                setVisibleRight(true)
              }}
            >
              {rowData.totalSummary.poNumber}
            </span>
          )}
        />
        <Column field="supplierDetails.supplierName" header="From Branch" sortable />
        <Column field="branchDetails.branchName" header="To Branch" sortable />
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
        header={
          <span style={{ textTransform: 'uppercase', fontWeight: '600', fontSize: '1.2rem' }}>
            View products
          </span>
        }
        onHide={() => {
          setVisibleRight(false)
          setSelectedPurchaseOrder([])
        }}
        style={{ width: '65vw' }}
      >
        {selectedRowData && (
          <DataTable
            value={selectedRowData.items}
            paginator
            rows={10}
            showGridlines
            stripedRows
            responsiveLayout="scroll"
          >
            <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
            <Column field="productName" header="Product Name" sortable />
            <Column field="sku" header="SKU" sortable />
            <Column
              field="isReceived"
              header="Received?"
              body={(row) => (row.isReceived ? 'Yes' : 'No')}
            />
            <Column field="acceptanceStatus" header="Status" />
          </DataTable>
        )}
      </Sidebar>
    </div>
  )
}

export default InventoryStockTransfer
