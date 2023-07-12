


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
        if(password === confirmPassword){
            setErrors({})
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
                    if(data && data.errors){
                        setErrors(data.errors)
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
                <div className="titleSignup">Sign Up</div>

                <form className="formValuesSignup" onSubmit={handleSubmit}>



                    <input className='inputBold'
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e)=>setFirstName(e.target.value)}
                    required/>

                    {errors.firstName && <p>{errors.firstName}</p>}

                    <input className='inputBold'
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e)=>setLastName(e.target.value)}
                    required/>

                    {errors.lastName && <p>{errors.lastName}</p>}

                    <input className='inputBold'
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required />

                    {errors.email && <p>{errors.email}</p>}


                    <input className='inputBold'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    required/>

                    {errors.username && <p>{errors.username}</p>}



                    <input className='inputBold'
                    type='password'
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required/>

                    {errors.password && <p>{errors.password}</p>}

                        <input
                        className='inputBold'
                        type='password'
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required/>

                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

                    <button className="signupModalButton" type="submit">Sign Up</button>
                </form>

            </div>
        </div>
    )
}

export default SignupModal
