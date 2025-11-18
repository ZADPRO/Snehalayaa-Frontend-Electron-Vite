import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { MappedStockTransfer } from './InventoryStockTransfer.interface'
import { fetchCategories, receiveStockTransferProducts } from './InventoryStockTransfer.function'
import { Dialog } from 'primereact/dialog'
import { Eye } from 'lucide-react'
import { Button } from 'primereact/button'

const InventoryStockTransfer: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [visible, setVisible] = useState<boolean>(false)
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<MappedStockTransfer[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<MappedStockTransfer[]>([])
  const [selectedRowData, setSelectedRowData] = useState<MappedStockTransfer | null>(null)

  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  useEffect(() => {
    fetchCategories()
      .then((res) => {
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
      .catch((err) =>
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000
        })
      )
  }, [])

  // -- VIEW BUTTON TEMPLATE --
  const viewTemplate = (rowData: MappedStockTransfer) => {
    return (
      <button
        className="p-button p-button-text p-0"
        onClick={() => {
          setSelectedRowData(rowData)
          setSelectedProducts([])
          setVisible(true)
        }}
      >
        <Eye size={20} />
      </button>
    )
  }

  const handleAccept = async () => {
    if (!selectedRowData) return

    let payload: any

    if (selectedProducts.length > 0) {
      // SELECTED ROWS ONLY
      payload = {
        stockTransferId: selectedRowData.stockTransferId,
        allProducts: selectedProducts
      }
    } else {
      // ALL ROWS
      payload = {
        stockTransferId: selectedRowData.stockTransferId,
        allProducts: selectedRowData.items
      }
    }

    try {
      const res = await receiveStockTransferProducts(payload)
      console.log('res', res)

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Products received successfully!',
        life: 3000
      })

      setVisible(false) // close popup after success
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Failed to receive products',
        life: 3000
      })
    }
  }

  const acceptButtonLabel = selectedProducts.length > 0 ? 'Accept Selection' : 'Accept All'

  const dialogFooter = (
    <div className="flex justify-content-end">
      <button className="p-button p-button-secondary" onClick={() => setVisible(false)}>
        Close
      </button>
    </div>
  )

  return (
    <div>
      <Toast ref={toast} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        id="categories-table"
        value={purchaseOrders}
        selection={selectedPurchaseOrder}
        onSelectionChange={(e) => setSelectedPurchaseOrder(e.value)}
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
        <Column header="View" body={viewTemplate} style={{ width: '50px', textAlign: 'center' }} />
        <Column field="totalSummary.poNumber" header="Stock Transfer" />
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
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Stock Transfer Products"
        footer={dialogFooter}
        closable={true}
        draggable={false}
        resizable={false}
        style={{ width: '90vw', height: '90vh' }}
      >
        <div className="flex gap-3 mb-3">
          <Button label={acceptButtonLabel} onClick={handleAccept} />
          <Button label="Reject All" className="p-button-danger" />
        </div>

        {selectedRowData && (
          <DataTable
            value={selectedRowData.items}
            paginator
            rows={20}
            showGridlines
            stripedRows
            responsiveLayout="scroll"
            rowsPerPageOptions={[20, 50, 100]}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            selectionMode="multiple"
            dataKey="stockTransferItemId"
          >
            <Column selectionMode="multiple" />
            <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
            <Column field="productName" header="Product Name" sortable />
            <Column field="sku" header="SKU" sortable />
            <Column
              field="isReceived"
              header="Received?"
              body={(row) => (row.isReceived ? 'Yes' : 'No')}
            />
            <Column
              header="From Branch"
              body={() => selectedRowData?.supplierDetails.supplierName}
            />
            <Column header="To Branch" body={() => selectedRowData?.branchDetails.branchName} />
            <Column field="acceptanceStatus" header="Status" />
          </DataTable>
        )}
      </Dialog>
    </div>
  )
}

export default InventoryStockTransfer
