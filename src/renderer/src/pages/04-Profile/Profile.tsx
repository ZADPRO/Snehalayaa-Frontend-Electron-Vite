import React from 'react'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import './Profile.css'
import backgroundImage from '../../assets/profile/bg.jpg'
import profileImage from '../../assets/profile/profile.png'
import { Divider } from 'primereact/divider'
import { PencilLine } from 'lucide-react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'

const Profile: React.FC = () => {
  return (
    <div>
      <ComponentHeader title="Profile" subtitle="Monday, Jun 15, 2025" />
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
                      <p className="username">User name</p>
                      <p className="useremail">User email</p>
                    </div>
                    <p className="empPosition">Position</p>
                  </div>
                  <div className="userDetTwo">
                    <p>
                      <span>Employee ID</span>: COMP01HR1001
                    </p>
                    <Divider layout="vertical" />
                    <p>
                      <span>Department</span>: HR
                    </p>
                    <Divider layout="vertical" />
                    <p>
                      <span>Mobile</span>: +91 9933994499
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
            <PencilLine size={20} />{' '}
          </div>
          <div className="flex mt-3 gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">Username</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">First Name</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">Last Name</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex justify-content-between mt-3 w-full">
            <p className="font-bold">Communication Details</p>
          </div>
          <div className="flex mt-3 gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">Email</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">Mobile Number</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">Door No</label>
              </FloatLabel>
            </div>
          </div>
          <div className="flex mt-3 gap-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">Street</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">City</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText id="RefUserRefUserDesignation" keyfilter="pint" className="w-full" />
                <label htmlFor="RefUserRefUserDesignation">State</label>
              </FloatLabel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
