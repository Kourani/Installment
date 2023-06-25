



import {csrfFetch} from "./csrf"


const GET_SPOT = "spots/spotId"

//action
function getSpotDetail(spotId) {
    return{
        type: GET_SPOT,
        spotId
    }
}

//thunk
export const spotDetail = (spotId) => async (dispatch) =>{
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if(response.ok){ //check for errors via statusCode before passing to reducer
        const data = await response.json()
        dispatch(getSpotDetail(data))
    }
    return response
}

//set up of initial state
const initialState = {}


//reducer
const spotReducer = (state=initialState, action) =>{
    let newState
    switch (action.type){
        case GET_SPOT:
            newState = Object.assign({},state)
            return newState

        default:
            return state
    }
}

export default spotReducer
