export interface Branch {
  refBranchId: number;
  refBranchName: string;
  isActive: boolean;
}

export interface Supplier {
  supplierId: number;
  supplierCompanyName: string;
  supplierIsActive: string;
}

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

