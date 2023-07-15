

import {csrfFetch} from "./csrf"

const SET_USER = "session/setUser"
const REMOVE_USER = "session/removeUser"
// const GET_SPOT = "session/getSpot"


//action
function setUser(user) {
    return{
        type: SET_USER,
        payload: user //alternate user is the same as user:user
    }
}

function removeUser(){
    return {
        type: REMOVE_USER
    }
}




//thunk
export const login = (user) => async (dispatch) =>{
    const {credential, password} = user
    const response = await csrfFetch("/api/session",{
        method:"POST",
        body: JSON.stringify({
            credential,
            password
        })
    })

    if(response.ok){ //check for errors via statusCode before passing to reducer
        const data = await response.json()
        dispatch(setUser(data.user))
    }

    return await response
}

export const logout = () => async (dispatch) =>{
    const response = await csrfFetch('/api/session',{
        method:'DELETE'
    })

    dispatch(removeUser())
    return response
}


export const restoreUser = () => async dispatch =>{
    const response = await csrfFetch("/api/session")

    if(response.ok){
        console.log(response)
        const data = await response.json()
        dispatch(setUser(data.user))
    }
    return response
}

// export function restoreUser(){
//     return async function (dispatch){
        // const response = await csrfFetch("/api/session")
        // const data = await response.json()
        // dispatch(setUser(data.user))
        // return response
//     }
// }

export const signup = (user) => async (dispatch) =>{
     const {username, firstName, lastName, email, password} = user
     const response = await csrfFetch("/api/users", {
        method:"POST",
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
     })

     const data = await response.json()
     dispatch(setUser(data.user))
     return response
}


//set up of initial state
const initialState = {user:null}


//reducer
const sessionReducer = (state=initialState, action) =>{
    let newState
    switch (action.type){
        case SET_USER:
            newState = Object.assign({},state)
            newState.user=action.payload
            return newState

        case REMOVE_USER:
            newState = Object.assign({},state)
            newState.user=null
            return newState

        default:
            return state
    }
}

export default sessionReducer
