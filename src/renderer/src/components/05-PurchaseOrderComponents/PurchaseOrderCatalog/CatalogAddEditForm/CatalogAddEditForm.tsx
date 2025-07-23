import React, { useEffect, useState } from 'react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { FileUpload } from 'primereact/fileupload'
import { Button } from 'primereact/button'
import { Check } from 'lucide-react'
import { InputSwitch } from 'primereact/inputswitch'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

import { fetchCategories, fetchSubcategories, saveProduct } from './CatalogAddEditForm.function'

import { CatalogAddEditFormProps, CatalogFormData, Option } from './CatalogAddEditForm.interface'

const CatalogAddEditForm: React.FC<CatalogAddEditFormProps> = ({ selectedProduct, onSuccess }) => {
  const toast = useRef<Toast>(null)

  const [formData, setFormData] = useState<CatalogFormData>({
    name: '',
    sku: '',
    gtin: '',
    brand: '',
    category: '',
    subcategory: '',
    description: '',
    detailedDescription: '',
    price: '',
    mrp: '',
    cost: '',
    splPrice: '',
    startDate: null,
    endDate: null,
    taxClass: '',
    productImage: null,
    featured: false
  })

  const [categories, setCategories] = useState<Option[]>([])
  const [subCategories, setSubCategories] = useState<Option[]>([])

  useEffect(() => {
    if (!selectedProduct) return

    const price = parseFloat(selectedProduct.Price || '0')
    const discount = parseFloat(selectedProduct.DiscountAmount || '0')
    const cost = price + discount
    const mrp = (cost + cost * 0.1).toFixed(2)

    setFormData((prev) => ({
      ...prev,
      name: selectedProduct.ProductName,
      sku: selectedProduct.DummySKU,
      category: selectedProduct.RefCategoryID,
      subcategory: selectedProduct.RefSubCategoryID,
      price: selectedProduct.Price,
      mrp: mrp,
      cost: cost.toString()
    }))

    fetchCategories().then(setCategories).catch(console.error)
    fetchSubcategories(selectedProduct.RefCategoryID).then(setSubCategories).catch(console.error)
  }, [selectedProduct])

  const handleInputChange = (field: keyof CatalogFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: any) => {
    handleInputChange('productImage', e.files?.[0] ?? null)
  }

  const handleSave = async () => {
    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((err) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Validation Error',
          detail: err,
          life: 3000
        })
      })
      return
    }

    try {
      const payload = {
        ...formData,
        category: Number(formData.category),
        subcategory: Number(formData.subcategory)
      }

      const response = await saveProduct(payload)

      if (response.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Product saved successfully!',
          life: 2000
        })

        // 👇 Call onSuccess to close sidebar after short delay
        setTimeout(() => {
          if (typeof onSuccess === 'function') {
            onSuccess()
          }
        }, 1000)
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to save product',
          life: 3000
        })
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'API Error',
        detail: error.response?.data?.message || 'Something went wrong',
        life: 4000
      })
    }
  }

  const validateForm = (data: CatalogFormData) => {
    const errors: { [key: string]: string } = {}

    if (!data.name.trim()) errors.name = 'Product Name is required'
    if (!data.price || isNaN(Number(data.price))) errors.price = 'Valid Selling Price is required'
    if (!data.taxClass) errors.taxClass = 'Tax Class is required'

    if (data.featured) {
      if (!data.splPrice || isNaN(Number(data.splPrice)))
        errors.splPrice = 'Special Price is required'
      if (!data.startDate) errors.startDate = 'Start Date is required'
      if (!data.endDate) errors.endDate = 'End Date is required'
    }

    return errors
  }

  return (
    <div className="px-2">
      <Toast ref={toast} />

      {/* 1️⃣ Basic Product Information */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Basic Product Information</h3>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="name"
                value={formData.name}
                className="w-full"
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <label htmlFor="name">Product Name</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText id="sku" value={formData.sku} className="w-full" disabled />
              <label htmlFor="sku">SKU</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="gtin"
                value={formData.gtin}
                className="w-full"
                onChange={(e) => handleInputChange('gtin', e.target.value)}
              />
              <label htmlFor="gtin">GTIN</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="brand"
                value={formData.brand}
                className="w-full"
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />
              <label htmlFor="brand">Brand</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                value={formData.category}
                options={categories}
                className="w-full"
                disabled
              />
              <label htmlFor="category">Category</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                value={formData.subcategory}
                options={subCategories}
                className="w-full"
                disabled
              />
              <label htmlFor="subcategory">Subcategory</label>
            </FloatLabel>
          </div>
        </div>
      </section>

      {/* 2️⃣ Pricing & Tax Information */}
      <section className="mt-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Pricing & Tax Information</h3>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="price"
                value={formData.price}
                className="w-full"
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
              <label htmlFor="price">Selling Price</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText id="mrp" value={formData.mrp} className="w-full" disabled />
              <label htmlFor="mrp">MRP (auto-calculated)</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText id="cost" value={formData.cost} className="w-full" disabled />
              <label htmlFor="cost">Cost Price</label>
            </FloatLabel>
          </div>
          <div className="flex-1 flex align-items-center gap-3">
            <span>Enable Special Price</span>
            <InputSwitch
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.value)}
            />
          </div>
        </div>

        <Divider className="" />

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="taxClass"
                value={formData.taxClass}
                options={[
                  { label: 'GST 0%', value: 'GST_0' },
                  { label: 'GST 2%', value: 'GST_2' },
                  { label: 'GST 5%', value: 'GST_5' },
                  { label: 'GST 12%', value: 'GST_12' },
                  { label: 'GST 18%', value: 'GST_18' }
                ]}
                onChange={(e) => handleInputChange('taxClass', e.value)}
                className="w-full"
                placeholder="Select Tax Class"
              />
              <label htmlFor="taxClass">Tax Class</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="splPrice"
                value={formData.splPrice}
                className="w-full"
                disabled={!formData.featured}
                onChange={(e) => handleInputChange('splPrice', e.target.value)}
              />
              <label htmlFor="splPrice">Special Price</label>
            </FloatLabel>
          </div>
        </div>
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.value)}
                dateFormat="yy-mm-dd"
                disabled={!formData.featured}
                className="w-full"
                showIcon
              />
              <label htmlFor="startDate">Start Date</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                id="endDate"
                value={formData.endDate}
                disabled={!formData.featured}
                onChange={(e) => handleInputChange('endDate', e.value)}
                dateFormat="yy-mm-dd"
                className="w-full"
                showIcon
              />
              <label htmlFor="endDate">End Date</label>
            </FloatLabel>
          </div>
        </div>
      </section>

      {/* Media Upload */}
      <section className="mt-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">3. Media / Uploads</h3>
        <FileUpload
          name="productImage"
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          auto
          chooseLabel="Upload Product Image (Optional)"
          customUpload
          uploadHandler={handleImageUpload}
        />
      </section>

      {/* Save Button */}
      <div className="mt-3 flex justify-content-end">
        <Button
          label="Save Product"
          severity="success"
          icon={<Check />}
          className="gap-2"
          onClick={handleSave}
        />
      </div>
    </div>
  )
}

export default CatalogAddEditForm
