import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { PurchaseOrderProps } from './NewPOPdfGeneration.interface'

const generatePurchaseOrderPdf = (
  props: PurchaseOrderProps & {
    invoiceNumber: string
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

  if (props.logoBase64) {
    doc.addImage(props.logoBase64, 'PNG', margin, 10, 60, 24)
  }

  doc.setFontSize(12)
  doc.text(`Purchase/${props.invoiceNumber}`, pageWidth - margin - 60, 15)

  doc.setFontSize(10)

  const companyDetails = [
    'SVAP TEXTILES LLP',
    'No. 23, VENKATNARAYANA ROAD, T.NAGAR, CHENNAI, INDIA',
    'TAMILNADU, 600017'
  ]

  doc.text(companyDetails, margin, 40)

  const supplier = [props.from.supplierCompanyName, props.from.supplierName]
}
