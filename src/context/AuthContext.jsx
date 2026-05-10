import {createContext, useContext, useState} from 'react'
const AuthContext=createContext()
export const AuthProvider=({children})=>{
 const [token,setToken]=useState(localStorage.getItem('token'))
 const [user,setUser]=useState(null)
 const login=(token)=>{
    localStorage.setItem('token',token)
    setToken(token)

 }
 const logout=()=>{
    setToken(null)
    localStorage.removeItem('token')
    setUser(null)
 }
return <AuthContext.Provider value={{token,user,login,logout}}>
    {children}
</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext)