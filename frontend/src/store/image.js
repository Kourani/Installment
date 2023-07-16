


import {csrfFetch} from "./csrf"




const DELETE_IMAGE = '/images/DELETE_IMAGE'

function imageDelete(thunkData){
    return{
        type: DELETE_IMAGE,
        thunkData
    }
}


export const deleteImage = (imageId) => async (dispatch) => {

    const response = await csrfFetch(`/api/images/spot-images/${imageId}`,{
        method: 'DELETE'
    })

    if(response.ok){
        const retrivedData = await response.json()
        console.log('SPOT STORE ... DELETE IMAGE THUNK',retrivedData)
        dispatch(imageDelete(imageId))
        return retrivedData
    }

    return await response.json()

}


const imageReducer=(state={}, action)=>{

    switch(action.type){
        case DELETE_IMAGE:
            const newState={...state}
            delete newState[action.thunkData]
            return newState

        default:
            return state
    }
}

export default imageReducer
