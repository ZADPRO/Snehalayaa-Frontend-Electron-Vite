import React, { useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import bwipjs from 'bwip-js'
import { ProgressSpinner } from 'primereact/progressspinner'

const LABEL_WIDTH = 60 // mm
const LABEL_HEIGHT = 30 // mm

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
    },
    {
      DummyProductsID: 3,
      name: 'Green Saree',
      hsnCode: '987656',
      sku: 'SS102500003',
      price: '3200',
      status: 'Created'
    }
  ])
  const [selectedRows, setSelectedRows] = useState<SimplifiedPurchaseOrderProduct[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate Barcode DataURL
  const generateBarcodeDataURL = async (sku: string) => {
    return new Promise<string>((resolve, reject) => {
      const canvas = document.createElement('canvas')
      try {
        ;(bwipjs as any).toCanvas(canvas, {
          bcid: 'code128',
          text: sku,
          scale: 2,
          height: 15,
          includetext: false,
          backgroundcolor: 'FFFFFF'
        })
        resolve(canvas.toDataURL('image/png'))
      } catch (err) {
        reject(err)
      }
    })
  }

  const printLabels = async () => {
    if (!selectedRows.length) return
    setIsGenerating(true)
    try {
      // Generate barcode images
      const barcodeImages: Record<string, string> = {}
      for (const p of selectedRows) {
        barcodeImages[p.sku] = await generateBarcodeDataURL(p.sku)
      }

      // Open new window for printing
      const printWindow = window.open('', '', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Labels</title>
              <style>
                @media print {
                  body * { visibility: hidden; }
                  #print-area, #print-area * { visibility: visible; }
                  #print-area { position: absolute; left: 0; top: 0; }
                  .barcode-label {
                    width: ${LABEL_WIDTH}mm;
                    height: ${LABEL_HEIGHT}mm;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    margin: 0;
                    page-break-inside: avoid;
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
                  border: 1px solid #ccc;
                  margin: 5px;
                }
              </style>
            </head>
            <body>
              <div id="print-area">
                ${selectedRows
                  .map(
                    (p) => `
                  <div class="barcode-label">
                    <strong>${p.name}</strong>
                    <img src="${barcodeImages[p.sku]}" alt="${p.sku}" />
                    <div>SKU: ${p.sku}</div>
                    <div>₹ ${parseFloat(p.price).toFixed(2)}</div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Print Failed',
        detail: err.message,
        life: 4000
      })
    } finally {
      setIsGenerating(false)
    }
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
    </div>
  )
}

export default BarcodeCreation
