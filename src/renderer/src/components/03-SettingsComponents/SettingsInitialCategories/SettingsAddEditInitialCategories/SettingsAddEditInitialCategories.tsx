import React, { useRef, useState } from 'react'
import {
  CategoryFormData,
  CategoryStatusOptions,
  InitialCategory,
  SettingsAddEditInitialCategoriesProps
} from './SettingsAddEditInitialCategories.interface'
import { Toast } from 'primereact/toast'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Check } from 'lucide-react'
import {
  createInitialCategory,
  updateInitialCategory,
  fetchInitialCategoryCode
} from './SettingsAddEditInitialCategories.function'

const SettingsAddEditInitialCategories: React.FC<SettingsAddEditInitialCategoriesProps> = ({
  selectedInitialCategory,
  onClose,
  reloadData
}) => {
  const toast = useRef<Toast>(null)
  const typingTimer = useRef<any>(null)

  const [formData, setFormData] = useState<CategoryFormData>({
    initialCategoryName: selectedInitialCategory?.initialCategoryName || '',
    initialCategoryCode: selectedInitialCategory?.initialCategoryCode || ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input changes
  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | CategoryStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))

    if (field === 'initialCategoryName' && !selectedInitialCategory) {
      clearTimeout(typingTimer.current)

      typingTimer.current = setTimeout(async () => {
        if (value && value.toString().trim() !== '') {
          try {
            const res = await fetchInitialCategoryCode(value.toString().trim())
            if (res.data.status) {
              setFormData((prev) => ({
                ...prev,
                initialCategoryCode: res.data.generatedCategoryCode
              }))
            }
          } catch (err) {
            console.error('Error generating code:', err)
          }
        }
      }, 500) // debounce = 500ms
    }
  }

  // Simple validation logic
  const validateForm = (): boolean => {
    if (!formData.initialCategoryName.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Category Name is required',
        life: 3000
      })
      return false
    }
    if (!formData.initialCategoryCode.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Category Code is required',
        life: 3000
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    const payload: Partial<InitialCategory> = {
      initialCategoryName: formData.initialCategoryName,
      initialCategoryCode: formData.initialCategoryCode
    }

    if (selectedInitialCategory)
      payload.initialCategoryId = selectedInitialCategory.initialCategoryId

    try {
      setIsSubmitting(true)
      const result = selectedInitialCategory
        ? await updateInitialCategory(payload)
        : await createInitialCategory(payload)

      if (result?.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: result.message || 'Operation completed successfully!',
          life: 2500
        })

        setTimeout(() => {
          onClose()
          reloadData()
        }, 1000)
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: result?.message || 'Something went wrong. Please try again.',
          life: 3000
        })
      }
    } catch (err: any) {
      let errorMessage = 'Operation Failed'

      if (err.response) {
        // Backend responded with an error
        if (err.response.status === 409) {
          errorMessage = 'Duplicate category found. Please use a different name or code.'
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.message || 'Invalid request data.'
        } else {
          errorMessage = err.response.data?.message || err.message
        }
      } else {
        // Network or unexpected error
        errorMessage = err.message || 'Network error'
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <Toast ref={toast} />
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="initialCategoryName"
              value={formData.initialCategoryName}
              className="w-full"
              onChange={(e) => handleInputChange('initialCategoryName', e.target.value)}
            />
            <label htmlFor="initialCategoryName">Initial Category Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="initialCategoryCode"
              value={formData.initialCategoryCode}
              className="w-full"
              onChange={(e) => handleInputChange('initialCategoryCode', e.target.value)}
              readOnly={!selectedInitialCategory}
            />
            <label htmlFor="initialCategoryCode">Initial Category Code</label>
          </FloatLabel>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right z-10">
        <Button
          type="submit"
          label={selectedInitialCategory ? 'Update' : 'Save'}
          icon={<Check />}
          className="p-button-primary border-none gap-2"
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </form>
  )
}

export default SettingsAddEditInitialCategories
