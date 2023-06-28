



import {csrfFetch} from "./csrf"


const GET_SPOTS = "spots/GET_SPOTS"
const ONE_SPOT = "spots/SPOT_ID"

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



        default:
            return state
    }
}

export default spotReducer
