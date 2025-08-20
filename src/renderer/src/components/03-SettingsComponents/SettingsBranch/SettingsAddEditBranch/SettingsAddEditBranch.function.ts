import axios from 'axios'
import { baseURL, baseURLV2 } from '../../../../utils/helper'
import { Branch } from '../SettingsBranch.interface'

export const createBranch = async (payload: Partial<Branch>) => {
  const response = await axios.post(`${baseURLV2}/admin/settings/branches`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  console.log('response.data', response.data)
  return response.data
}

export const updateBranch   = async (payload: Partial<Branch>) => {
  const response = await axios.put(`${baseURL}/admin/settings/branches`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })
  console.log('response.data', response.data)
  return response.data
}