import axios from "axios"
import { AddCustomerPayload } from "./POScustomers.interface"
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



export const addCustomer = async (payload: AddCustomerPayload): Promise<any> => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/pos/customer`,
      payload,
      {
        headers: {
          Authorization: localStorage.getItem('token') || ''
        }
      }
    )
    console.log('response', response)
    return response.data
  } catch (error) {
    console.error('❌ Error adding customer:', error)
    throw error
  }
}
