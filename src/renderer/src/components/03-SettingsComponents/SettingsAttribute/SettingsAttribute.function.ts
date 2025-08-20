import axios from 'axios'
import { baseURL } from '../../../utils/helper'
import { Attribute, AttributePayload, dataType } from './SettingsAttribute.interface'

export const saveAttributeAPI = async (payload: AttributePayload) => {
  const response = await axios.post(`${baseURL}/admin/settings/attributes`, payload, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to save attribute')
  }
}

export const fetchDataType = async (): Promise<dataType[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/attributesDataType`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch dataType')
  }
}

export const fetchAttribute = async (): Promise<Attribute[]> => {
  const response = await axios.get(`${baseURL}/admin/settings/attributes`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  if (response.data?.status) {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Failed to fetch dataType')
  }
}

export const updateAttributeAPI = async (payload: AttributePayload) => {
  try {
    const response = await axios.put(`${baseURL}/admin/settings/attributes`, payload, {
      headers: {
        Authorization: localStorage.getItem('token') || ''
      }
    })
    console.log('response', response)

    if (response.data?.status) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to update attribute')
    }
  } catch (error: any) {
    throw new Error(error.message || 'API request failed')
  }
}



export const deleteAttributeAPI = async (attributeId: number) => {
  console.log('attributeId', attributeId)
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    console.log('🔑 Sending token:', token) // debug

    const response = await axios.post(
      `${baseURL}/admin/settings/attributesHide`,
      { attributeId },
      {
        headers: {
          Authorization: `${token}`, // 👈 add Bearer
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data?.status) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to delete attribute')
    }
  } catch (error: any) {
    throw new Error(error.message || 'API request failed')
  }
}
