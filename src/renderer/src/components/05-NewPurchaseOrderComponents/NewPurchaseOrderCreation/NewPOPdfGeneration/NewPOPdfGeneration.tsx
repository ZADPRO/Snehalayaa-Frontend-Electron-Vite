import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { PurchaseOrderProps } from './NewPOPdfGeneration.interface'
import robotoFont from './assets/roboto_font.ttf'

Font.register({
  family: 'Roboto',
  src: robotoFont
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 20,
    lineHeight: 1.4,
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  logo: { width: 80, height: 80, objectFit: 'contain' },
  title: { fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-end' },

  companySection: { marginBottom: 10 },
  companyName: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  companyAddress: { textTransform: 'capitalize' },

  supplierBranchContainer: {
    marginTop: 8,
    marginBottom: 10
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 4
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  halfBox: {
    width: '48%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderStyle: 'solid', // ✅ added
    padding: 6,
    borderRadius: 2
  },
  bold: { fontWeight: 'bold' },

  // ✅ Table borders fixed
  table: {
    display: 'table' as any,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid', // ✅ added
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid' // ✅ added
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'solid', // ✅ added
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5'
  },
  col: {
    flexGrow: 1,
    paddingVertical: 4,
    textAlign: 'center'
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8
  },
  summaryText: { fontSize: 10, lineHeight: 1.3, textAlign: 'right' },

  // ✅ Tax table borders fixed
  taxTable: {
    display: 'table' as any,
    width: '100%',
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid' // ✅ added
  },
  taxRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid' // ✅ added
  },
  taxCellHeader: {
    flex: 1,
    padding: 4,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    textAlign: 'center'
  },
  taxCell: {
    flex: 1,
    padding: 4,
    textAlign: 'center'
  }
})

export const PurchaseOrderPdf = ({
  invoiceNumber,
  logoBase64,
  from,
  to,
  summary,
  items
}: PurchaseOrderProps & {
  invoiceNumber: string
  logoBase64?: string
}) => {
  const TAX_RATE = parseFloat(summary.taxPercentage || '0')
  const TAX_AMOUNT = parseFloat(summary.taxAmount || '0')
  const SUBTOTAL = parseFloat(summary.subTotal || '0')
  const TOTAL_AMOUNT = parseFloat(summary.totalAmount || '0')

  const totalQty = items.reduce((acc, cur) => acc + Number(cur.quantity || 0), 0)

  const supplierAddress = [
    from.supplierDoorNumber,
    from.supplierStreet,
    from.supplierCity,
    from.supplierState,
    from.supplierCountry
  ]
    .filter(Boolean)
    .join(', ')

  const branchAddress = [
    to?.refBranchDoorNo,
    to?.refBranchStreet,
    to?.refBranchCity,
    to?.refBranchState,
    to?.refBranchPincode
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoBase64 ? <Image src={logoBase64} style={styles.logo} /> : <View />}
          <Text style={styles.title}>Purchase Order: {invoiceNumber}</Text>
        </View>

        {/* Company Info */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>SVAP TEXTILES LLP</Text>
          <Text style={styles.companyAddress}>
            No. 23, Venkatnarayana Road, T.Nagar, Chennai, India
          </Text>
          <Text style={styles.companyAddress}>Tamilnadu, 600017</Text>
        </View>

        {/* Supplier Reference */}
        <Text style={[styles.sectionTitle, { marginBottom: 2 }]}>Supplier Reference Code:</Text>
        <Text style={{ marginBottom: 6 }}>{from.supplierCode || '-'}</Text>

        {/* Dispatched From / To */}
        <View style={styles.supplierBranchContainer}>
          <View style={styles.infoRow}>
            {/* Dispatched From */}
            <View style={styles.halfBox}>
              <Text style={styles.bold}>Dispatched From:</Text>
              <Text>{from.supplierCompanyName || '-'}</Text>
              {from.supplierName && <Text>{from.supplierName}</Text>}
              <Text>{supplierAddress}</Text>
              {from.supplierEmail && <Text>Email: {from.supplierEmail}</Text>}
              {from.supplierContactNumber && <Text>Ph: {from.supplierContactNumber}</Text>}
            </View>

            {/* Dispatched To */}
            <View style={styles.halfBox}>
              <Text style={styles.bold}>Dispatched To:</Text>
              <Text>{to?.refBranchName || '-'}</Text>
              {branchAddress && <Text>{branchAddress}</Text>}
              {to?.refMobile && <Text>Ph: {to.refMobile}</Text>}
            </View>
          </View>
        </View>

        {/* Product Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {['S.No', 'Category', 'Description', 'Qty', 'Unit Price', 'Disc %', 'Total'].map(
              (h, i) => (
                <Text key={i} style={styles.col}>
                  {h}
                </Text>
              )
            )}
          </View>

          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col}>{i + 1}</Text>
              <Text style={styles.col}>{item.category}</Text>
              <Text style={styles.col}>{item.description}</Text>
              <Text style={styles.col}>{item.quantity}</Text>
              <Text style={styles.col}>{item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.col}>{item.discount.toFixed(2)}</Text>
              <Text style={styles.col}>{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Summary Totals */}
        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryText}>Total Quantity: {totalQty}</Text>
            <Text style={styles.summaryText}>IGST: {TAX_RATE}%</Text>
            <Text style={styles.summaryText}>Total Amount: ₹ {TOTAL_AMOUNT.toFixed(2)}</Text>
          </View>
        </View>

        {/* Tax Summary */}
        <Text style={[styles.bold, { marginTop: 12 }]}>Tax Summary</Text>
        <View style={styles.taxTable}>
          <View style={styles.taxRow}>
            {['Tax Type', 'Tax Rate', 'Tax Valuable', 'Tax Amount'].map((h, i) => (
              <Text key={i} style={styles.taxCellHeader}>
                {h}
              </Text>
            ))}
          </View>
          <View style={styles.taxRow}>
            <Text style={styles.taxCell}>IGST</Text>
            <Text style={styles.taxCell}>{TAX_RATE}%</Text>
            <Text style={styles.taxCell}>₹ {SUBTOTAL.toFixed(2)}</Text>
            <Text style={styles.taxCell}>₹ {TAX_AMOUNT.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
