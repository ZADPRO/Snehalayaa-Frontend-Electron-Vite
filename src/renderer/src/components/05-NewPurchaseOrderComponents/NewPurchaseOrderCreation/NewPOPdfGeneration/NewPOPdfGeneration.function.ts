// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { PurchaseOrderProps } from './NewPOPdfGeneration.interface'

// export const generatePurchaseOrderPdf = (
//   props: PurchaseOrderProps & {
//     invoiceNumber: string
//     logoBase64?: string
//     action?: 'download' | 'print'
//   }
// ) => {
//   const doc = new jsPDF({
//     orientation: 'portrait',
//     unit: 'mm',
//     format: 'a4',
//     compress: true
//   })

//   const pageWidth = doc.internal.pageSize.getWidth()
//   const margin = 14
//   const TAX_RATE = props.summary.taxPercentage ? parseFloat(props.summary.taxPercentage) : 0
//   const TAX_AMOUNT = parseFloat(props.summary.taxAmount || '0')
//   const SUBTOTAL = parseFloat(props.summary.subTotal || '0')
//   const TOTAL_AMOUNT = parseFloat(props.summary.totalAmount || '0')

//   // 1️⃣ Logo
//   if (props.logoBase64) {
//     doc.addImage(props.logoBase64, 'PNG', margin, 10, 60, 24)
//   }

//   // 2️⃣ Invoice number
//   doc.setFontSize(12)
//   doc.text(`Purchase Order: ${props.invoiceNumber}`, pageWidth - margin - 60, 15)

//   // 3️⃣ Company details
//   doc.setFontSize(10)
//   const companyDetails = [
//     'SVAP TEXTILES LLP',
//     'No. 23, VENKATNARAYANA ROAD, T.NAGAR, CHENNAI, INDIA',
//     'TAMILNADU, 600017'
//   ]
//   doc.text(companyDetails, margin, 40)

//   // 4️⃣ Supplier and Branch
//   const from = props.from
//   const to = props.to

//   doc.setFontSize(10)
//   doc.text('From:', margin, 60)
//   doc.text(from.supplierCompanyName || '-', margin, 65)
//   if (from.supplierName) doc.text(from.supplierName, margin, 70)
//   if (from.supplierAddress) doc.text(from.supplierAddress, margin, 75)

//   doc.text('To:', pageWidth / 2, 60)
//   doc.text(to.branchName || '-', pageWidth / 2, 65)
//   if (to.branchAddress) doc.text(to.branchAddress, pageWidth / 2, 70)

//   // 5️⃣ Table for products
//   const tableStartY = 85
//   autoTable(doc, {
//     startY: tableStartY,
//     theme: 'plain', // ✅ removes borders
//     head: [['S.No', 'Category', 'Description', 'Qty', 'Unit Price', 'Disc %', 'Total']],
//     body: props.items.map((item, i) => [
//       i + 1,
//       item.category,
//       item.description,
//       item.quantity,
//       item.unitPrice.toFixed(2),
//       item.discount.toFixed(2),
//       item.total.toFixed(2)
//     ]),
//     styles: { fontSize: 9, lineWidth: 0 },
//     headStyles: { fontStyle: 'bold', textColor: [0, 0, 0] }
//   })

//   const finalY = (doc as any).lastAutoTable.finalY + 5

//   // 6️⃣ IGST and Total summary (right aligned)
//   doc.setFontSize(10)
//   const summaryX = pageWidth - 80

//   doc.text('IGST:', summaryX, finalY + 5)
//   doc.text(`${TAX_RATE}%`, summaryX + 35, finalY + 5)

//   doc.text('Total Amount:', summaryX, finalY + 12)
//   doc.text(`₹ ${TOTAL_AMOUNT.toFixed(2)}`, summaryX + 35, finalY + 12)

//   // 7️⃣ Horizontal line
//   doc.setLineWidth(0.5)
//   doc.line(margin, finalY + 20, pageWidth - margin, finalY + 20)

//   // 8️⃣ Tax Summary Section
//   doc.setFontSize(11)
//   doc.text('Tax Summary', margin, finalY + 28)
//   autoTable(doc, {
//     startY: finalY + 32,
//     theme: 'plain',
//     head: [['Tax Type', 'Tax Rate', 'Tax Valuable', 'Tax Amount']],
//     body: [['IGST', `${TAX_RATE}%`, `₹ ${SUBTOTAL.toFixed(2)}`, `₹ ${TAX_AMOUNT.toFixed(2)}`]],
//     styles: { fontSize: 9, lineWidth: 0 },
//     headStyles: { fontStyle: 'bold', textColor: [0, 0, 0] }
//   })

//   // 🔁 Print or Download
//   if (props.action === 'print') {
//     doc.autoPrint()
//     const blob = doc.output('blob')
//     const url = URL.createObjectURL(blob)
//     const iframe = document.createElement('iframe')
//     iframe.style.display = 'none'
//     iframe.src = url
//     document.body.appendChild(iframe)

//     iframe.onload = () => {
//       iframe.contentWindow?.focus()
//       iframe.contentWindow?.print()
//     }
//   } else {
//     doc.save(`${props.invoiceNumber}.pdf`)
//   }
// }
