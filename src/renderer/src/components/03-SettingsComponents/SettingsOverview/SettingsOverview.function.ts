import axios from 'axios'
import { baseURL } from '../../../utils/helper'
import { SettingsOverview } from './SettingsOverview.interface'




export const fetchDashboardData = async (): Promise<SettingsOverview> => {
  const response = await axios.get(`${baseURL}/admin/settings/overview`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  });
  console.log('response', response)
  
  // Extract only the data part that matches SettingsOverview
  const dashboardData: SettingsOverview = response.data?.data;

  console.log('Dashboard data:', dashboardData);

  return dashboardData;
};
