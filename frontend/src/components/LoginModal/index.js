

import "./LoginModal.css"
import * as sessionActions from "../../store/session"

import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect} from "react-router-dom"




function LoginModal({closeModal}){
    const dispatch = useDispatch()
    const sessionUser = useSelector((state)=>state.session.user)
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [buttonOff, setButtonOff] = useState(true)


    useEffect(()=>{
        setButtonOff(false)
    },[dispatch,credential,password])


    if(sessionUser) return <Redirect to="/"/>

    const handleSubmit = (e) =>{
        e.preventDefault()

        const error = {}

        //reset form values
        setCredential("")
        setPassword("")

        setButtonOff(true)

        return dispatch(sessionActions.login({credential,password})).catch(
            async(res)=>{
                const data = await res.json()
                console.log(data)
                console.log(data.message)
                if(data && data.message){
                    error['credential']=data.message
                }
                setErrors(error)
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
                <div className='titleCloseBtn'>
                    <button onClick={()=>closeModal(false)}> X </button>
                </div>

                <div className="titleLogin"> Log In</div>


                    <form onSubmit = {handleSubmit} className="formValuesLogin">

                            {errors.credential && <div className="error">{errors.credential}</div>}

                            <input type="text" placeholder='Username or Email' value={credential}
                            onChange={(e)=>setCredential(e.target.value)}
                            required/>

                            <input type="password" placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required />

                        <button className="loginModalButton" type="submit" disabled={buttonOff}>Log In</button>
                    </form>

                    <button className='demoUserLogin' onClick={()=>demoUser()}>Demo User</button>


            </div>
        </div>

    )
}

export default LoginModal
