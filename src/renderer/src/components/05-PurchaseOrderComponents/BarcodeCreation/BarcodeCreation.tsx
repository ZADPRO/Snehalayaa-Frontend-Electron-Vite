import React, { useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'
import { Button } from 'primereact/button'
import Barcode from 'react-barcode'
import { ProgressSpinner } from 'primereact/progressspinner'

const LABEL_WIDTH = 60 // mm
const LABEL_HEIGHT = 20 // mm

interface SimplifiedPurchaseOrderProduct {
  DummyProductsID: number
  name: string
  hsnCode: string
  sku: string
  price: string
  status: string
}

const BarcodeCreation: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products] = useState<SimplifiedPurchaseOrderProduct[]>([
    {
      DummyProductsID: 1,
      name: 'Red Saree',
      hsnCode: '987654',
      sku: 'SS102500001',
      price: '3000',
      status: 'Created'
    },
    {
      DummyProductsID: 2,
      name: 'Blue Saree',
      hsnCode: '987655',
      sku: 'SS102500002',
      price: '3500',
      status: 'Created'
    }
  ])
  const [selectedRows, setSelectedRows] = useState<SimplifiedPurchaseOrderProduct[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

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
    }, 100) // allow React to render first
  }

  return (
    <div>
      <Toast ref={toast} />
      <Tooltip target=".p-button" position="left" />
      {isGenerating && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-70 z-50">
          <div className="text-center">
            <ProgressSpinner />
            <p className="mt-3 text-lg font-medium text-purple-800">
              Generating Barcode Labels, please wait...
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center mb-3">
        <h2 className="text-2xl font-bold text-purple-800 m-0">Product Barcode Selection</h2>
        <div className="ml-auto">
          <Button
            label="Print Barcode Labels"
            className="p-button-sm p-button-success"
            disabled={!selectedRows.length || isGenerating}
            onClick={printLabels}
          />
        </div>
      </div>

      <DataTable
        value={products}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="sku"
        selectionMode="multiple"
        stripedRows
        showGridlines
        scrollable
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ textAlign: 'center' }}
          style={{ minWidth: '50px' }}
        />
        <Column field="DummyProductsID" header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="name" header="Product Name" />
        <Column field="hsnCode" header="HSN Code" />
        <Column field="sku" header="SKU" />
        <Column field="price" header="Price" />
        <Column field="status" header="Status" />
      </DataTable>

      <div id="print-area">
        {selectedRows.map((p) => (
          <div key={p.sku} className="barcode-label hidden">
            <p className="product-name">{p.name}</p>
            <div className="barcode-wrapper">
              <Barcode value={p.sku} height={35} width={1} displayValue={false} />
            </div>
            <div className="sku">SKU: {p.sku}</div>
            <div className="price">₹ {parseFloat(p.price).toFixed(2)}</div>
            <div className="pinv">P-INV-1025-10001 | 1 | SI1001</div>
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

export default BarcodeCreation
