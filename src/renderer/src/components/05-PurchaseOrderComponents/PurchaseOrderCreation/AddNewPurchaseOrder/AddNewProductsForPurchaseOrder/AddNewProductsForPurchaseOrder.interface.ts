export interface Category {
  refCategoryId: number;
  categoryName: string;
}

export interface SubCategory {
  refSubCategoryId: number;
  subCategoryName: string;
  refCategoryId: number;
  isDelete: boolean;
}

