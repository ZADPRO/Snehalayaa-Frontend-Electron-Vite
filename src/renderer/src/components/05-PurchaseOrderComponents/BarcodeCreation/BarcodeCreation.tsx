import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { PurchaseOrderProduct } from './BarcodeCreation.interface'
import { fetchAllPurchaseOrderProducts } from './BarcodeCreation.function'
import { Button } from 'primereact/button'
import Barcode from 'react-barcode'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const BarcodeCreation: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [products, setProducts] = useState<PurchaseOrderProduct[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])

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
    const pdf = new jsPDF('portrait', 'mm', 'a4')
    console.log('pdf', pdf)
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 10
    const cardWidth = 50
    const cardHeight = 35
    const gap = 5

    let x = margin
    let y = margin

    for (let i = 0; i < selectedRows.length; i++) {
      console.log('selectedRows', selectedRows)
      const p = selectedRows[i]
      const element = document.getElementById(`barcode-card-${p.DummySKU}`)
      if (!element) continue

      // Convert HTML to canvas
      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL('image/png')

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight)
      console.log('pdf', pdf)

      // Move to next position
      x += cardWidth + gap
      if (x + cardWidth > pageWidth - margin) {
        x = margin
        y += cardHeight + gap
        if (y + cardHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage()
          y = margin
        }
      }
    }

    // Auto print
    pdf.autoPrint()
    console.log('pdf', pdf)
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
  }

  return (
    <div>
      <Toast ref={toast} />
      <Tooltip target=".p-button" position="left" />

      <div className="flex items-center mb-3">
        <h2 className="text-2xl font-bold text-purple-800 m-0">Product Barcode Selection</h2>
        <div className="ml-auto">
          <Button
            label="Add to Print"
            className="p-button-sm p-button-primary"
            disabled={!selectedRows.length}
            onClick={handlePrint}
          />
        </div>
      </div>

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
        <Column field="ProductName" header="Product Name" />
        <Column field="HSNCode" header="HSN Code" />
        <Column field="DummySKU" header="SKU" />
        <Column field="Price" header="Price" />
        <Column field="AcceptanceStatus" header="Status" />
      </DataTable>

      <div id="print-area" className="hidden-for-print">
        <div className="barcode-grid">
          {selectedRows.map((p) => (
            <div
              key={p.DummySKU}
              id={`barcode-card-${p.DummySKU}`}
              style={{
                width: '180px', // Approx. 50mm
                height: '125px', // Approx. 35mm
                padding: '10px',
                border: '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}
            >
              <strong>{p.ProductName}</strong>
              <Barcode value={p.DummySKU} height={40} width={1} displayValue={false} />
              <div>{p.DummySKU}</div>
              <div>₹ {parseFloat(p.Price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarcodeCreation
