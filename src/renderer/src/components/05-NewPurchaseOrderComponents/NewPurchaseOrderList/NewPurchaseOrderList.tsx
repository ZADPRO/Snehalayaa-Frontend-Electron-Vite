import React, { useEffect, useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import {
  fetchBranches,
  fetchPurchaseOrderDetails,
  fetchSuppliers
} from '../NewPurchaseOrderCreation/NewPurchaseOrderCreation.function'
import {
  Branch,
  PurchaseOrderListResponse,
  Supplier
} from '../NewPurchaseOrderCreation/NewPurchaseOrderCreation.interface'
import PurchaseOrderProductDetails from './PurchaseOrderProductDetails/PurchaseOrderProductDetails'
import { ScrollText } from 'lucide-react'
import axios from 'axios'
import { baseURL } from '../../../utils/helper'
import Barcode from 'react-barcode'

const LABEL_WIDTH = 60 // mm
const LABEL_HEIGHT = 20 // mm

const NewPurchaseOrderList: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderListResponse[]>([])
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrderListResponse[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [selectedRowData, setSelectedRowData] = useState<any>()

  const [productSearch, setProductSearch] = useState('')
  const [filteredAcceptedProducts, setFilteredAcceptedProducts] = useState<any[]>([])

  // Filters
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [globalSearch, setGlobalSearch] = useState('')

  // Sidebar
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderListResponse | null>(null)

  // Dialog for accepted product details
  const [detailsDialogVisible, setDetailsDialogVisible] = useState(false)
  const [acceptedProducts, setAcceptedProducts] = useState<any[]>([])

  // 🧠 Filter Logic
  useEffect(() => {
    let filtered = [...purchaseOrders]

    if (selectedBranch) {
      filtered = filtered.filter(
        (po) => po.branchName?.toLowerCase() === selectedBranch.refBranchName?.toLowerCase()
      )
    }

    if (selectedSupplier) {
      filtered = filtered.filter(
        (po) =>
          po.supplierName?.toLowerCase() === selectedSupplier.supplierCompanyName?.toLowerCase()
      )
    }

    if (fromDate && toDate) {
      filtered = filtered.filter((po) => {
        const poDate = new Date(po.createdAt)
        return poDate >= fromDate && poDate <= toDate
      })
    }

    if (globalSearch.trim() !== '') {
      const searchText = globalSearch.toLowerCase()
      filtered = filtered.filter((po) =>
        Object.values(po).some((val) => String(val).toLowerCase().includes(searchText))
      )
    }

    setFilteredOrders(filtered)
  }, [selectedBranch, selectedSupplier, fromDate, toDate, globalSearch, purchaseOrders])

  // 👇 Column template for clickable PO number
  const purchaseOrderTemplate = (rowData: PurchaseOrderListResponse) => (
    <span
      onClick={() => {
        setSelectedPO(rowData)
        setSidebarVisible(true)
      }}
      className="text-primary cursor-pointer underline font-bold"
    >
      {rowData.purchaseOrderNumber}
    </span>
  )

  // 📦 Fetch accepted product details and open Dialog
  const handleDetailsClick = async (rowData) => {
    console.log('rowData', rowData)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${baseURL}/admin/getAcceptedProducts/${rowData.purchaseOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('response', response)
      if (response?.data?.data) {
        setAcceptedProducts(response.data.data)
        setSelectedRowData(rowData)
        setDetailsDialogVisible(true)
      }
    } catch (error) {
      console.error('❌ Failed to fetch PO details:', error)
    }
  }

  const scrollIconTemplate = (rowData) => (
    <div className="flex cursor-pointer">
      <ScrollText onClick={() => handleDetailsClick(rowData)} />
    </div>
  )

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!productSearch.trim()) {
      setFilteredAcceptedProducts(acceptedProducts)
    } else {
      const search = productSearch.toLowerCase()
      const filtered = acceptedProducts.filter(
        (p) =>
          p.productName?.toLowerCase().includes(search) ||
          p.SKU?.toLowerCase().includes(search) ||
          p.productDescription?.toLowerCase().includes(search)
      )
      setFilteredAcceptedProducts(filtered)
    }
  }, [productSearch, acceptedProducts])

  const loadData = async () => {
    const [branchData, supplierData, purchaseOrderData] = await Promise.all([
      fetchBranches(),
      fetchSuppliers(),
      fetchPurchaseOrderDetails()
    ])
    setBranches(branchData)
    setSuppliers(supplierData)
    setPurchaseOrders(purchaseOrderData || [])
    setFilteredOrders(purchaseOrderData || [])
  }

  const [_isGenerating, setIsGenerating] = useState(false)

  const printLabels = () => {
    if (!selectedRows.length) return
    setIsGenerating(true)

    setTimeout(() => {
      const printContents = document.getElementById('print-area')?.innerHTML
      if (!printContents) return

      const printWindow = window.open('', '', 'width=800,height=600')
      if (!printWindow) return

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Labels</title>
            <!-- Import Roboto with weight 500 -->
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet">
            <style>
              /* Apply Roboto Medium to all labels */
              .barcode-label {
                font-family: 'Roboto', sans-serif;
                font-weight: 500;
              }
            </style>
            <style>
              @media print {
                body * { visibility: hidden; }
                #print-area, #print-area * {
                  visibility: visible;
                  font-family: 'Roboto', sans-serif;
                  font-weight: 500; /* ensure medium weight for print */
                }
                #print-area {
                  display: grid !important;
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 5mm;
                  padding-left: 3mm;
                  padding-top: 5mm;
                  margin: 0;
                }
                .barcode-label {
                  width: auto !important;
                  height: auto !important;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  page-break-inside: avoid;
                  border: none !important;
                  text-transform: uppercase;
                  font-family: 'Roboto', sans-serif !important;
                  font-weight: 500 !important;
                }
              }
              .barcode-label {
                width: ${LABEL_WIDTH}mm;
                height: ${LABEL_HEIGHT}mm;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                margin: 5px;
                font-family: 'Roboto', sans-serif;
                font-weight: 500;
              }
            </style>
          </head>
          <body>
            <div id="print-area">${printContents}</div>
          </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()

      setIsGenerating(false)
    }, 100)
  }

  return (
    <div>
      <p className="font-bold text-lg mb-3">Purchase Orders</p>

      {/* 🔍 Filters Section */}
      <div className="flex justify-content-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-3">
          <Dropdown
            filter
            placeholder="Select Branch"
            options={branches}
            optionLabel="refBranchName"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.value)}
            className="w-15rem"
            showClear
          />
          <Dropdown
            filter
            placeholder="Select Supplier"
            options={suppliers}
            optionLabel="supplierCompanyName"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.value)}
            className="w-15rem"
            showClear
          />
          <Calendar
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.value as Date)}
            className="w-13rem paymentNotesCalendarIcon"
            showIcon
          />
          <Calendar
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.value as Date)}
            className="w-13rem paymentNotesCalendarIcon"
            showIcon
          />
        </div>
        <div className="flex align-items-center">
          <InputText
            placeholder="Global Search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-15rem"
          />
        </div>
      </div>

      {/* 📋 Data Table */}
      <DataTable
        value={filteredOrders}
        showGridlines
        scrollable
        paginator
        rows={10}
        className="mt-2"
      >
        <Column
          header="S.No"
          frozen
          body={(_, { rowIndex }) => rowIndex + 1}
          style={{ width: '70px' }}
        />
        <Column header="" frozen body={scrollIconTemplate} />
        <Column
          field="purchaseOrderNumber"
          header="Purchase Order No"
          body={purchaseOrderTemplate}
          frozen
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column
          field="invoice_final_number"
          header="Invoice Number"
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column
          field="totalOrderedQuantity"
          header="No. of Products"
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column
          field="totalAcceptedQuantity"
          header="Accepted Qty"
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column
          field="totalRejectedQuantity"
          header="Rejected Qty"
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column field="totalAmount" header="Total Amount" sortable style={{ minWidth: '14rem' }} />
        <Column field="status" header="Status" sortable style={{ minWidth: '14rem' }} />
        <Column field="createdAt" header="Created At" sortable style={{ minWidth: '14rem' }} />
        <Column
          field="supplierName"
          header="Supplier Name"
          sortable
          style={{ minWidth: '14rem' }}
        />
        <Column field="branchName" header="Branch Name" sortable style={{ minWidth: '14rem' }} />
      </DataTable>

      {/* 📦 Sidebar for PO Details */}
      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => {
          setSidebarVisible(false)
          setSelectedPO(null)
          loadData()
        }}
        header="Purchase Order - GRN"
        style={{ width: '80vw' }}
      >
        {selectedPO && <PurchaseOrderProductDetails purchaseOrder={selectedPO} />}
      </Sidebar>

      {/* 🪟 Dialog for Accepted Product Details */}
      <Dialog
        header="Accepted Product Details"
        visible={detailsDialogVisible}
        onHide={() => setDetailsDialogVisible(false)}
        style={{ width: '95vw', height: '98vh' }}
        draggable={false}
        resizable={false}
        maximizable
      >
        <div className="flex justify-content-between">
          <InputText
            placeholder="Search by Product / SKU / Description"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-20rem"
          />{' '}
          <div className="flex gap-3">
            <Button label="Generate PDF Invoice" />
            <Button label="Print Barcode" onClick={printLabels} />
          </div>
        </div>
        <div className="">
          <DataTable
            value={filteredAcceptedProducts}
            selection={selectedRows}
            onSelectionChange={(e) => setSelectedRows(e.value)}
            scrollable
            showGridlines
            dataKey="SKU"
            className="mt-3 productPreviewTableUI"
            selectionMode="multiple"
            paginator
            rowsPerPageOptions={[20, 50, 100]}
            rows={20}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ textAlign: 'center' }}
              style={{ minWidth: '20px' }}
            />
            <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
            <Column field="SKU" header="SKU" />
            <Column field="productName" header="Product Name" />
            <Column
              field="productDescription"
              header="Description"
              body={(rowData) => rowData.productDescription || '-'}
            />
            <Column field="unitPrice" header="Unit Price" />
            <Column field="discount" header="Discount (%)" />
            <Column field="discountPrice" header="Discount Price" />
            <Column field="margin" header="Margin (%)" />
            <Column field="totalAmount" header="Total Amount" />
            <Column field="createdAt" header="Created At" />
            <Column field="createdBy" header="Created By" />
            <Column
              field="quantity"
              header="Quantity"
              body={(rowData) => rowData.quantity || '-'}
            />
          </DataTable>
        </div>
      </Dialog>

      <div id="print-area">
        {selectedRows.map((p, index) => (
          <div key={index} className="barcode-label hidden">
            <p className="product-name">{p.productName}</p>

            <div className="barcode-wrapper">
              <Barcode value={p.SKU || ''} height={35} width={1} displayValue={false} />
            </div>

            <div className="sku">{p.SKU}</div>
            <div className="price">₹ {parseFloat(p.unitPrice || 0).toFixed(2)}</div>

            {/* Combine purchaseOrderNumber + lineNumber dynamically */}
            <div className="pinv">
              {selectedRowData?.purchaseOrderNumber} | {p.lineNumber || '-'}
            </div>
          </div>
        ))}

        <style>
          {`
      .barcode-label {
        width: ${LABEL_WIDTH}mm;
        height: ${LABEL_HEIGHT}mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin: 5px;
      }
      .product-name {
        font-weight: bold;
        margin: 0;
        margin-bottom: 2px; /* reduce gap below name */
      }
      .barcode-wrapper {
        margin-top: -2px; /* move barcode closer to name */
        margin-bottom: 2px;
      }
      .pinv {
        font-size: 9px; /* smaller font for P-INV text */
      }

      @media print {
        body * {
          visibility: hidden;
        }
        #print-area, #print-area * {
          visibility: visible;
          font-weight: bold; /* ensure bold carries in print */
        }
        #print-area {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 5mm;
          padding-left: 3mm;
          padding-top: 5mm;
          margin: 0;
        }
        .barcode-label {
          width: auto !important;
          height: auto !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          page-break-inside: avoid;
          border: none !important;
          text-transform: uppercase;
        }
        .product-name {
          font-weight: bold;
        }
        .pinv {
          font-size: 7pt !important;
        }
        .barcode-wrapper {
          margin-top: -1mm !important;
          margin-bottom: 1mm !important;
        }
      }
    `}
        </style>
      </div>
    </div>
  )
}

export default NewPurchaseOrderList
