import React, { useEffect, useState, useRef } from 'react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { FileUpload } from 'primereact/fileupload'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Check } from 'lucide-react'

import {
  fetchAttribute,
  fetchCategories,
  fetchSubcategories,
  saveProduct
} from './CatalogAddEditForm.function'
import {
  CatalogAddEditFormProps,
  Attribute,
  Option,
  CatalogFormData
} from './CatalogAddEditForm.interface'

const CatalogAddEditForm: React.FC<CatalogAddEditFormProps> = ({ selectedProduct, onSuccess }) => {
  const toast = useRef<Toast>(null)

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [formData, setFormData] = useState<Partial<CatalogFormData>>({})

  const [categories, setCategories] = useState<Option[]>([])
  const [subCategories, setSubCategories] = useState<Option[]>([])

  const loadAttributes = async () => {
    try {
      const data = (await fetchAttribute()) as unknown as Attribute[]
      setAttributes(data)

      const initialData: { [key: string]: any } = {}
      data.forEach((attr) => {
        if (attr.data_type === 'IMAGE') initialData[attr.column_name] = []
        else initialData[attr.column_name] = ''
      })

      if (selectedProduct) {
        data.forEach((attr) => {
          const key = attr.column_name
          if (selectedProduct[key] !== undefined) {
            initialData[key] = selectedProduct[key]
          }
        })
      }

      setFormData(initialData)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load attributes',
        life: 3000
      })
    }
  }

  useEffect(() => {
    loadAttributes()
    fetchCategories().then(setCategories).catch(console.error)
    if (selectedProduct?.category) {
      fetchSubcategories(selectedProduct.category).then(setSubCategories).catch(console.error)
    }
  }, [selectedProduct])

  // Handle input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle image upload (multiple)
  const handleImageUpload = (field: string, files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ...files]
    }))
  }

  // Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    attributes.forEach((attr) => {
      const value = formData[attr.column_name]
      if (attr.is_required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[attr.column_name] = `${attr.column_label} is required`
        }
      }
    })
    return errors
  }

  const handleSave = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((err) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Validation Error',
          detail: err,
          life: 3000
        })
      })
      return
    }

    // Fill missing fields with default values
    const completeFormData: CatalogFormData = {
      name: formData.name || '',
      sku: formData.sku || '',
      gtin: formData.gtin || '',
      brand: formData.brand || '',
      category: formData.category || 0,
      subcategory: formData.subcategory || 0,
      description: formData.description || '',
      detailedDescription: formData.detailedDescription || '',
      price: formData.price || '',
      mrp: formData.mrp || '',
      cost: formData.cost || '',
      splPrice: formData.splPrice || '',
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      taxClass: formData.taxClass || '',
      productImage: formData.productImage || null,
      featured: formData.featured ?? false
    }

    try {
      const response = await saveProduct(completeFormData)
      // ... rest of code

      if (response.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Product saved successfully!',
          life: 2000
        })
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 1000)
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to save product',
          life: 3000
        })
      }
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'API Error',
        detail: err.response?.data?.message || 'Something went wrong',
        life: 4000
      })
    }
  }

  // Helper to get dropdown options dynamically
  const getDropdownOptions = (field: string) => {
    if (field === 'category') return categories
    if (field === 'sub_category') return subCategories
    return []
  }

  return (
    <div className="px-2">
      <Toast ref={toast} />

      {attributes.map((attr) => (
        <div key={attr.id} className="flex gap-3 mb-3">
          {attr.data_type === 'TEXT' && (
            <FloatLabel className="always-float">
              <InputText
                value={formData[attr.column_name]}
                className="w-full"
                onChange={(e) => handleInputChange(attr.column_name, e.target.value)}
              />
              <label>{attr.column_label}</label>
            </FloatLabel>
          )}

          {attr.data_type === 'TEXTAREA' && (
            <FloatLabel className="always-float">
              <InputTextarea
                value={formData[attr.column_name]}
                className="w-full"
                onChange={(e) => handleInputChange(attr.column_name, e.target.value)}
              />
              <label>{attr.column_label}</label>
            </FloatLabel>
          )}

          {attr.data_type === 'INT' && (
            <FloatLabel className="always-float">
              <InputNumber
                value={formData[attr.column_name]}
                onValueChange={(e) => handleInputChange(attr.column_name, e.value)}
                className="w-full"
              />
              <label>{attr.column_label}</label>
            </FloatLabel>
          )}

          {attr.data_type === 'DATE' && (
            <FloatLabel className="always-float">
              <Calendar
                value={formData[attr.column_name]}
                onChange={(e) => handleInputChange(attr.column_name, e.value)}
                dateFormat="yy-mm-dd"
                className="w-full"
                showIcon
              />
              <label>{attr.column_label}</label>
            </FloatLabel>
          )}

          {attr.data_type === 'DROPDOWN' && (
            <FloatLabel className="always-float">
              <Dropdown
                value={formData[attr.column_name]}
                options={getDropdownOptions(attr.column_name)}
                onChange={(e) => handleInputChange(attr.column_name, e.value)}
                className="w-full"
                placeholder={`Select ${attr.column_label}`}
              />
              <label>{attr.column_label}</label>
            </FloatLabel>
          )}

          {attr.data_type === 'IMAGE' && (
            <FileUpload
              name={attr.column_name}
              mode="basic"
              accept="image/*"
              maxFileSize={2000000}
              customUpload
              multiple
              chooseLabel={`Upload ${attr.column_label}`}
              uploadHandler={(e) => handleImageUpload(attr.column_name, e.files)}
            />
          )}
        </div>
      ))}

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
