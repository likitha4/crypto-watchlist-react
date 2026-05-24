import React from 'react'
import { useAuth} from '../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'
const API_URI= import.meta.env.VITE_APP_URL

function Login() {
  const {login}= useAuth()
    const [email,setEmail]= useState('')
    const [password,setPassword]=useState('')
    const [error, setError]= useState(null)
    const navigate=useNavigate()
   
   const handleSubmit= async(e)=>{
       e.preventDefault()
       try{
           const res= await fetch(`${API_URI}/api/auth/login`,{
                 method:'POST',
                 headers:{'Content-Type':'application/json'},
                 body:JSON.stringify({email, password})
                })
               const data=await res.json()
               if(!res.ok){
                   setError(data.error)
                  return
               }
               login(data.token)
               navigate('/')
       }
       catch(error){
           setError('Error in registering, will get back to you')
       }
  
}
return (

    <div className='auth-container'>
        <div className='auth-card'>
    <h3>Login</h3>
        <label>Email</label>
        <input type='email' className='auth-input' placeholder="Last time you registered our application with which email ?" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <label>Password</label>
        <input type='password' className="auth-input" placeholder='Hopefully you remember the password that you used last time ' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        {error&& <p style={{color:'red'}}>{error}</p>}
        <button className="btn-register" onClick={handleSubmit}>Login</button>
        <button className='btn-login' onClick={()=>navigate('/')}>Back to Home </button>
        </div>
        </div>
  )
}

export default Login;