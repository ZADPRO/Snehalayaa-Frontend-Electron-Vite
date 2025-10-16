import React, { useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import bwipjs from 'bwip-js'
import jsPDF from 'jspdf'
import { ProgressSpinner } from 'primereact/progressspinner'

const LABEL_WIDTH = 60
const LABEL_HEIGHT = 30

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
      name: 'Red Saree',
      hsnCode: '987654',
      sku: 'SS102500002',
      price: '3000',
      status: 'Created'
    },
    {
      DummyProductsID: 3,
      name: 'Red Saree',
      hsnCode: '987654',
      sku: 'SS102500003',
      price: '3000',
      status: 'Created'
    }
    // You can add more static products here
  ])
  const [selectedRows, setSelectedRows] = useState<SimplifiedPurchaseOrderProduct[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrint = async () => {
    if (!selectedRows.length) return
    setIsGenerating(true)

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [LABEL_WIDTH, LABEL_HEIGHT]
      })

      for (let i = 0; i < selectedRows.length; i++) {
        const p = selectedRows[i]
        const canvas = document.createElement('canvas')

        await (bwipjs as any).toCanvas(canvas, {
          bcid: 'code128',
          text: p.sku,
          scale: 2,
          height: 15,
          includetext: false,
          backgroundcolor: 'FFFFFF'
        })

        const imgData = canvas.toDataURL('image/png')
        const centerX = LABEL_WIDTH / 2

        pdf.setFontSize(8)
        pdf.text(p.name, centerX, 6, { align: 'center' })

        const barcodeWidth = 50
        const barcodeHeight = 15
        pdf.addImage(imgData, 'PNG', centerX - barcodeWidth / 2, 10, barcodeWidth, barcodeHeight)

        pdf.setFontSize(7)
        pdf.text(`SKU: ${p.sku}`, centerX, 27, { align: 'center' })

        const formattedPrice = `₹ ${parseFloat(p.price).toFixed(2)}`
        pdf.setFontSize(7)
        pdf.text(formattedPrice, centerX, 29, { align: 'center' })

        if (i !== selectedRows.length - 1) {
          pdf.addPage([LABEL_WIDTH, LABEL_HEIGHT], 'portrait')
        }
      }

      const blob = pdf.output('blob')
      const url = URL.createObjectURL(blob)
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
      iframe.onload = () => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      }
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'PDF Generation Failed',
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
              Generating PDF, please wait...
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center mb-3">
        <h2 className="text-2xl font-bold text-purple-800 m-0">Product Barcode Selection</h2>
        <div className="ml-auto">
          <Button
            label="Generate Barcode PDF"
            className="p-button-sm p-button-success"
            disabled={!selectedRows.length || isGenerating}
            onClick={handlePrint}
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
