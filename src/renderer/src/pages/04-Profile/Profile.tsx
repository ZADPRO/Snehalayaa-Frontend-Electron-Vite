import React, { useEffect, useRef, useState } from 'react'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import './Profile.css'
import backgroundImage from '../../assets/profile/BG-1.jpg'
import profileImage from '../../assets/profile/profile.png'
import { Divider } from 'primereact/divider'
import { PencilLine } from 'lucide-react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { fetchEmployees, updateEmployeeProfile } from './Profile.function'
import { Employee } from './Profile.interface'
import { Toast } from 'primereact/toast'

const Profile: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    streetName: '',
    city: '',
    state: '',
    RefUserFName: '',
    RefUserLName: '',
    doorNumber: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const emp = await fetchEmployees()
        setEmployee(emp)
        setFormData({
          email: emp.email || '',
          mobile: emp.mobile || '',
          streetName: emp.streetName || '',
          city: emp.city || '',
          state: emp.state || '',
          RefUserFName: emp.RefUserFName || '',
          RefUserLName: emp.RefUserLName || '',
          doorNumber: emp.doorNumber || ''
        })
      } catch (err) {
        console.error('Error fetching employee:', err)
      }
    }

    loadEmployee()
  }, [])

  const handleEditClick = () => {
    if (employee) {
      setFormData({
        email: employee.email || '',
        mobile: employee.mobile || '',
        streetName: employee.streetName || '',
        city: employee.city || '',
        state: employee.state || '',
        RefUserFName: employee.RefUserFName || '',
        RefUserLName: employee.RefUserLName || '',
        doorNumber: employee.doorNumber || ''
      })
      setIsEditing(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleProfileUpdate = async () => {
    try {
      const updatedPayload = {
        firstName: formData.RefUserFName,
        lastName: formData.RefUserLName,
        designation: employee?.RefUserDesignation || '', // send current designation if no edit form
        doorNumber: formData.doorNumber,
        streetName: formData.streetName,
        city: formData.city,
        state: formData.state,
        email: formData.email,
        mobile: formData.mobile,
        username: employee?.username || '',
        refUserStatus: 'Active' // ✅ Always send as Active
      }

      const response = await updateEmployeeProfile(updatedPayload)
      if (response.status) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: response.message })
        setIsEditing(false)
        setEmployee((prev) => (prev ? { ...prev, ...formData } : null))
      } else {
        toast.current?.show({ severity: 'error', summary: 'Failed', detail: response.message })
      }
    } catch (err: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    }
  }

  return (
    <div>
      <Toast ref={toast} />
      <ComponentHeader
        title="Profile"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />

      <div className="p-3 flex flex-column w-full gap-3">
        <div className="flex profileSectionIntro">
          <div className="contents">
            <div className="userProfile">
              <div className="coverImage">
                <img src={backgroundImage} alt="cover" />
              </div>
              <div className="coverContents">
                <img src={profileImage} alt="user" />
                <div className="userDetails">
                  <div className="userDetOne">
                    <div className="userDetPrimary">
                      <p className="username">{employee?.username}</p>
                      <p className="useremail">{employee?.email}</p>
                    </div>
                    <p className="empPosition">{employee?.RefUserDesignation}</p>
                  </div>
                  <div className="userDetTwo">
                    <p>
                      <span>Employee ID</span>: {employee?.RefUserCustId}
                    </p>
                    <Divider layout="vertical" />
                    <p>
                      <span>Department</span>: {employee?.branch}
                    </p>
                    <Divider layout="vertical" />
                    <p>
                      <span>Mobile</span>: {employee?.mobile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Section */}
        <div className="flex flex-column profileEditSection p-3 w-full">
          <div className="flex justify-content-between w-full">
            <p className="font-bold">Basic Details</p>
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditClick}
                className="text-blue-500 hover:text-blue-700 transition"
                title="Edit Profile"
              >
                <PencilLine size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProfileUpdate}
                className="text-green-600 hover:text-green-800 transition"
                title="Save Changes"
              >
                Save
              </button>
            )}
          </div>

          <div className="flex mt-3 gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="username"
                  value={employee?.username || ''}
                  readOnly
                  className="w-full"
                />
                <label htmlFor="username">Username</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="RefUserFName"
                  value={formData.RefUserFName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="RefUserFName">First Name</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="RefUserLName"
                  value={formData.RefUserLName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="RefUserLName">Last Name</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex justify-content-between mt-3 w-full">
            <p className="font-bold">Communication Details</p>
          </div>

          <div className="flex mt-3 gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="email">Email</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="mobile">Mobile Number</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="doorNumber"
                  value={formData.doorNumber || ''}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="doorNumber">Door No</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex mt-3 gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="streetName"
                  value={formData.streetName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="streetName">Street</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="city">City</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                <label htmlFor="state">State</label>
              </FloatLabel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
