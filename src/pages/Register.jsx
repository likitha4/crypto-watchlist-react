import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Auth.css"

const API_URI= import.meta.env.VITE_APP_URL

function Register() {
 const [email,setEmail]= useState('')
 const [password,setPassword]=useState('')
 const [error, setError]= useState(null)
 const navigate=useNavigate()

const handleSubmit= async(e)=>{
    e.preventDefault()
      const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if(!emailRegex.test(email)){
        setError('Please enter valid mail address');
        return 
       }
    if(password.length<6){
        setError('Minimum password length should be of 6 characters')
        return 
    }
    try{
        const res= await fetch(`${API_URI}/api/auth/register`,
            {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email,password})
            })
            const data=await res.json()
            if(!res.ok){
                setError(data.error)
             return
            }
            navigate('/login')
    }
    catch(error){
        setError('Error in registering, will get back to you')
    }
}

  return (
    <div className='auth-container'>
        <div className='auth-card'>
        <h3>Register</h3>
        <label>Email</label>
        <input type='email' required minLength={12} className='auth-input' placeholder="Where do we connect with you?" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <label>Password</label>
        <input type='password' required minLength={6} className='auth-input' placeholder='Keep this as secret and only you must know' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        {error&& <p style={{color:'red'}}>{error}</p>}
        <button className="btn-register" onClick={handleSubmit}>Register</button>
        <p>Already Have an account? <span onClick={()=>navigate('/login')} style={{color:'#a78bfa', cursor:'pointer'}}>Login</span></p>
    </div>
  </div>
  )
}

export default Register;