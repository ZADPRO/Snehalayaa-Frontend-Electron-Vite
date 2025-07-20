import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { InvoiceProps } from './PurchaseOrderInvoice.interface'

export const generateInvoicePdf = (props: InvoiceProps) => {
  console.log('props', props)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  // Title
  doc.setFontSize(16)
  doc.text('Purchase Order Invoice', 14, 20)

  // From and To Details
  doc.setFontSize(10)
  doc.text('From:', 14, 30)
  doc.text(`Name: ${props.from.name}`, 14, 35)
  if (props.from.email) doc.text(`Email: ${props.from.email}`, 14, 40)

  doc.text('To:', 105, 30)
  doc.text(`Name: ${props.to.name}`, 105, 35)
  if (props.to.email) doc.text(`Email: ${props.to.email}`, 105, 40)

  // Add spacing
  const startY = 50

  autoTable(doc, {
    startY,
    head: [['S.No', 'Name', 'Quantity', 'Price', 'Disc %', 'Total']],
    body: props.items.map((item, i) => [
      i + 1,
      item.productName,
      item.quantity,
      Number(item.purchasePrice).toFixed(2),
      Number(item.discount).toFixed(2),
      Number(item.total).toFixed(2)
    ]),
    theme: 'grid',
    styles: { fontSize: 10 }
  })

  doc.save('purchase_invoice.pdf')
}
