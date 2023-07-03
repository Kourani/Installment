



import {csrfFetch} from "./csrf"

//action type
const GET_SPOT_REVIEWS ='/spots/GET_SPOT_REVIEWS'
const DELETE_REVIEW = './spots/DELETE_REVIEW'

//action
function loadSpotReviews(thunkData){
    return{
        type:GET_SPOT_REVIEWS,
        thunkData
    }
}

function deleteReview(thunkData){
    return{
        type: DELETE_REVIEW,
        thunkData
    }
}

//thunk


export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`)

    if(response.ok){
        const data = await response.json()
        dispatch(loadSpotReviews(data))
        console.log('HEEEEEEEEEEEEEEEEEEEEEEEEE',data)
        return data
    }

    return response.json()
}

export const reviewDelete = (reviewId) => async(dispatch) =>{
    const response = await csrfFetch(`/api/reviews/${reviewId}`,{
        method:'DELETE'
    })

    if(response.ok){
        const retrivedData = await response.json()
        dispatch (deleteReview(retrivedData))
        console.log('INSIDE REVIEW DELETE THUNK', retrivedData)
        return retrivedData
    }
    return await response.json()
}

//reducer
export const reviewReducer = (state={},action)=>{
    switch(action.type){

        case GET_SPOT_REVIEWS:
            const newState={...action.thunkData}

            return{
                ...newState,
            }

        case DELETE_REVIEW:
            const ReviewState={...action.thunkData}
            return{
                ...ReviewState,
                ...state
            }

        default:
            return state
    }

}

export default reviewReducer
