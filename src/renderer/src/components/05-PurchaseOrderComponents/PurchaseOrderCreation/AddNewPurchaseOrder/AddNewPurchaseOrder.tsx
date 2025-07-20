import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { Toast } from 'primereact/toast'

import React, { useEffect, useRef, useState } from 'react'

import logo from '../../../../assets/logo/invoice.png'

import {
  fetchBranches,
  fetchSuppliers,
  fetchCategories,
  fetchSubCategories
} from './AddNewPurchaseOrder.function'
import { Branch, Supplier, Category, SubCategory } from './AddNewPurchaseOrder.interface'
import { Check, CheckCheck, Download, Pencil, Plus, Printer, Trash2 } from 'lucide-react'
import { Sidebar } from 'primereact/sidebar'
import AddNewProductsForPurchaseOrder from './AddNewProductsForPurchaseOrder/AddNewProductsForPurchaseOrder'
import { generateInvoicePdf } from '../PurchaseOrderInvoice/PurchaseOrderInvoice.function'

const AddNewPurchaseOrder: React.FC = () => {
  const dt = useRef<DataTable<any[]>>(null)
  const toast = useRef<Toast>(null)

  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  const [branches, setBranches] = useState<Branch[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const [tableData, setTableData] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const [branchData, supplierData, categoryData, subCategoryData] = await Promise.all([
        fetchBranches(),
        fetchSuppliers(),
        fetchCategories(),
        fetchSubCategories()
      ])
      setBranches(branchData)
      console.log('supplierData', supplierData)
      setSuppliers(supplierData)
      setCategories(categoryData)
      setSubCategories(subCategoryData)
    }

    loadData()
  }, [])

  const formatSupplierAddress = (supplier: Supplier): string => {
    return [
      supplier.supplierDoorNumber,
      supplier.supplierStreet,
      supplier.supplierCity,
      supplier.supplierState,
      supplier.supplierCountry,
      supplier.supplierPaymentTerms ? `PIN: ${supplier.supplierPaymentTerms}` : ''
    ]
      .filter(Boolean)
      .join(', ')
  }

  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)

  const invoiceIndex = 10001

  const invoiceNo = `POINV-${month}-${year}-${invoiceIndex}`

  const getBase64FromImage = (imgUrl: string): Promise<string> => {
    return fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      })
  }

  const handleSave = () => {
    console.log('Selected Branch:', selectedBranch)
    console.log('Selected Supplier:', selectedSupplier)
    console.log('Table Data:', tableData)
    setIsSaved(true)
  }

  const handleAddProduct = (newItem: any) => {
    setTableData((prev) => [...prev, { id: prev.length + 1, ...newItem }])
  }

  const isEditEnabled = selectedRows.length === 1
  const isDeleteEnabled = selectedRows.length >= 1

  const handleAddNewClick = () => {
    if (!selectedBranch || !selectedSupplier) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Address',
        detail: 'Please choose both From and To address before adding a product.'
      })
    } else {
      setVisibleRight(true)
    }
  }

  return (
    <div className="pt-3 flex h-full w-full">
      <Toast ref={toast} />

      <div style={{ width: '80%' }}>
        <div className="flex gap-3 align-items-center">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="fromAddress"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.value)}
                options={branches}
                optionLabel="refBranchName"
                placeholder="Select From Address"
                className="w-full"
              />
              <label htmlFor="status">From Address</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="toAddress"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.value)}
                options={suppliers}
                optionLabel="supplierCompanyName"
                placeholder="Select To Address"
                className="w-full"
              />
              <label htmlFor="status">To Address</label>
            </FloatLabel>
          </div>
          <div className="flex-1 flex gap-3">
            <Button
              label="Edit"
              severity="success"
              outlined
              className="w-full gap-2"
              icon={<Pencil size={20} />}
              onClick={() => setVisibleRight(true)}
              disabled={!isEditEnabled}
            />
            <Button
              label="Delete"
              severity="danger"
              className="w-full gap-2"
              icon={<Trash2 size={20} />}
              disabled={!isDeleteEnabled}
            />
          </div>
        </div>

        <Divider />

        <DataTable
          ref={dt}
          id="categories-table"
          value={tableData}
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
          dataKey="id"
          selectionMode="multiple"
          paginator
          showGridlines
          stripedRows
          rows={10}
          rowsPerPageOptions={[5, 10, 20]}
          responsiveLayout="scroll"
        >
          <Column selectionMode="multiple" headerStyle={{ textAlign: 'center' }} />
          <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />
          <Column field="productName" header="Name" />
          <Column field="quantity" header="Quantity" />
          <Column field="purchasePrice" header="Price" />
          <Column field="discount" header="Disc %" />
          <Column field="discount" header="Discount" />
          <Column field="total" header="Total" />
        </DataTable>
      </div>

      <Divider layout="vertical" />

      <div style={{ width: '17%' }} className="flex flex-column">
        <div className="flex flex-column gap-1">
          <Button
            label="Add New"
            className="w-full gap-2 p-button-primary"
            icon={<Plus size={20} />}
            onClick={handleAddNewClick}
          />
          <Button
            label={isSaved ? 'Close' : 'Save'}
            icon={isSaved ? <CheckCheck size={20} /> : <Check size={20} />}
            className="w-full gap-2 p-button-primary"
            onClick={handleSave}
          />
          <Button
            label="Download"
            icon={<Download size={18} />}
            className="w-full gap-2 p-button-primary"
            disabled={!isSaved}
            onClick={async () => {
              const logoBase64 = await getBase64FromImage(logo)

              if (selectedBranch && selectedSupplier) {
                generateInvoicePdf({
                  from: {
                    name: selectedBranch.refBranchName,
                    address: selectedBranch.refEmail
                  },
                  to: {
                    name: selectedSupplier.supplierCompanyName,
                    address: formatSupplierAddress(selectedSupplier),
                    phone: selectedSupplier.supplierContactNumber,
                    taxNo: selectedSupplier.supplierGSTNumber
                  },
                  items: tableData,
                  invoiceNo,
                  logoBase64
                })
              }
            }}
          />

          <Button
            label="Print"
            icon={<Printer size={18} />}
            className="w-full gap-2 p-button-primary"
            disabled={!isSaved}
            onClick={() => console.log('Print triggered')}
          />
        </div>
      </div>

      <Sidebar
        visible={visibleRight}
        position="right"
        header="Add Products For Purchase Order"
        onHide={() => setVisibleRight(false)}
        style={{ width: '50vw' }}
      >
        <AddNewProductsForPurchaseOrder
          categories={categories}
          subCategories={subCategories}
          fromAddress={selectedBranch}
          toAddress={selectedSupplier}
          onAdd={handleAddProduct}
          onClose={() => setVisibleRight(false)}
        />
      </Sidebar>
    </div>
  )
}

export default AddNewPurchaseOrder
