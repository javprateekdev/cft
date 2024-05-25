import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Signup = () => {
    const[name,setName] =useState('')
    const[email,setEmail] = useState('')
    const[phone,setPhone] = useState('')
    const[password,setPassword] =useState('')
    const navigate = useNavigate()

    const handleSignUp = async() => {
        if(name && email && phone && password){
            const payload = {
                  name,
                  email,
                  phone,
                  password
            }
            const { data } = await axios.post('http://localhost:8000/api/user/createUser',payload)
        if(data.status === true){
             navigate("/login")
    }
        }
       
    }

  return (
    <>
   <h2>Sign Up</h2>
   <div>
   <label>Full Name</label>
   <input type="text" name="name" placeholder='Name' onChange={(e)=>setName(e.target.value)} />
   </div>
   <div>
   <label>Email</label>
   <input type="email" name="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} />
   </div>
   <div>
   <label>Phone Number</label>
   <input type="text" name="phone" placeholder='Phone' onChange={(e)=>setPhone(e.target.value)} />
   </div>
   <div>
   <label>Password</label>
   <input type="password" name="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} />
   </div>
   <button onClick={handleSignUp}>Sign Up</button>
   <span onClick={()=> navigate("/login")}>Already a Member ?Login</span>
    </>
  )
}

export default Signup