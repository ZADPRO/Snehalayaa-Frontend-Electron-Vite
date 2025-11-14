import React, { useRef, useEffect, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { X } from 'lucide-react'
import { Branch } from '../InventoryCreateNewStock.interface'
import { fetchProducts, formatINRCurrency } from './InventoryCreateNewProductForStock.function'

interface Props {
  fromAddress: Branch | null
  toAddress: Branch | null
  onAdd: (data: any) => void
  onClose: () => void
  onTotalChange?: (total: number) => void
  productToEdit?: any
}

const InventoryCreateNewProductForStock: React.FC<Props> = ({
  fromAddress,
  toAddress,
  onAdd,
  onClose,
  onTotalChange
}) => {
  const toast = useRef<Toast>(null)
  const scannerRef = useRef<HTMLInputElement>(null)
  const [products, setProducts] = useState<any[]>([])
  // const [manualSKU, setManualSKU] = useState('')

  // Focus scanner input on mount
  useEffect(() => {
    scannerRef.current?.focus()
  }, [])

  // Shared function to add product by SKU
  const addProductBySKU = async (sku: string) => {
    if (!sku || !fromAddress?.refBranchId) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Info',
        detail: 'Branch or SKU missing'
      })
      return
    }

    try {
      const res = await fetchProducts(fromAddress.refBranchId, sku)
      if (res.status) {
        setProducts((prev) => {
          if (prev.some((p) => p.SKU === res.data.SKU)) {
            toast.current?.show({
              severity: 'warn',
              summary: 'Duplicate SKU',
              detail: sku
            })
            return prev
          }
          const updated = [...prev, res.data]
          const total = updated.reduce((sum, p) => sum + Number(p.unitPrice || 0), 0)
          onTotalChange?.(total)
          return updated
        })
        toast.current?.show({ severity: 'success', summary: 'Product Added', detail: sku })
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: res.message || 'SKU not found'
        })
      }
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' })
    }
  }

  // Scanner input handler
  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const sku = e.currentTarget.value.trim()
      addProductBySKU(sku)
      e.currentTarget.value = ''
    }
  }

  // Manual input enter key handler
  // const handleManualEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     addProductBySKU(manualSKU.trim())
  //     setManualSKU('')
  //   }
  // }

  // // Manual Add button handler
  // const handleAddManualSKU = () => {
  //   addProductBySKU(manualSKU.trim())
  //   setManualSKU('')
  // }

  // Delete product from table
  const handleDelete = (sku: string) => {
    const updated = products.filter((p) => p.SKU !== sku)
    setProducts(updated)
    const total = updated.reduce((sum, p) => sum + Number(p.unitPrice || 0), 0)
    onTotalChange?.(total)
    scannerRef.current?.focus()
  }

  // Add Products button handler
  const handleAddProductsClick = () => {
    if (products.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Products',
        detail: 'No data found to transfer'
      })
      scannerRef.current?.focus()
      return
    }
    onAdd(products)
  }

  return (
    <div className="flex flex-column gap-3">
      <Toast ref={toast} />

      {/* Hidden input for scanner */}
      <input
        ref={scannerRef}
        type="text"
        onKeyDown={handleScan}
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
        autoFocus
      />

      {/* Branch details */}
      <div className="grid mb-2">
        <div className="col-6 p-3 surface-100">
          <p className="mb-3">From Branch Details</p>
          <div>
            <strong>
              {fromAddress?.refBranchName || 'N/A'} : {fromAddress?.refBranchCode || 'N/A'}
            </strong>
          </div>
          <div className="mt-1">
            <strong>Location:</strong> {fromAddress?.refLocation || 'N/A'}
          </div>
        </div>
        <div className="col-6 p-3 surface-100">
          <p className="mb-3">To Branch Details</p>
          <div>
            <strong>
              {toAddress?.refBranchName || 'N/A'} : {toAddress?.refBranchCode || 'N/A'}
            </strong>
          </div>
          <div className="mt-1">
            <strong>Location:</strong> {toAddress?.refLocation || 'N/A'}
          </div>
        </div>
      </div>

      {/* Manual SKU input */}
      {/* <div className="flex gap-2 align-items-center mb-3">
        <input
          type="text"
          placeholder="Enter SKU manually"
          value={manualSKU}
          onChange={(e) => setManualSKU(e.target.value)}
          onKeyDown={handleManualEnter}
          className="p-inputtext p-component"
        />
        <Button label="Add SKU" className="p-button-primary" onClick={handleAddManualSKU} />
      </div> */}

      {/* Action buttons */}
      <div className="flex justify-content-between align-items-center gap-2 mb-3">
        <p>Scan SKU to Transfer Products</p>
        <div className="flex gap-3">
          <Button label="Close" className="p-button-secondary" onClick={onClose} />
          <Button
            label="Add Products"
            className="p-button-primary"
            onClick={handleAddProductsClick}
          />
        </div>
      </div>

      {/* Scanned/added products DataTable */}
      <DataTable value={products} showGridlines responsiveLayout="scroll">
        <Column field="SKU" header="SKU" />
        <Column field="productName" header="Product Name" />
        <Column
          field="unitPrice"
          header="Unit Price"
          body={(row) => formatINRCurrency(row.unitPrice)}
        />
        <Column field="quantity" header="Quantity" />
        <Column
          field="totalAmount"
          header="Total"
          body={(row) => formatINRCurrency(row.totalAmount)}
        />
        <Column
          header="Actions"
          body={(row) => (
            <Button
              icon={<X />}
              className="p-button-danger"
              onClick={() => handleDelete(row.SKU)}
            />
          )}
        />
      </DataTable>
    </div>
  )
}

export default InventoryCreateNewProductForStock
