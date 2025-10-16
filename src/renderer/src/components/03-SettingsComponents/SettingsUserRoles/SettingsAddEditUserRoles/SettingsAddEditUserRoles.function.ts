import { UserRoleTypes } from "../SettingsUserRoles.interface";
import axios from 'axios'
import { baseURL } from '../../../../utils/helper'
import { RolePermissionPayload } from "./SettingsAddEditUserRoles.interface";
export interface SubModule {
  submoduleId: number;
  subModuleName: string;
  visibility: any;
  add: any;
  edit: any;
  view: any;
  delete: any;
}

export interface Module {
  moduleId: number;
  moduleName: string;
  visibility: any;
  add: any;
  edit: any;
  view: any;
  delete: any;
  submodule: SubModule[];
}

// Dummy API function
export const fetchModule = async (): Promise<Module[]> => {
  return [
    {
      moduleId: 1,
      moduleName: 'Dashboard',
      visibility: null,
      add: null,
      edit: null,
      view: null,
      delete: null,
      submodule: []
    },
    {
      moduleId: 2,
      moduleName: 'Inventory',
      visibility: null,
      add: null,
      edit: null,
      view: null,
      delete: null,
      submodule: [
        { submoduleId: 1, subModuleName: 'Stock Take', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 2, subModuleName: 'Stock Return', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 3, subModuleName: 'Inventory Tracker', visibility: null, add: null, edit: null, view: null, delete: null }
      ]
    },
    {
      moduleId: 3,
      moduleName: 'POS Management',
      visibility: null,
      add: null,
      edit: null,
      view: null,
      delete: null,
      submodule: [
        { submoduleId: 4, subModuleName: 'Sales Order', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 5, subModuleName: 'Sales Return', visibility: null, add: null, edit: null, view: null, delete: null }
      ]
    },
    {
      moduleId: 4,
      moduleName: 'Purchase Order',
      visibility: null,
      add: null,
      edit: null,
      view: null,
      delete: null,
      submodule: [
        { submoduleId: 6, subModuleName: 'Purchase Order', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 7, subModuleName: 'Create PO', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 8, subModuleName: 'Products', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 9, subModuleName: 'Rejected Products', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 10, subModuleName: 'Barcode Creation', visibility: null, add: null, edit: null, view: null, delete: null }
      ]
    },
    {
      moduleId: 5,
      moduleName: 'Settings',
      visibility: null,
      add: null,
      edit: null,
      view: null,
      delete: null,
      submodule: [
        { submoduleId: 11, subModuleName: 'Categories', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 12, subModuleName: 'Sub Categories', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 13, subModuleName: 'Branches', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 14, subModuleName: 'Suppliers', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 15, subModuleName: 'User Roles', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 16, subModuleName: 'Attributes', visibility: null, add: null, edit: null, view: null, delete: null },
        { submoduleId: 17, subModuleName: 'Employees', visibility: null, add: null, edit: null, view: null, delete: null }
      ]
    }
  ];
};


export const fetchRoleType = async (): Promise<UserRoleTypes[]> => {
  // Dummy role type data
  return [
    { id: 1, rolename: 'Super Admin' },
    { id: 2, rolename: 'Admin' },
    { id: 3, rolename: 'Accounts Manager' },
    { id: 4, rolename: 'Store Manager' },
    { id: 5, rolename: 'Purchase Manager' },
    { id: 6, rolename: 'Billing Executive' },
    { id: 7, rolename: 'Sales Executive' },
    { id: 8, rolename: 'SEO' },
    { id: 9, rolename: 'Customer Support' },
    { id: 10, rolename: 'Supplier' },
    { id: 11, rolename: 'Customer' }
  ];
};



export const saveUserRoles = async (payload: RolePermissionPayload): Promise<boolean> => {
  const response = await axios.post(
    `${baseURL}/admin/settings/userRoles`,   
    payload,
    {
      headers: {
        Authorization: localStorage.getItem('token') || '',
        'Content-Type': 'application/json'
      }
    }
  );

  if (response.data?.status) {
    return true; // or you could return response.data if you need more info
  } else {
    throw new Error(response.data?.message || 'Failed to save User Roles');
  }
};