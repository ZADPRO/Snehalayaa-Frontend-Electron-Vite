import axios from 'axios'
import { baseURL } from '../../utils/helper'
import { Employee } from './Profile.interface'

// export const fetchEmployees  = async (): Promise<Employee[]> => {
//   const response = await axios.get(`${baseURL}/admin/settings/getEmployees`, {

//       headers: {
//           Authorization: localStorage.getItem('token') || ''
//         }
//     })
//     // const employeeData = response?.data?.data;
//     // console.log('employeeData', employeeData)
//   console.log('response', response)

//   if (response.data?.status) {
//     return response.data.data
//   } else {
//     throw new Error(response.data.message || 'Failed to fetch Employees')
//   }
// }

export const fetchEmployees = async (): Promise<Employee> => {
  const response = await axios.get(`${baseURL}/admin/settings/getEmployees`, {
    headers: {
      Authorization: localStorage.getItem('token') || ''
    }
  })

  const employeeData = response?.data?.data
  console.log('employeeData', employeeData)

  if (response.data?.status) {
    return employeeData // directly return the single employee object
  } else {
    throw new Error(response.data.message || 'Failed to fetch Employee')
  }
}
