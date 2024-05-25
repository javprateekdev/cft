import React ,{useState} from 'react'
import axios from "axios";
import {useNavigate } from 'react-router-dom';
const Login = ({ onLogin }) => {

const [email,setEmail] =useState('')
const[password,setPassword] = useState('')

const navigate = useNavigate()

const handleClick =async()=>{
   if(email && password){
    const payload ={
        email,
        password
    }
    const { data } = await axios.post('http://localhost:8000/api/auth/login',payload)
    if(data.status === true){
        const token = data.data.token
         localStorage.setItem("token", token)
         onLogin();
         navigate("/todos")
    }
    
   }
}



  return (
    <div> 
        <h2>Login</h2>
        <div>
            <label>Email</label>
            <input type="text" name="email" onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div>
            <label>Password</label>
            <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <button onClick={handleClick}>Login</button>
        <span onClick={()=>navigate("/signUp")}> Not a Member ? SignUp </span>
    </div>
  )
}

export default Login