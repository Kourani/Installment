



import {csrfFetch} from "./csrf"



//action type
const GET_REVIEWS ='/spots/GET_REVIEWS'
const DELETE_REVIEW = './spots/DELETE_REVIEW'


//action
function loadReviews(reviews){
    return{
        type:GET_REVIEWS,
        reviews
    }
}

function deleteReview(thunkData){
    return{
        type: DELETE_REVIEW,
        thunkData
    }
}

//thunk

export const getReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`)

    if(response.ok){
        const data = await response.json()
        dispatch(loadReviews(data))
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
        case GET_REVIEWS:
            const newState={...action.reviews}

            return{
                ...newState,
                ...state
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
