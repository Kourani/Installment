



import {csrfFetch} from "./csrf"


const GET_SPOTS = "/spots/GET_SPOTS"
const ONE_SPOT = "/spots/SPOT_DETAIL"
const CREATE_SPOT = "/spots/NEW_SPOT"
const DELETE_SPOT ="/spots/DELETE_SPOT"
const UPDATE_SPOT ="/spots/UPDATE_SPOT"


//ACTIONS

//FOR ALL THE SPOTS
function loadSpots(spots) {
    return{
        type: GET_SPOTS,
        spots
    }
}

//FOR ONE SPOT
function specificSpot(spotData){
    return{
        type: ONE_SPOT,
        spotData
    }
}

function newSpot(newData){
    return{
        type: CREATE_SPOT,
        newData
    }
}

function deleteSpotData(thunkData){
    return{
        type: DELETE_SPOT,
        thunkData
    }
}

function editSpot(updateSpotThunkData){
    return {
        type:UPDATE_SPOT,
        updateSpotThunkData
    }
}

//thunk

export const getSpots = () => async dispatch =>{
    const response = await fetch('/api/spots')

    if(response.ok){
        const loadedSpots = await response.json()
        dispatch(loadSpots(loadedSpots))
        return loadedSpots
    }
    return response
}

export const spotDetails = (spotId) => async (dispatch) =>{
    const response = await fetch(`/api/spots/${spotId}`)

    if(response.ok){ //check for errors via statusCode before passing to reducer
        const data = await response.json()
        // console.log('spotDetailsData',data)
        dispatch(specificSpot(data)) //data.Spots

        return data
    }
    return response
}

export const createSpot = (payload) => async (dispatch) =>{
    const response = await csrfFetch(`/api/spots`, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload)
    })

    if(response.ok){
        const matchedSpot = await response.json()
        console.log('Inside createSpot Thunk',matchedSpot)
        dispatch(newSpot(matchedSpot))
        return matchedSpot
    }

    console.log('INSIDE THUNNK', response)
    return await response.json()
}

export const deleteSpot = (spotId) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${spotId}`,{
        method: 'DELETE'
    })

    if(response.ok){
        const retrivedData = await response.json()
        dispatch(deleteSpotData(retrivedData))
        return retrivedData
    }

    return await response.json()

}

export const updateSpot = (spotId,payload) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method:'PUT',
        headers:{
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify(payload)
    })

    if(response.ok){
        const spotUpdate = await response.json()
        dispatch(editSpot(spotUpdate))

        console.log('Inside Update Spot Thunk',spotUpdate)
        return spotUpdate
    }

    return await response.json()
}






//set up of initial state
const initialState = {}

//reducer
const spotReducer = (state=initialState, action) =>{

    switch (action.type){

        case ONE_SPOT:
            const foundSpot = {...action.spotData}

            return {
                matched: foundSpot,
                ...state
            }

        case GET_SPOTS:
            const allSpots ={}
            action.spots.Spots.forEach(element=>{
                allSpots[element.id] = element
            })

            return {
                ...allSpots,
            }

        case CREATE_SPOT:

            const createdSpot = {...action.newData}
            return{
                createdSpot
            }

        case DELETE_SPOT:
            const deletedSpot = {...action.thunkData}
            return{
                ...deletedSpot,
                ...state
            }

        case UPDATE_SPOT:
            const fixedSpot = {...action.updateSpotThunkData}
            return{
                updatedSpot:fixedSpot,
                state
            }

        default:
            return state
    }
}

export default spotReducer
