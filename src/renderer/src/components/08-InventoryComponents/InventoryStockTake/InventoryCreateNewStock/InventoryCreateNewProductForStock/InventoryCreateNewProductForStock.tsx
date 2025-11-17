import React, { useRef, useEffect, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { X } from 'lucide-react'
import { Branch } from '../InventoryCreateNewStock.interface'
import { fetchProducts, formatINRCurrency } from './InventoryCreateNewProductForStock.function'
import { Dialog } from 'primereact/dialog'

interface Props {
  fromAddress: Branch | null
  toAddress: Branch | null
  onAdd: (data: any) => void
  onClose: () => void
  onTotalChange?: (total: number) => void
  productToEdit?: any
}

interface ConfirmDialogState {
  visible: boolean
  product: any | null
  branchName: string
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
  const [manualSKU, setManualSKU] = useState('')

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    visible: false,
    product: null,
    branchName: ''
  })

  // Focus scanner input on mount
  useEffect(() => {
    scannerRef.current?.focus()
  }, [])

  const handleAddToTable = (product: any) => {
    setProducts((prev) => {
      if (prev.some((p) => p.SKU === product.SKU)) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Duplicate SKU',
          detail: product.SKU
        })
        return prev
      }

      const updated = [...prev, product]
      const total = updated.reduce((sum, p) => sum + Number(p.unitPrice || 0), 0)
      onTotalChange?.(total)
      return updated
    })
  }

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

      if (!res.status) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: res.message
        })
        return
      }

      // CASE 1: Product in this branch
      if (res.isPresent) {
        handleAddToTable(res.data)
        toast.current?.show({
          severity: 'success',
          summary: 'Product Added',
          detail: sku
        })
      }

      // CASE 2: Product found in another branch
      else {
        setConfirmDialog({
          visible: true,
          product: res.data,
          branchName: res.branchName // ALWAYS string now
        })
      }
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong'
      })
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

  const handleManualEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addProductBySKU(manualSKU.trim())
      setManualSKU('')
    }
  }

  const handleAddManualSKU = () => {
    addProductBySKU(manualSKU.trim())
    setManualSKU('')
  }

  const handleDelete = (sku: string) => {
    const updated = products.filter((p) => p.SKU !== sku)
    setProducts(updated)
    const total = updated.reduce((sum, p) => sum + Number(p.unitPrice || 0), 0)
    onTotalChange?.(total)
    scannerRef.current?.focus()
  }

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

      <input
        ref={scannerRef}
        type="text"
        onKeyDown={handleScan}
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
        autoFocus
      />

      <Dialog
        header="Product Not Found in Branch"
        visible={confirmDialog.visible}
        style={{ width: '450px' }}
        modal
        onHide={() => setConfirmDialog({ visible: false, product: null, branchName: '' })}
      >
        <p>
          The product exists but <strong>not in this branch</strong>.
        </p>
        <p>
          It is available in: <strong>{confirmDialog.branchName}</strong>
        </p>

        <p>Are you sure you want to proceed?</p>

        <div className="flex justify-content-end gap-3 mt-4">
          <Button
            label="Cancel"
            className="p-button-secondary"
            onClick={() => setConfirmDialog({ visible: false, product: null, branchName: '' })}
          />

          <Button
            label="Proceed Anyway"
            className="p-button-danger"
            onClick={() => {
              handleAddToTable(confirmDialog.product)
              setConfirmDialog({ visible: false, product: null, branchName: '' })
            }}
          />
        </div>
      </Dialog>

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
      <div className="flex gap-2 align-items-center mb-3">
        <input
          type="text"
          placeholder="Enter SKU manually"
          value={manualSKU}
          onChange={(e) => setManualSKU(e.target.value)}
          onKeyDown={handleManualEnter}
          className="p-inputtext p-component"
        />
        <Button label="Add SKU" className="p-button-primary" onClick={handleAddManualSKU} />
      </div>

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

      {/* <Dialog
        header="Product Not Found in Branch"
        visible={confirmDialog.visible}
        style={{ width: '450px' }}
        modal
        onHide={() => setConfirmDialog({ visible: false, product: null, branchName: '' })}
      >
        <p>
          The product exists but <strong>not in this branch</strong>.
        </p>
        <p>
          It is available in: <strong>{confirmDialog.branchName}</strong>
        </p>

        <p>Are you sure you want to proceed with transferring this product?</p>

        <div className="flex justify-content-end gap-3 mt-4">
          <Button
            label="Cancel"
            className="p-button-secondary"
            onClick={() => setConfirmDialog({ visible: false, product: null, branchName: '' })}
          />

          <Button
            label="Proceed Anyway"
            className="p-button-danger"
            onClick={() => {
              handleAddToTable(confirmDialog.product)
              setConfirmDialog({ visible: false, product: null, branchName: '' })
            }}
          />
        </div>
      </Dialog> */}
    </div>
  )
}

export default InventoryCreateNewProductForStock
