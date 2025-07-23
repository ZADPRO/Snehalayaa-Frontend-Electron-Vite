import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'

import React, { useRef, useState, useEffect } from 'react'

import { FileText, FileSpreadsheet, FileSignature, Printer, Download } from 'lucide-react'
import { Tooltip } from 'primereact/tooltip'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Sidebar } from 'primereact/sidebar'
import ViewPurchaseOrderProducts from './ViewPurchaseOrderProducts/ViewPurchaseOrderProducts'

import { fetchCategories } from './PurchaseOrderList.function'
import { PurchaseOrder } from './PurchaseOrderList.interface'
import { generateInvoicePdf } from '../PurchaseOrderCreation/PurchaseOrderInvoice/PurchaseOrderInvoice.function'
import { InvoiceProps } from '../PurchaseOrderCreation/PurchaseOrderInvoice/PurchaseOrderInvoice.interface'

import logo from '../../../assets/logo/invoice.png'

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

  const mapToInvoiceProps = (po: PurchaseOrder): InvoiceProps => {
    return {
      from: {
        name: 'SVAP TEXTILES LLP',
        address: 'NO. 23, VENKATNARAYANA ROAD, T.NAGAR, CHENNAI, INDIA',
        phone: '',
        taxNo: ''
      },
      to: {
        name: po.supplierDetails.supplierName,
        address: po.supplierDetails.supplierAddress,
        email: po.supplierDetails.supplierEmail,
        phone: po.supplierDetails.supplierContactNumber,
        taxNo: po.supplierDetails.supplierGSTNumber
      },
      items: po.productDetails
        .filter((item) => item.isDelete === false)
        .map((item) => ({
          category: `Category ${item.refCategoryid}`,
          subCategory: `SubCategory ${item.refSubCategoryId}`,
          productName: item.productName,
          hsnCode: item.HSNCode,
          quantity: Number(item.purchaseQuantity) || 0,
          purchasePrice: Number(item.purchasePrice) || 0,
          discount: Number(item.discountPrice) || 0
        }))
    }
  }

  const getBase64FromImage = (imgUrl: string): Promise<string> => {
    return fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      })
  }

  const handleInvoice = async (po: PurchaseOrder, action: 'print' | 'download') => {
    const invoiceProps = mapToInvoiceProps(po)

    const logoBase64 = await getBase64FromImage(logo)

    generateInvoicePdf({
      ...invoiceProps,
      invoiceNo: po.totalSummary.poNumber,
      action,
      logoBase64: logoBase64
    })
  }

  const actionColumn = (rowData: PurchaseOrder) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<Printer size={16} />}
          severity="info"
          tooltip="Print Invoice"
          onClick={() => handleInvoice(rowData, 'print')}
        />
        <Button
          icon={<Download size={16} />}
          severity="success"
          tooltip="Download Invoice"
          onClick={() => handleInvoice(rowData, 'download')}
        />
      </div>
    )
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
        <Column field="supplierDetails.supplierName" header="Supplier" sortable />
        <Column field="branchDetails.branchName" header="Branch" sortable />
        <Column
          field="totalSummary.status"
          header="Status"
          body={(rowData) => (rowData.totalSummary.status === 1 ? 'Open' : 'Closed')}
        />
        <Column field="totalSummary.createdBy" header="Created By" />
        <Column field="totalSummary.createdAt" header="Created At" />
        <Column header="Actions" body={actionColumn} />
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
        {/* <ViewPurchaseOrderProducts
          rowData={selectedRowData ?? { productDetails: [], totalSummary: {} }}
        /> */}
        {selectedRowData && <ViewPurchaseOrderProducts rowData={selectedRowData} />}
      </Sidebar>
    </div>
  )
}

export default PurchaseOrderList
