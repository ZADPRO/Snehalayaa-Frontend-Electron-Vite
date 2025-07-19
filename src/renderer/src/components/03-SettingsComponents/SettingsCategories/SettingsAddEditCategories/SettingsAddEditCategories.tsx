import React, { useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { createCategory, updateCategory } from './SettingsAddEditCategories.function'
import {
  Category,
  CategoryFormData,
  CategoryStatusOptions,
  SettingsAddEditCategoriesProps
} from './SettingsAddEditCategories.interface'

const SettingsAddEditCategories: React.FC<SettingsAddEditCategoriesProps> = ({
  selectedCategory,
  onClose,
  reloadData
}) => {
  const toast = useRef<Toast>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    categoryCode: '',
    selectedStatus: { name: 'Active', isActive: true },
    profitMargin: ''
  })

  const statusOptions: CategoryStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'Inactive', isActive: false }
  ]

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        categoryName: selectedCategory.categoryName,
        categoryCode: selectedCategory.categoryCode,
        selectedStatus: selectedCategory.isActive
          ? { name: 'Active', isActive: true }
          : { name: 'Inactive', isActive: false },
        profitMargin: selectedCategory.profitMargin?.toString() || ''
      })
    }
  }, [selectedCategory])

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | CategoryStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.categoryName || !formData.categoryCode || !formData.selectedStatus) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields',
        life: 3000
      })
      return
    }

    const payload: Partial<Category> = {
      categoryName: formData.categoryName,
      categoryCode: formData.categoryCode,
      isActive: formData.selectedStatus.isActive,
      profitMargin: parseFloat(formData.profitMargin || '0')
    }

    if (selectedCategory) payload.refCategoryId = selectedCategory.refCategoryId

    try {
      setIsSubmitting(true)

      const result = selectedCategory
        ? await updateCategory(payload)
        : await createCategory(payload)

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: result.message || 'Operation successful',
        life: 3000
      })

      onClose()
      reloadData()
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Operation failed',
        life: 3000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-3">
      <Toast ref={toast} />
      <div className="flex gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="categoryName"
              value={formData.categoryName}
              className="w-full"
              onChange={(e) => handleInputChange('categoryName', e.target.value)}
            />
            <label htmlFor="categoryName">Category Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="categoryCode"
              value={formData.categoryCode}
              className="w-full"
              onChange={(e) => handleInputChange('categoryCode', e.target.value)}
            />
            <label htmlFor="categoryCode">Category Code</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="status"
              value={formData.selectedStatus}
              onChange={(e: DropdownChangeEvent) => handleInputChange('selectedStatus', e.value)}
              options={statusOptions}
              optionLabel="name"
              className="w-full"
            />
            <label htmlFor="status">Status</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="profitMargin"
              keyfilter="pint"
              value={formData.profitMargin}
              className="w-full"
              onChange={(e) => handleInputChange('profitMargin', e.target.value)}
            />
            <label htmlFor="profitMargin">Profit Margin (%)</label>
          </FloatLabel>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right z-10">
        <Button
          label={selectedCategory ? 'Update' : 'Save'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}

export default SettingsAddEditCategories
