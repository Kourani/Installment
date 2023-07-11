


import './Modal.css'
import * as reviewActions from '../../store/review'
import * as spotActions from '../../store/spot'

import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function Modal({closeModal}){

    const dispatch = useDispatch()
    const {spotId} = useParams()
    console.log('MODEL...SPOTID',spotId)

    const reviewState = useSelector(state=>state.review)
    console.log('MODEL...REVIEWSTATE',reviewState)

    const userState = useSelector(state=>state.session)
    console.log('MODAL...USERSTATE',userState)

    const spotState = useSelector(state=>state.spot)
    console.log('MODAL...SPOTSTATE', spotState)
    const spotStateValues = Object.values(spotState)

    useEffect(()=>{
        dispatch(reviewActions.getSpotReviews(spotId))
        dispatch(spotActions.spotDetails(spotId))
    },[dispatch])

    function obtainReview(){
        let elemental = 0
        const values = Object.keys(reviewState)

        if(values.length && spotId){
            reviewState?.Reviews?.forEach(element =>{
                if(element?.User?.id === userState?.user?.id){
                    elemental = element
                }
            })

            console.log('ELEMENATL IF', elemental)
            return elemental.id
        }
    }

    // function obtainSpot(){
    //     if(spotStateValues.length && !spotId){

    //         let foundSpot

    //         spotStateValues.forEach(element=>{
    //             if(element?.ownerId === userState?.user?.id){
    //                 foundSpot = element
    //             }
    //         })

    //         console.log('FOUNDSPOT',foundSpot.id)
    //         return foundSpot.id
    //     }
    // }

    console.log('MODAL...REVEIW',obtainReview())
    // console.log('SPOT',obtainSpot())



    // function location(){
    //     if(spotId){
    //         return 'review'
    //     }
    //     else {
    //         return 'spot'
    //     }
    // }

    function onButtonClick(){
        closeModal(false)

       if(obtainReview()!== undefined) {dispatch(reviewActions.reviewDelete(obtainReview()))}

        // if(obtainSpot() !== undefined) {dispatch(spotActions.deleteSpot(obtainSpot()))}

        return
    }

    return (
        <div className='modalBackground'>

            <div className='modalContainer'>
                <div className='titleCloseBtn'>
                    <button onClick={()=>closeModal(false)}> X </button>
                </div>

                <div className='title'>
                    <h1>Confirm Delete</h1>
                </div>

                <div className='body'>
                    <p>Are you sure you want to remove this review from the listings?</p>
                </div>

                <div className='footer'>
                    <button onClick={()=> onButtonClick()}> Yes (Delete Review)</button>
                    <button id ='grayButton' onClick={() =>{closeModal(false)}} >No (Keep Review)</button>
                </div>

            </div>
        </div>
    )

}

export default Modal
