


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

    const reviewState = useSelector(state=>state.review)
    console.log('REVIEWSTATE',reviewState)

    const userState = useSelector(state=>state.session)
    console.log('USERSTATE',userState)

    const spotState = useSelector(state=>state.spot)
    console.log('SPOTSTATE', spotState)
    const spotStateValues = Object.values(spotState)

    useEffect(()=>{
        dispatch(reviewActions.getSpotReviews(spotId))
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

    function obtainSpot(){
        if(spotStateValues.length && !spotId){
            let foundSpot
            spotStateValues.forEach(element=>{
                if(element?.ownerId === userState?.user?.id){
                    foundSpot = element
                }
            })

            console.log('FOUNDSPOT',foundSpot.id)
            return foundSpot.id
        }
    }

    console.log('REVEIW',obtainReview())
    console.log('SPOT',obtainSpot())


    // useEffect(()=>{
    //     dispatch(reviewActions.reviewDelete(obtainReview()))
    //     dispatch(spotActions.deleteSpot(obtainReview()))
    // },[dispatch])

    function location(){
        if(spotId){
            return 'Review'
        }
        else {
            return 'Spot'
        }
    }

    function onButtonClick(){
        closeModal(false)

       if(obtainReview()!== undefined) {dispatch(reviewActions.reviewDelete(obtainReview()))}

        if(obtainSpot() !== undefined) {dispatch(spotActions.deleteSpot(obtainSpot()))}

        return
    }

    return (
        <div className='modalBackground'>

            <div className='modalContainer'>
                <div className='titleCloseBtn'>
                    <button onClick={()=>closeModal(false)}> X </button>
                </div>

                <div className='title'>
                    <h1>Title: Confirm Delete</h1>
                </div>

                <div className='body'>
                    <p>Message: Are you sure you want to remove this {location()}?</p>
                </div>

                <div className='footer'>
                    <button onClick={()=> onButtonClick()}> Yes (Delete {location()})</button>
                    <button id ='grayButton' onClick={() =>{closeModal(false)}} >No (Keep {location()})</button>
                </div>

            </div>
        </div>
    )

}

export default Modal
