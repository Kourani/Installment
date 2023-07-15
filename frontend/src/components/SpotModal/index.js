

import './SpotModal.css'
import * as spotActions from '../../store/spot'

import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function SpotModal({closeModal, toDelete} ){

    const dispatch = useDispatch()

    const userState = useSelector(state=>state.session)
    console.log('SPOTMODAL...USERSTATE',userState)

    const spotState = useSelector(state=>state.spot)
    console.log('SPOTMODAL...SPOTSTATE', spotState)
    const spotStateValues = Object.values(spotState)

    console.log('SPOTMODAL...PROP',toDelete)

    useEffect(()=>{
        dispatch(spotActions.getSpots())
    },[dispatch])


    function obtainSpot(){
        let foundSpot
        spotStateValues.forEach(element=>{
            if(element?.id === toDelete){
                foundSpot=element?.id
            }
        })

        console.log('SPOTMODAL...FOUNDSPOT',foundSpot)

        return foundSpot
    }


    console.log('SPOTMODAL...SPOT',obtainSpot())

    function onButtonClick(){
        closeModal(false)

        if(obtainSpot() !== undefined)
        {dispatch(spotActions.deleteSpot(obtainSpot()))}
        return
    }

    // console.log('SPOT MODAL ... OBTAIN SPOT' , onButtonClick())



    console.log('SPOT MODAL ... CLOSE MODAL',closeModal)

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
                    <p>Are you sure you want to remove this spot from the listings?</p>
                </div>

                <div className='footer'>
                    <button onClick={()=> onButtonClick()}> Yes (Delete Spot)</button>
                    <button id ='grayButton' onClick={() =>{closeModal(false)}} >No (Keep Spot)</button>
                </div>

            </div>
        </div>
    )

}

export default SpotModal
