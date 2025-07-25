import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { SimplifiedPurchaseOrderProduct } from './BarcodeCreation.interface'
import { fetchAllPurchaseOrderProducts } from './BarcodeCreation.function'
import { Button } from 'primereact/button'
import Barcode from 'react-barcode'
import jsPDF from 'jspdf'
import bwipjs from 'bwip-js'

import { ProgressSpinner } from 'primereact/progressspinner'

const BarcodeCreation: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<SimplifiedPurchaseOrderProduct[]>([])
  const [selectedRows, setSelectedRows] = useState<SimplifiedPurchaseOrderProduct[]>([])

  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchAllPurchaseOrderProducts()
      .then((data) => setProducts(data))
      .catch((err) =>
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000
        })
      )
  }, [])

  const handlePrint = async () => {
    if (!selectedRows.length) return
    setIsGenerating(true)

    try {
      const pdf = new jsPDF('portrait', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10
      const cardWidth = 60
      const cardHeight = 40
      const gap = 5

      let x = margin
      let y = margin

      for (const p of selectedRows) {
        const canvas = document.createElement('canvas')

        await (bwipjs as any).toCanvas(canvas, {
          bcid: 'code128',
          text: 'SS072500001',
          scale: 2,
          height: 10,
          includetext: false
        })

        const imgData = canvas.toDataURL('image/png')

        // Calculate center alignment
        const centerX = x + cardWidth / 2

        // Add Product Name centered
        pdf.setFontSize(9)
        pdf.text(p.name, centerX, y + 6, { align: 'center' })

        // Add Barcode centered
        const barcodeWidth = 40
        const barcodeHeight = 12
        pdf.addImage(
          imgData,
          'PNG',
          centerX - barcodeWidth / 2,
          y + 10,
          barcodeWidth,
          barcodeHeight
        )

        // Add SKU centered
        pdf.setFontSize(8)
        pdf.text(`SKU: ${p.sku}`, centerX, y + 26, { align: 'center' })

        // Add Price with ₹ symbol centered
        pdf.setFontSize(8)
        const formattedPrice = `INR ${parseFloat(p.price).toFixed(2)}`
        pdf.text(formattedPrice, centerX, y + 30, { align: 'center' })

        // Move to next card position
        x += cardWidth + gap
        if (x + cardWidth > pageWidth - margin) {
          x = margin
          y += cardHeight + gap
          if (y + cardHeight > pageHeight - margin) {
            pdf.addPage()
            y = margin
          }
        }
      }

      // ✅ Print instead of download
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
      <Tooltip target=".p-button" position="left" />{' '}
      {isGenerating && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-70 z-50">
          {' '}
          <div className="text-center">
            <ProgressSpinner />{' '}
            <p className="mt-3 text-lg font-medium text-purple-800">
              Generating PDF, please wait...
            </p>{' '}
          </div>{' '}
        </div>
      )}{' '}
      <div className="flex items-center mb-3">
        {' '}
        <h2 className="text-2xl font-bold text-purple-800 m-0">Product Barcode Selection</h2>{' '}
        <div className="ml-auto">
          {' '}
          <Button
            label="Generate Barcode PDF"
            className="p-button-sm p-button-success"
            disabled={!selectedRows.length || isGenerating}
            onClick={handlePrint}
          />{' '}
        </div>{' '}
      </div>{' '}
      <DataTable
        value={products}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="DummySKU"
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
      </DataTable>{' '}
      <div id="print-area" className="hidden-for-print">
        {' '}
        <div className="barcode-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {' '}
          {selectedRows.map((p) => (
            <div
              key={p.sku}
              id={`barcode-card-${p.sku}`}
              style={{
                width: '180px', // Approx. 50mm
                height: '125px', // Approx. 35mm
                padding: '10px',
                // border: '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}
            >
              <strong>{p.name}</strong>{' '}
              <Barcode value={p.sku} height={40} width={1} displayValue={false} />{' '}
              <div>{p.sku}</div> <div>₹ {parseFloat(p.price).toFixed(2)}</div>{' '}
            </div>
          ))}{' '}
        </div>{' '}
      </div>{' '}
    </div>
  )
}

export default BarcodeCreation
