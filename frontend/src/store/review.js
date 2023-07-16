



import {csrfFetch} from "./csrf"

//action type
const GET_SPOT_REVIEWS ='/spots/GET_SPOT_REVIEWS'
const DELETE_REVIEW = './spots/DELETE_REVIEW'
const POST_REVIEW='./spots/spotId/POST_REVIEW'

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

function createReview(thunkData){
    return {
        type:POST_REVIEW,
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
        dispatch (deleteReview(reviewId))
        console.log('INSIDE REVIEW DELETE THUNK', retrivedData)
        return retrivedData
    }
    return await response.json()
}

export const postReview = (spotId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload)
    })

    if(response.ok){
        const reviewed = await response.json()
        createReview(reviewed)
        console.log('INSIDE THE POSTREVIEW THUNK', reviewed)
        return reviewed
    }

    const errorResponse = await response.json()
    console.log('THUNK NOT OKAY', errorResponse)
    return  errorResponse
}


// const initialState={
//     thunkData:[],
//     types:{}
// }
// const sortList =(thunkData)=>{
//     return thunkData.sort((reviewA,reviewB) =>{
//         return reviewA.id - reviewB.id
//     }).map((review)=>review.id)
// }

//reducer
export const reviewReducer = (state={},action)=>{
    switch(action.type){

        case GET_SPOT_REVIEWS:
            const newState={...action.thunkData}

            return{
                ...newState
            }

        case DELETE_REVIEW:
            const newReview={...state}
            delete newReview[action.thunkData]
            return newReview

        case POST_REVIEW:
            const reviewCreated={...action.thunkData}
            return{

                ...state,
                newReview:reviewCreated

            }

        default:
            return state
    }

}

export default reviewReducer
