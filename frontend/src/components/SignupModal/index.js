


import "./SignupModal.css"
import * as sessionActions from "../../store/session"


import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

function SignupModal({closeModal}){

    const dispatch = useDispatch()
    const history = useHistory()

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [buttonOff, setButtonOff] = useState(true)

    const sessionUser = useSelector((state)=>state.session.user)
    console.log('SIGN UP...SESSIONUSER',sessionUser)

    useEffect(()=>{
        if(email && username && firstName && lastName && password && confirmPassword){
            if(username.length>3 || password.length>5){
                return setButtonOff(false)
            }
        }
    },[dispatch,email,username,firstName,lastName,password,confirmPassword])

    console.log('SIGN UP MODAL ... BUTTON OFF',buttonOff)

    if(sessionUser) return <Redirect to="/"/>

    const handleSubmit = (e) =>{
        e.preventDefault()
        const error={}

        console.log('SIGN UP MODAL ... ERRORS', errors)
        console.log('SIGN UP MODAL ... ERROR',error)
        if(!Object.keys(errors).length){
            console.log('inside the successMove if')
            history.push('/')
        }

        //reset form values
        setFirstName("")
        setLastName("")
        setEmail("")
        setUsername("")
        setPassword("")
        setConfirmPassword("")
        setButtonOff(true)

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
                    console.log('SIGN UP ... CATCH BLOCK DATA',data)
                    console.log(data.errors)

                    if(data && data.errors){
                        if(!password) error['password']='Password is required'
                        if(password.length<6)error['password']='Password must be 6 characters or more'
                        if(username===email) error['username']='Username cannot be an email'
                        if(data.errors.includes( "User with that username already exists"))error['username']="Username must be unique"
                        if(data.errors.includes('Invalid email.'))error['email']="The provided email is invalid"
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

                    <button className="signupModalButton" type="submit" disabled={buttonOff}>Sign Up</button>
                </form>

            </div>
        </div>
    )
}

export default SignupModal
