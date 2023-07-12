

import "./LoginModal.css"
import * as sessionActions from "../../store/session"

import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect} from "react-router-dom"




function LoginModal({closeModal}){
    const dispatch = useDispatch()
    const sessionUser = useSelector((state)=>state.session.user)
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})

    if(sessionUser) return <Redirect to="/"/>

    const handleSubmit = (e) =>{
        e.preventDefault()
        setErrors({})
        return dispatch(sessionActions.login({credential,password})).catch(
            async(res)=>{
                const data = await res.json()
                if(data && data.errors) setErrors(data.errors)
            }
        )
    }


    function demoUser(){
        return dispatch(sessionActions.login({credential:'demo@user.io', password:'password'})
        )
    }

    return (

        <div className="modalBackgroundLogin">
            <div className="modalContainerLogin">
                <div className="titleLogin"> Log In</div>


                    <form onSubmit = {handleSubmit} className="formValuesLogin">


                            <input type="text" placeholder='Username or Email' value={credential}
                            onChange={(e)=>setCredential(e.target.value)}
                            required/>

                            <input type="password" placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required />



                        {errors.credential && <p>{errors.credential}</p>}
                        <button className="loginModalButton" type="submit">Log In</button>
                    </form>

                    <button className='demoUserLogin' onClick={()=>demoUser()}>Demo User</button>


            </div>
        </div>

    )
}

export default LoginModal
