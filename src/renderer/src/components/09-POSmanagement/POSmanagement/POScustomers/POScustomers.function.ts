import axios from "axios"
import { CustomerPayload } from "./POScustomers.interface"
import { baseURL } from "../../../../utils/helper"

export const fetchCustomerByMobile = async (mobile: string) => {
  // Simulate fetching customer from API or DB
  const dummyDB = {
    '1234567890': {
      refCustomerName: 'John Doe',
      refAddress: '123 Main Street',
      refCity: 'Chennai',
      refPincode: '600001',
      refState: 'Tamil Nadu',
      refCountry: 'India',
      refMembershipNumber: 'M123',
      refTaxNumber: 'TX1234'
    }
  }
  return new Promise((resolve) =>
    setTimeout(() => resolve(dummyDB[mobile] ?? null), 500)
  )
}


export const addNewCustomer = async (payload: CustomerPayload): Promise<any> => {
  try {
    const res = await axios.post(`${baseURL}/customers/`, payload, {
      headers: {
        Authorization: localStorage.getItem('token') || ''
      }
    })

    console.log('Response:', res)
    return res.data
  } catch (error) {
    console.error('Add customer error:', error)
    throw error
  }
}
