import { Hand } from 'lucide-react'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Tooltip } from 'primereact/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { Floor, Products, Section } from './InventoryProducts.interface'
import {
  fetchFloor,
  fetchSection,
  saveAcceptProducts
} from './InventoryProducts.function'
import { Dialog } from 'primereact/dialog'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'

const InventoryProducts: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [selectedProduct, setSelectedProduct] = useState<Products[]>([])
  const [products, setProduct] = useState<Products[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [floor, setFloor] = useState<Floor[]>([])
  const [section, setSection] = useState<Section[]>([])

  const isAnySelected = selectedProduct.length > 0

  const [formData, setFormData] = useState({
    floorId: null as number | null,
    sectionId: null as number | null
  })

  // Load Products
  // Load Products from localStorage
  const loadProducts = () => {
    try {
      const storedData = localStorage.getItem('inventoryData')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setProduct(parsedData)
      } else {
        setProduct([]) // empty if nothing in localStorage
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to load Products from localStorage',
        life: 3000
      })
    }
  }

  // On mount, load products
  useEffect(() => {
    loadProducts()
  }, [])

  // Load dropdowns
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [floorDataRaw, sectionDataRaw] = await Promise.all([fetchFloor(), fetchSection()])

        const floorData: Floor[] = floorDataRaw.map((item: any) => ({
          floorId: item.floorId ?? 0,
          floorName: item.floorName ?? ''
        }))

        const sectionData: Section[] = sectionDataRaw.map((item: any) => ({
          floorId: item.floorId ?? 0,
          sectionId: item.sectionId ?? 0,
          sectionName: item.sectionName ?? ''
        }))

        setFloor(floorData)
        setSection(sectionData)
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch dropdown data',
          life: 3000
        })
      }
    }
    loadDropdownData()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [])

  // Handle Submit
  const handleSubmit = async () => {
    if (!isAnySelected || !formData.floorId || !formData.sectionId) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields',
        life: 3000
      })
      return
    }

    const payload = {
      productId: selectedProduct.map((p) => p.refPtId),
      floorId: formData.floorId,
      sectionId: formData.sectionId
    }

    try {
      setIsSubmitting(true)
      const result: any = await saveAcceptProducts(payload)

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: result.message || 'Operation successful',
        life: 3000
      })
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Operation failed',
        life: 3000
      })
    } finally {
      setIsSubmitting(false)
      setShowDialog(false)
    }
  }

  // Toolbar button
  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Hand size={16} strokeWidth={2} />}
        label="Move"
        tooltip="Move"
        tooltipOptions={{ position: 'left' }}
        className="flex gap-2"
        disabled={!isAnySelected}
        onClick={() => setShowDialog(true)}
        loading={isSubmitting}
      />
    </div>
  )

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar className="mb-2" right={rightToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      {/* DataTable Section */}
      <DataTable
        value={products}
        selection={selectedProduct}
        onSelectionChange={(e) => setSelectedProduct(e.value as Products[])}
        dataKey="SKU"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
        scrollable
      >
        <Column selectionMode="multiple" style={{ minWidth: '3rem' }} />
        <Column field="S.No" header="SNo" style={{ minWidth: '3rem' }} />
        <Column field="ProductName" header="Product Name" style={{ minWidth: '13rem' }} />
        <Column field="SKU" header="SKU" style={{ minWidth: '12rem' }} />
        <Column field="ProductType" header="Product Type" style={{ minWidth: '13rem' }} />
        <Column field="Category" header="Category" style={{ minWidth: '10rem' }} />
        <Column field="SubCategory" header="Sub Category" style={{ minWidth: '13rem' }} />
        <Column field="Fabric" header="Fabric" />
        <Column field="SellingPrice" header="Selling Price" style={{ minWidth: '13rem' }} />
        <Column field="CostPrice" header="Cost Price" style={{ minWidth: '13rem' }} />
        <Column field="Discount" header="Discount (%)" style={{ minWidth: '13rem' }} />
      </DataTable>

      {/* Move Dialog */}
      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '500px' }}>
        <p>
          <strong>Branch Name: </strong>Main Branch 04
        </p>

        <div className="mt-5 w-full">
          <FloatLabel className="always-float">
            <Dropdown
              id="floor"
              value={formData.floorId}
              options={floor}
              optionLabel="floorName"
              optionValue="floorId"
              onChange={(e) => setFormData({ ...formData, floorId: e.value })}
              className="w-full"
              placeholder="Select Floor"
            />
            <label htmlFor="floor">Floor</label>
          </FloatLabel>
        </div>

        <div className="mt-3 mb-3 w-full">
          <FloatLabel className="always-float">
            <Dropdown
              id="section"
              value={formData.sectionId}
              options={section}
              optionLabel="sectionName"
              optionValue="sectionId"
              onChange={(e) => setFormData({ ...formData, sectionId: e.value })}
              className="w-full"
              placeholder="Select Section"
            />
            <label htmlFor="section">Section</label>
          </FloatLabel>
        </div>

        <div className="flex justify-content-center gap-2">
          <Button label="Cancel" severity="secondary" onClick={() => setShowDialog(false)} />
          <Button label="Save" severity="success" onClick={handleSubmit} loading={isSubmitting} />
        </div>
      </Dialog>
    </div>
  )
}

export default InventoryProducts
