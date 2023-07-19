

import "./LoginModal.css"
import * as sessionActions from "../../store/session"

import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect} from "react-router-dom"
import { useHistory } from "react-router-dom"




function LoginModal({closeModal}){
    const dispatch = useDispatch()
    const history = useHistory()

    const sessionUser = useSelector((state)=>state.session.user)
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [buttonOff, setButtonOff] = useState(true)

    useEffect(()=>{
        if(credential && password){
            if(credential.length>3  && password.length>5){
                setButtonOff(false)
            }
            // setButtonOff(true)
        }

        if(!credential || !password){
            setButtonOff(true)
        }

        if(!credential || credential.length<4){
            setButtonOff(true)
        }

        if(!password|| password.length<6){
            setButtonOff(true)
        }

    },[dispatch,credential,password,errors])

    if(sessionUser) return <Redirect to="/"/>

    const handleSubmit = async (e) =>{
        e.preventDefault()

        try{
            const res = await dispatch(sessionActions.login({credential,password}))
            if(res.ok){
                closeModal(false)
                history.push('/')
                return null
            }
        }catch(res){
            const error ={}
            const newInformation = await res.json()

            if(newInformation.statusCode === 401){
                error['userPassword']='The provided credentials were invalid'
                setErrors(error)
            }
        }




        //reset form values
        setCredential("")
        setPassword("")

        setButtonOff(true)

        return null
    }


    function demoUser(){
        dispatch(sessionActions.login({credential:'demo@user.io', password:'password'}))
        closeModal(false)
        history.push('/')
        return
    }

    return (

        <div className="modalBackgroundLogin">
            <div className="modalContainerLogin">
                <div className='titleCloseBtn'>
                    <button onClick={()=>closeModal(false)}> X </button>
                </div>

                <div className="titleLogin"> Log In</div>


                    <form onSubmit = {handleSubmit} className="formValuesLogin">

                            {errors.userPassword && <div className="error">{errors.userPassword}</div>}

                            <input
                            type="text"
                            placeholder='Username or Email'
                            className="inputModalLogin"
                            value={credential}
                            onChange={(e)=>setCredential(e.target.value)}
                            required/>

                            <input
                            type="password"
                            placeholder="Password"
                            className="inputModalLogin"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required />

                        <button className="loginModalButton" type="submit" disabled={buttonOff}>Log In</button>
                    </form>

                    <button className='demoUserLogin' onClick={()=>demoUser()}>Login as Demo User</button>


            </div>
        </div>

    )
}

export default LoginModal
