export interface UserRoles {
    userName:string;
    email:string;
    role:string;
   

}
export interface UserRoleTypes {
    id:number;
    rolename:string;
}

// Submodule permissions
export interface SubModulePermission {
  subModuleId: number;
  visibility: boolean;
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
}

// Module permissions (includes submodules)
export interface ModulePermission {
  moduleId: number;
  visibility: boolean;
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
  submodules: SubModulePermission[];
}

// Final payload to save role permissions
export interface RolePermissionPayload {
  roleId: number | null;  // could also use `number` if role is always set
  modules: ModulePermission[];
}
