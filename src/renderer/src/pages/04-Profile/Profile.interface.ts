export interface Employee {
  RefUserId: number;
  RefUserFName: string;
  RefUserLName: string;
  RefUserDesignation: string;
  RefUserStatus: string;
  RefUserBranchId: number;
  RefUserCustId: string;
  RefRTId: number;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  branch: string;
  city: string;
  doorNumber: string;
  streetName: string;
  state: string;
  username: string;
  email: string;
  mobile: string;
  isDelete: boolean;
  role: string;
}
