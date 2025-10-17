export interface InitialCategory {
  initialCategoryId: number
  initialCategoryName: string
  initialCategoryCode: string
  isDelete: boolean
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

export interface CategoryStatusOptions {
  name: string
  isActive: boolean
}

export interface CategoryFormData {
  initialCategoryName: string
  initialCategoryCode: string
}

export interface SettingsAddEditInitialCategoriesProps {
  selectedInitialCategory?: InitialCategory | null
  onClose: () => void
  reloadData: () => void
}
