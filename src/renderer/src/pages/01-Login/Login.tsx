import React, { useState } from 'react'
import './Login.css'
import { InputText } from 'primereact/inputtext'
import { UserRound } from 'lucide-react'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'

import LoginImage from '../../assets/login/loginImage.png'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log('Login clicked')
  }

  return (
    <div className="loginComponent">
      {/* Left half - Image */}
      <div className="loginLeft">
        <img src={LoginImage} alt="ERP Banner" className="loginImage" />
      </div>

      {/* Right half - Form */}
      <div className="loginRight">
        <div className="loginForm">
          <h2 className="login-title">Welcome to Snehalayaa Silks ERP</h2>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <UserRound strokeWidth={1.25} />
            </span>
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full"
            />
          </div>

          <div className="mt-3">
            <Password
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Password"
              toggleMask
              feedback={false}
              className="w-full"
            />
          </div>

          <div className="passwordFeatures mt-4">
            <span>Remember Me</span>
            <span className="forgot">Forgot Password?</span>
          </div>

          <Button
            label="Login"
            className="w-full mt-3 uppercase font-bold"
            style={{ backgroundColor: '#5e317c', borderColor: '#5e317c' }}
            onClick={handleLogin}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
