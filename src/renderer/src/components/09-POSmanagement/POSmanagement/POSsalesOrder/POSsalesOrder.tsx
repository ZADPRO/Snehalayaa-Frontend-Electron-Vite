import React, { useState } from 'react'
import { Plus, Search, Upload } from 'lucide-react'
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import POScustomers from '../POScustomers/POScustomers'
import { InputNumber } from 'primereact/inputnumber'
import { Product } from './POSsalesOrder.interface'
import { fetchProductBySKU } from './POSsalesOrder.function'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

const POSsalesOrder: React.FC = () => {
  const [visibleRight, setVisibleRight] = useState(false)
  const [sku, setSku] = useState('')

  const [products, setProducts] = useState<Product[]>([
    // {
    //   id: 1,
    //   productName: 'Apple',
    //   Price: 100,
    //   quantity: 2,
    //   Discount: 10,
    //   totalPrice: 180
    // }
  ])

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const updatedProducts = [...products]
    updatedProducts[e.index] = e.newData as Product
    setProducts(updatedProducts)
  }

  const textEditor = (options: any) => (
    <InputText value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />
  )

  const numberEditor = (options: any) => (
    <InputNumber
      value={options.value}
      onValueChange={(e) => options.editorCallback(e.value)}
      mode="decimal"
      minFractionDigits={0}
    />
  )

  const handleSKUFetch = async () => {
    try {
      const product = await fetchProductBySKU(sku)
      setProducts((prev) => [...prev, product])
      setSku('')
    } catch (error) {
      confirmDialog({
        message: 'No product found for this SKU. Do you want to try again?',
        header: 'Product Not Found',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: () => setSku(''),
        reject: () => console.log('User cancelled')
      })
    }
  }

  return (
    <div className="pt-3 flex h-full w-full gap-3">
      <ConfirmDialog />
      {/* Left Section */}
      <div className="flex-1">
        {/* Search Field */}
        <div className="custom-icon-field mb-3 flex gap-2">
          {/* <Search className="lucide-search-icon" size={18} /> */}
          <InputText
            placeholder="Enter SKU"
            className="search-input"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <Button
            icon={<Search size={16} strokeWidth={2} />}
            severity="success"
            tooltip="Search"
            tooltipOptions={{ position: 'left' }}
            value={sku}
            onClick={handleSKUFetch}
            onChange={(e) => setSku((e.target as HTMLInputElement).value)}
            disabled={!sku}
          />
        </div>

        <DataTable
          value={products}
          dataKey="id"
          showGridlines
          stripedRows
          editMode="row"
          onRowEditComplete={onRowEditComplete}
        >
          <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} style={{ maxWidth: '50px' }} />
          <Column
            field="productName"
            header="Product Name"
            editor={textEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="Price"
            header="Price"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="quantity"
            header="Quantity"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="Discount"
            header="Discount in %"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="Discount"
            header="Discount in ₹"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            field="totalPrice"
            header="Total Price"
            editor={numberEditor}
            style={{ maxWidth: '120px' }}
          />
          <Column
            rowEditor
            headerStyle={{ width: '10%', maxWidth: '100px' }}
            bodyStyle={{ textAlign: 'center' }}
          />
        </DataTable>
        <div className="mt-3">
          {/* <Button
            icon={<Plus size={16} strokeWidth={2} />}
            severity="success"
            label="Add Customer"
            onClick={() => setVisibleRight(true)}
          /> */}
        </div>
      </div>

      {/* Vertical Divider */}
      <Divider layout="vertical" />

      {/* Right Panel (Actions) */}
      <div style={{ width: '17%' }} className="flex flex-column justify-content-between">
        <div className="flex flex-column gap-2">
          <Button
            label="Add Customer"
            className="w-full p-button-primary gap-2"
            icon={<Plus size={20} />}
            onClick={() => setVisibleRight(true)}
          />

          <Button
            label="Upload Invoice"
            icon={<Upload size={20} />}
            className="w-full p-button-primary gap-2"
          />
        </div>
      </div>

      {/* Sidebar for Adding Customers */}
      <Sidebar
        visible={visibleRight}
        position="right"
        header={
          <span style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '1.2rem' }}>
            Add Customer Details
          </span>
        }
        onHide={() => setVisibleRight(false)}
        style={{ width: '50vw' }}
      >
        <POScustomers />
      </Sidebar>
    </div>
  )
}

export default POSsalesOrder
