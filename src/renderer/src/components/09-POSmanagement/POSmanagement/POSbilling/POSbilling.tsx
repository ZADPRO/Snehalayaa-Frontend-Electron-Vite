import React, { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { LoaderCircle, Printer } from 'lucide-react'
import logo from '../../../../assets/logo/invoice.png'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'

interface InvoiceItem {
  name: string
  quantity: number
  price: number
  discount: number // in %
  total: number
}

interface PaymentBreakdown {
  mode: string
  amount: number
}

interface InvoicePreviewProps {
  invoiceNumber: string
  date: string
  customerName: string
  items: InvoiceItem[]
  totalAmount: number
  paidAmount: number
  changeReturned: number
  payments: PaymentBreakdown[]
  //   onPrint?: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoiceNumber,
  date,
  customerName,
  items,
  totalAmount,
  paidAmount,
  changeReturned,
  payments
  //   onPrint
}) => {
  console.log('payments', payments)
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    console.log('payments changed:', payments)
  }, [payments])

  // Helper: Convert a local image to base64 (for jsPDF)
  const getBase64FromImage = (imgUrl: string): Promise<string> => {
    return fetch(imgUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
      )
  }

  const handleInvoicePrint = async () => {
    setIsPrinting(true)

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 14

      // Try to add logo (optional)
      try {
        const logoBase64 = await getBase64FromImage(logo)
        doc.addImage(logoBase64, 'PNG', margin, 10, 40, 20)
      } catch {
        // Ignore logo errors
      }

      // Store details
      doc.setFontSize(12).setFont('helvetica', 'bold')
      doc.text('SVAP TEXTILES LLP', pageWidth / 2, 15, { align: 'center' })
      doc.setFontSize(9).setFont('helvetica', 'normal')
      doc.text('NO. 23, VENKATNARAYANA ROAD, T.NAGAR, CHENNAI, INDIA', pageWidth / 2, 20, {
        align: 'center'
      })
      doc.text('TAMILNADU, 600017', pageWidth / 2, 25, { align: 'center' })

      // Invoice Info
      doc.setFontSize(10)
      doc.text(`Invoice #: ${invoiceNumber}`, margin, 40)
      doc.text(`Date: ${date}`, pageWidth - margin, 40, { align: 'right' })
      doc.text(`Customer: ${customerName}`, margin, 46)

      // Items Table
      autoTable(doc, {
        startY: 52,
        theme: 'grid',
        head: [['Item', 'Qty', 'Price', 'Disc %', 'Total']],
        body: items.map((item) => [
          item.name,
          item.quantity,
          item.price.toFixed(2),
          item.discount.toString(),
          item.total.toFixed(2)
        ]),
        styles: { fontSize: 9, halign: 'right' },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], halign: 'center' },
        columnStyles: {
          0: { halign: 'left' }
        }
      })

      const finalY = (doc as any).lastAutoTable.finalY as number
      let y = typeof finalY === 'number' && !isNaN(finalY) ? finalY + 6 : 80

      // Totals
      doc.setFontSize(10)
      doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, pageWidth - margin, y, {
        align: 'right'
      })
      y += 5
      doc.text(`Received Amount: ₹${paidAmount.toFixed(2)}`, pageWidth - margin, y, {
        align: 'right'
      })
      y += 5
      doc.text(`Change Returned: ₹${changeReturned.toFixed(2)}`, pageWidth - margin, y, {
        align: 'right'
      })

      // Payment modes breakdown
      if (payments?.length) {
        y += 10
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('Payment Modes:', margin, y)
        doc.setFont('helvetica', 'normal')
        y += 5
        doc.setFontSize(10)
        payments.forEach((p) => {
          doc.text(`${p.mode}: ₹${p.amount.toFixed(2)}`, margin, y)
          y += 5
        })
      }

      // Print via hidden iframe for "direct print"
      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus()
          iframe.contentWindow?.print()
        }, 300) // small delay for better PDF render
      }
    } catch (error) {
      alert('Invoice Print Failed: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <Card style={{ maxWidth: 500, margin: 'auto', padding: '15px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 15 }}>
        <img src={logo} alt="Logo" style={{ height: 50 }} />
        <h3 style={{ margin: '5px 0 0' }}>SVAP TEXTILES LLP</h3>
        <small>NO. 23, VENKATNARAYANA ROAD, T.NAGAR, CHENNAI, INDIA</small>
        <br />
        <small>TAMILNADU, 600017</small>
      </div>

      {/* Invoice Info */}
      <div style={{ marginBottom: 10 }}>
        <strong>Invoice #: </strong>
        {invoiceNumber}
        <br />
        <strong>Date: </strong>
        {date}
        <br />
        <strong>Customer: </strong>
        {customerName}
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '5px', textAlign: 'left' }}>Item</th>
            <th style={{ padding: '5px', textAlign: 'right' }}>Qty</th>
            <th style={{ padding: '5px', textAlign: 'right' }}>Price</th>
            <th style={{ padding: '5px', textAlign: 'right' }}>Disc %</th>
            <th style={{ padding: '5px', textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '5px' }}>{item.name}</td>
              <td style={{ padding: '5px', textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ padding: '5px', textAlign: 'right' }}>{item.price.toFixed(2)}</td>
              <td style={{ padding: '5px', textAlign: 'right' }}>{item.discount}</td>
              <td style={{ padding: '5px', textAlign: 'right' }}>{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ textAlign: 'right' }}>
        <div>
          <strong>Total: </strong>₹{totalAmount.toFixed(2)}
        </div>
        <div>
          <strong>Received: </strong>₹{paidAmount.toFixed(2)}
        </div>
        <div>
          <strong>Change: </strong>₹{changeReturned.toFixed(2)}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div style={{ marginTop: 10 }}>
        <strong>Payment Modes:</strong>
        <ul style={{ margin: 0, paddingLeft: 15 }}>
          {payments.map((p, idx) => (
            <li key={idx}>
              {p.mode}: ₹{p.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Exchange Policy */}
      <div style={{ marginTop: '20px', fontSize: '11px' }}>
        <div>
          <strong>Exchange Policy:</strong>
        </div>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px', lineHeight: '1.3' }}>
            No refunds only Exchange within 7 days from the date of Purchase.
          </li>
          <li style={{ marginBottom: '8px', lineHeight: '1.3' }}>
            Exchanges are not available on Fridays, Saturdays, or Sundays.
          </li>
          <li style={{ marginBottom: '8px', lineHeight: '1.3' }}>
            Items can only be returned or replaced once. Replaced items cannot be exchanged further.
          </li>
          <li style={{ marginBottom: '8px', lineHeight: '1.3' }}>
            If the purchased Sarees with blouse section cut and separated and tassles are made, then
            the product/products are not eligible for exchange
          </li>
          <li style={{ marginBottom: '8px', lineHeight: '1.3' }}>
            Items purchased during sales or at a discount are not eligible for return or exchange.
          </li>
        </ul>
      </div>
      <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
        <div>Thank you for your purchase. We look</div>
        <div>forward to serving you again.</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Courier New, monospace' }}>
        <div style={{ fontSize: '20px', letterSpacing: '1px', marginBottom: '5px' }}>
          ||||| |||| || |||| ||| |||| |||| ||| |||||| |||| |||| |||
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{invoiceNumber}</div>
      </div>

      {/* Print Button */}
      <div style={{ marginTop: 15, textAlign: 'center' }}>
        <Button
          label={isPrinting ? 'Printing...' : 'Print'}
          icon={isPrinting ? <LoaderCircle className="spin" size={18} /> : <Printer size={18} />}
          disabled={isPrinting}
          onClick={handleInvoicePrint}
        />
      </div>
    </Card>
  )
}

export default InvoicePreview
