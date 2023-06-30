



import {csrfFetch} from "./csrf"



//action type
const GET_REVIEWS ='/spots/GET_REVIEWS'


//action
function loadReviews(reviews){
    return{
        type:GET_REVIEWS,
        reviews
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

//reducer
export const reviewReducer = (state={},action)=>{
    switch(action.type){
        case GET_REVIEWS:
            const newState={...action.reviews}


            return{
                ...newState,
                ...state
            }

            default:
                return state
    }

}

export default reviewReducer
