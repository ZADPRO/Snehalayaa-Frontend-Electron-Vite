import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import JsBarcode from 'jsbarcode'

const StepThree: React.FC = () => {
  const [dialogRows, setDialogRows] = useState<any[]>([])
  const [poData, setPoData] = useState<any>(null)
  const [totals, setTotals] = useState({
    tax: 0,
    subTotal: 0,
    discountPrice: 0,
    shippingFee: 50,
    paymentFee: 20,
    roundOff: 0,
    total: 0
  })

  useEffect(() => {
    const storedData = localStorage.getItem('po_11')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        const po = parsedData[0]
        setPoData(po)

        const updatedRows = po.dialogRows.map((item: any) => {
          const discountAmount = (item.price * item.discount) / 100
          const totalAfterDiscount = item.price - discountAmount
          return { ...item, discountAmount, totalAfterDiscount }
        })
        setDialogRows(updatedRows)

        const subTotal = updatedRows.reduce((sum: number, item: any) => sum + item.price, 0)
        const discountPrice = updatedRows.reduce(
          (sum: number, item: any) => sum + item.discountAmount,
          0
        )
        const tax = (subTotal - discountPrice) * 0.05
        const roundOff =
          Math.round(subTotal - discountPrice + tax + totals.shippingFee + totals.paymentFee) -
          (subTotal - discountPrice + tax + totals.shippingFee + totals.paymentFee)
        const total =
          subTotal - discountPrice + tax + totals.shippingFee + totals.paymentFee + roundOff

        setTotals((prev) => ({ ...prev, subTotal, discountPrice, tax, roundOff, total }))
      } catch (error) {
        console.error('Error parsing localStorage data:', error)
      }
    }
  }, [])

  // Update totals dynamically when editable fields change
  const handleTotalChange = (field: 'shippingFee' | 'paymentFee' | 'roundOff', value: number) => {
    setTotals((prev) => {
      const newTotals = { ...prev, [field]: value }
      newTotals.roundOff =
        Math.round(
          newTotals.subTotal -
            newTotals.discountPrice +
            newTotals.tax +
            newTotals.shippingFee +
            newTotals.paymentFee
        ) -
        (newTotals.subTotal -
          newTotals.discountPrice +
          newTotals.tax +
          newTotals.shippingFee +
          newTotals.paymentFee)
      newTotals.total =
        newTotals.subTotal -
        newTotals.discountPrice +
        newTotals.tax +
        newTotals.shippingFee +
        newTotals.paymentFee +
        newTotals.roundOff
      return newTotals
    })
  }

  // Print barcode for top SKU
  const printBarcode = () => {
    if (!dialogRows.length) return
    const sku = dialogRows[0].sku
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write('<html><head><title>Barcode</title></head><body>')
      printWindow.document.write(`<svg id="barcode"></svg>`)
      printWindow.document.write('</body></html>')
      printWindow.document.close()

      const svg = printWindow.document.getElementById('barcode')
      if (svg) {
        JsBarcode(svg, sku, { format: 'CODE128', width: 2, height: 50 })
        printWindow.print()
      }
    }
  }

  return (
    <div className="p-3">
      {poData ? (
        <>
          {/* Editable Totals / Analysis */}
          <div className="flex flex-wrap align-items-center gap-4 ">
            <p className="flex-1">
              <strong>Sub Total:</strong> ₹{totals.subTotal.toFixed(2)}
            </p>
            <p className="flex-1">
              <strong>Discount Price:</strong> ₹{totals.discountPrice.toFixed(2)}
            </p>
            <p className="flex-1">
              <strong>Tax 5%:</strong> ₹{totals.tax.toFixed(2)}
            </p>
            <div className="flex-1 flex align-items-center gap-2">
              <strong>Shipping Fee:</strong>
              <InputNumber
                value={totals.shippingFee}
                onValueChange={(e) => handleTotalChange('shippingFee', e.value || 0)}
                mode="currency"
                currency="INR"
                buttonLayout="vertical"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-1 align-items-center">
            <div className="flex-1 flex align-items-center gap-2">
              <strong>Payment Fee:</strong>
              <InputNumber
                value={totals.paymentFee}
                onValueChange={(e) => handleTotalChange('paymentFee', e.value || 0)}
                mode="currency"
                currency="INR"
                buttonLayout="vertical"
              />
            </div>
            <div className="flex-1 flex align-items-center gap-2">
              <strong>Round Off:</strong>
              <InputNumber
                value={totals.roundOff}
                onValueChange={(e) => handleTotalChange('roundOff', e.value || 0)}
                mode="currency"
                currency="INR"
              />
            </div>
            <p className="flex-1">
              <strong>Total:</strong> ₹{totals.total.toFixed(2)}
            </p>
            <div className="flex-1"></div>
          </div>
          {/* Top right Print Button */}
          <div className="flex justify-content-end mb-3">
            <Button label="Print Barcode" icon="pi pi-print" onClick={printBarcode} />
          </div>

          {/* Product Table */}
          <DataTable
            value={dialogRows}
            stripedRows
            showGridlines
            className="mt-3"
            responsiveLayout="scroll"
            emptyMessage="No product details available"
          >
            <Column field="sNo" header="S.No" style={{ width: '5rem' }} />
            <Column field="lineNumber" header="Line" style={{ width: '5rem' }} />
            <Column field="sku" header="Product SKU" />
            <Column field="price" header="Price (₹)" />
            <Column field="discount" header="Discount (%)" />
            <Column
              field="discountAmount"
              header="Discount Amount (₹)"
              body={(rowData) => rowData.discountAmount.toFixed(2)}
            />
            <Column
              field="totalAfterDiscount"
              header="Total After Discount (₹)"
              body={(rowData) => rowData.totalAfterDiscount.toFixed(2)}
            />
          </DataTable>
        </>
      ) : (
        <p>No PO data found in localStorage.</p>
      )}
    </div>
  )
}

export default StepThree
