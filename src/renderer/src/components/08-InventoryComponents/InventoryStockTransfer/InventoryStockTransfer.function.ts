import axios from 'axios'
import { baseURL } from '../../../../src/utils/helper'
import { InvoiceProps, PurchaseOrder } from './InventoryStockTransfer.interface'

export const fetchCategories = async (): Promise<PurchaseOrder[]> => {
  const response = await axios.get(`${baseURL}/admin/purchaseOrder/read`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch purchase orders')
  }
}
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateInvoicePdf = (
  props: InvoiceProps & {
    invoiceNo: string
    logoBase64?: string
    action?: 'download' | 'print'
  }
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const currentPage = 1
  const totalPages = 1
  const margin = 14

  // 1️⃣ Add logo image
  if (props.logoBase64) {
    doc.addImage(props.logoBase64, 'PNG', margin, 10, 60, 24)
  }

  // 2️⃣ Add invoice number
  doc.setFontSize(12)
  doc.text(`Invoice No: ${props.invoiceNo}`, pageWidth - margin - 60, 15)

  // 3️⃣ Company details
  doc.setFontSize(10)
  const companyDetails = [
    'SVAP TEXTILES LLP',
    'NO. 23, VENKATNARAYANA ROAD, T.NAGAR, CHENNAI, INDIA',
    'TAMILNADU, 600017'
  ]
  doc.text(companyDetails, margin, 40)

  // 4️⃣ Supplier details
  const supplier = [
    props.to.name,
    props.to.address || '',
    props.to.taxNo ? `Tax No: ${props.to.taxNo}` : '',
    props.to.phone ? `Mobile: ${props.to.phone}` : ''
  ].filter(Boolean)
  doc.text(supplier, pageWidth - margin - 70, 40)

  // 5️⃣ Dispatch details
  doc.text('Dispatched From:', margin, 60)
  doc.text(props.from.name, margin, 65)
  if (props.from.address) doc.text(props.from.address, margin, 70)

  doc.text('Dispatched To:', pageWidth - margin - 70, 60)
  doc.text(props.to.name, pageWidth - margin - 70, 65)
  if (props.to.address) doc.text(props.to.address, pageWidth - margin - 70, 70)

  // 6️⃣ Page count
  doc.setFontSize(9)
  doc.text(`${currentPage}/${totalPages}`, pageWidth - margin, 80, { align: 'right' })

  // 7️⃣ Table
  const tableStartY = 85

  autoTable(doc, {
    startY: tableStartY,
    theme: 'plain',
    head: [['S.No', 'Product', 'HSN', 'Qty', 'Price', 'Disc %', 'Disc Amt', 'Total']],
    body: props.items.map((item, i) => {
      const product = `${item.category} - ${item.subCategory} - ${item.productName}`
      const qty = item.quantity
      const price = Number(item.purchasePrice) || 0
      const discountPercent = Number(item.discount) || 0
      const discountAmount = ((price * discountPercent) / 100) * qty
      const total = price * qty - discountAmount

      return [
        i + 1,
        product,
        item.hsnCode || '-',
        qty,
        price.toFixed(2),
        discountPercent.toFixed(2),
        discountAmount.toFixed(2),
        total.toFixed(2)
      ]
    }),
    styles: { fontSize: 9, lineColor: [0, 0, 0], lineWidth: 0.1 },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    didDrawPage: (data) => {
      if (data.cursor && data.cursor.y > pageHeight - 20) {
        doc.text('To be continued...', margin, pageHeight - 10)
      }
    }
  })

  // 🔁 Print or Download
  if (props.action === 'print') {
    doc.autoPrint()
    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)

    iframe.onload = () => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }
  } else {
    doc.save(`${props.invoiceNo}.pdf`)
  }
}
