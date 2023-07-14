


import "./SignupModal.css"
import * as sessionActions from "../../store/session"


import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

function SignupModal({closeModal}){

    const dispatch = useDispatch()
    const sessionUser = useSelector((state)=>state.session.user)
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})

    if(sessionUser) return <Redirect to="/"/>

    const handleSubmit = (e) =>{
        e.preventDefault()
        const error={}

        //reset form values
        setFirstName("")
        setLastName("")
        setEmail("")
        setUsername("")
        setPassword("")
        setConfirmPassword("")

        if(password === confirmPassword){
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
                ).catch(async (res)=>{
                    const data = await res.json()
                    console.log(data)
                    console.log(data.errors)
                    if(data && data.errors){
                        if(!password) error['password']='Password is required'
                        if(password.length<6)error['password']='Password must be 6 characters or more'
                        if(data.errors.includes('Invalid email.'))error['email']='Invalid Email'
                        setErrors(error)
                    }
                })
        }

        return setErrors({
            confirmPassword:"Confirm Password field must be the same as the Password field"
        })
    }


    return (
        <div className="modalBackgroundSignup">
            <div className="modalContainerSignup">

                <div className='titleCloseBtn'>
                    <button onClick={()=>closeModal(false)}> X </button>
                </div>
                
                <div className="titleSignup">Sign Up</div>

                <form className="formValuesSignup" onSubmit={handleSubmit}>



                    <input className='inputBold'
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e)=>setFirstName(e.target.value)}
                    required/>

                    {errors.firstName && <div className="error">{errors.firstName}</div>}

                    <input className='inputBold'
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e)=>setLastName(e.target.value)}
                    required/>

                    {errors.lastName && <div className="error">{errors.lastName}</div>}

                    <input className='inputBold'
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required />

                    {errors.email && <div className="error">{errors.email}</div>}


                    <input className='inputBold'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    required/>

                    {errors.username && <div className="error">{errors.username}</div>}



                    <input className='inputBold'
                    type='password'
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required/>

                    {errors.password && <div className="error">{errors.password}</div>}

                        <input
                        className='inputBold'
                        type='password'
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required/>

                        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

                    <button className="signupModalButton" type="submit">Sign Up</button>
                </form>

            </div>
        </div>
    )
}

export default SignupModal
