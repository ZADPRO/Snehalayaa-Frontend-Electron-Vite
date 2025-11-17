import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { getAllPurchaseOrders } from './NewPurchaseOrderGRN.function'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Sidebar } from 'primereact/sidebar'
import NewPOGRNSidebar from './NewPOGRNSidebar/NewPOGRNSidebar'

const NewPurchaseOrderGRN: React.FC = () => {
  const [POdata, setPOdata] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleRight, setVisibleRight] = useState<boolean>(false)
  const [selectedPO, setSelectedPO] = useState<any>(null) // store clicked PO

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data] = await Promise.all([getAllPurchaseOrders()])
        setPOdata(data?.data || [])
      } catch (error) {
        console.error('❌ Failed to load purchase orders:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleInvoiceClick = (rowData: any) => {
    setSelectedPO(rowData) // save the clicked PO
    setVisibleRight(true) // open the sidebar
  }

  const invoiceTemplate = (rowData: any) => (
    <span
      style={{ color: '#0d6efd', cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => handleInvoiceClick(rowData)}
    >
      {rowData.purchaseOrderNumber || 'Not Available'}
    </span>
  )

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-[50vh]">
        <ProgressSpinner />
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="mb-1">Purchase Orders - Not In Use</h3>

      <DataTable value={POdata} showGridlines paginator rows={10} responsiveLayout="scroll">
        <Column
          header="S.No"
          body={(_rowData, { rowIndex }) => rowIndex + 1}
          style={{ width: '5rem', textAlign: 'center' }}
        />
        <Column field="purchaseOrderNumber" header="Invoice No" body={invoiceTemplate} sortable />
        <Column field="supplier.supplierName" header="Supplier Name" sortable />
        <Column field="branch.refBranchName" header="Branch Name" sortable />
        <Column field="summary.subTotal" header="Sub Total" sortable />
        <Column field="summary.totalAmount" header="Total Amount" sortable />
        <Column
          field="creditedDate"
          header="Credited Date"
          body={(rowData) => new Date(rowData.creditedDate).toLocaleDateString()}
          sortable
        />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        header="Goods Received Note"
        position="right"
        onHide={() => setVisibleRight(false)}
        style={{ width: '80vw' }}
      >
        <NewPOGRNSidebar purchaseOrder={selectedPO} />
      </Sidebar>
    </div>
  )
}

export default NewPurchaseOrderGRN
