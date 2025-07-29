import React, { useEffect, useState } from 'react'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import './Profile.css'
import backgroundImage from '../../assets/profile/BG-1.jpg'
import profileImage from '../../assets/profile/profile.png'
import { Divider } from 'primereact/divider'
import { PencilLine } from 'lucide-react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { fetchEmployees } from './Profile.function'
import { Employee } from './Profile.interface'

const Profile: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employee = await fetchEmployees()
        setEmployee(employee) // set the single employee object
        console.log('Setting employee:', employee)
      } catch (err) {
        console.error('Error fetching employee:', err)
      }
    }

    loadEmployee()
  }, [])

  
  return (
    // <div>
    //   <ComponentHeader title="Profile" subtitle="Monday, Jun 15, 2025" />
    //   <div className="p-3 flex flex-column w-full gap-3">
    //     <div className="flex profileSectionIntro">
    //       <div className="contents">
    //         <div className="userProfile">
    //           <div className="coverImage">
    //             <img src={backgroundImage} alt="cover" />
    //           </div>
    //           <div className="coverContents">
    //             <img src={profileImage} alt="user" />
    //             <div className="userDetails">
    //               <div className="userDetOne">
    //                 <div className="userDetPrimary">
    //                   <p className="username">User name</p>
    //                   <p className="useremail">User email</p>
    //                 </div>
    //                 <p className="empPosition">Position</p>
    //               </div>
    //               <div className="userDetTwo">
    //                 <p>
    //                   <span>Employee ID</span>: COMP01HR1001
    //                 </p>
    //                 <Divider layout="vertical" />
    //                 <p>
    //                   <span>Department</span>: HR
    //                 </p>
    //                 <Divider layout="vertical" />
    //                 <p>
    //                   <span>Mobile</span>: +91 9933994499
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex flex-column profileEditSection p-3 w-full">
    //       <div className="flex justify-content-between w-full">
    //         <p className="font-bold">Basic Details</p>
    //         <PencilLine size={20} />{' '}
    //       </div>
    //       <div className="flex mt-3 gap-3">
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">Username</label>
    //           </FloatLabel>
    //         </div>
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">First Name</label>
    //           </FloatLabel>
    //         </div>
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">Last Name</label>
    //           </FloatLabel>
    //         </div>
    //       </div>

    //       <div className="flex justify-content-between mt-3 w-full">
    //         <p className="font-bold">Communication Details</p>
    //       </div>
    //       <div className="flex mt-3 gap-3">
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">Email</label>
    //           </FloatLabel>
    //         </div>
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">Mobile Number</label>
    //           </FloatLabel>
    //         </div>
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">Door No</label>
    //           </FloatLabel>
    //         </div>
    //       </div>
    //       <div className="flex mt-3 gap-3">
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">Street</label>
    //           </FloatLabel>
    //         </div>
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">City</label>
    //           </FloatLabel>
    //         </div>
    //         <div className="flex-1">
    //           <FloatLabel className="always-float">
    //             <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
    //             <label htmlFor="RefUserRefUserDesignation">State</label>
    //           </FloatLabel>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div>
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

        <div className="flex flex-column profileEditSection p-3 w-full">
          <div className="flex justify-content-between w-full">
            <p className="font-bold">Basic Details</p>
            {/* <PencilLine size={20} /> */}
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
                  id="firstName"
                  value={employee?.RefUserFName || ''}
                  readOnly
                  className="w-full"
                />
                <label htmlFor="firstName">First Name</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="lastName"
                  value={employee?.RefUserLName || ''}
                  readOnly
                  className="w-full"
                />
                <label htmlFor="lastName">Last Name</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex justify-content-between mt-3 w-full">
            <p className="font-bold">Communication Details</p>
          </div>
          <div className="flex mt-3 gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="email" value={employee?.email || ''} readOnly className="w-full" />
                <label htmlFor="email">Email</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="mobile" value={employee?.mobile || ''} readOnly className="w-full" />
                <label htmlFor="mobile">Mobile Number</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="doorNumber"
                  value={employee?.doorNumber || ''}
                  readOnly
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
                  value={employee?.streetName || ''}
                  readOnly
                  className="w-full"
                />
                <label htmlFor="streetName">Street</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="city" value={employee?.city || ''} readOnly className="w-full" />
                <label htmlFor="city">City</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="state" value={employee?.state || ''} readOnly className="w-full" />
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
