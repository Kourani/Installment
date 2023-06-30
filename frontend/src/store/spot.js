



import {csrfFetch} from "./csrf"


const GET_SPOTS = "/spots/GET_SPOTS"
const ONE_SPOT = "/spots/SPOT_ID"
const NEW_SPOT = "/spots/NEW_SPOT"


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
        type: NEW_SPOT,
        newData
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
        // console.log('createSpotThunk',response.json())

        const matchedSpot = await response.json()
        console.log(matchedSpot)
        dispatch(newSpot(matchedSpot))
        return matchedSpot
    }

    return response.json()}


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
                ...state
            }

        case NEW_SPOT:
            const createdSpot = {...action.newData}
            return{
                createdSpots: createdSpot,
                ...state
            }

        default:
            return state
    }
}

export default spotReducer
