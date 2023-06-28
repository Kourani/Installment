

import React, { useEffect } from "react";
import './SpotDetail.css'
import * as spotActions from '../../store/spot'


import { useSelector, useDispatch} from "react-redux";
import {useParams} from 'react-router-dom'

function SpotDetail(){

    let params = useParams()
    console.log('plain Use', params)

    const {spotId} = useParams()

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(spotActions.spotDetails(spotId))
    },[dispatch])

    const specificSpot = useSelector((state)=>state.spot.matched)
    console.log('specificSpot', specificSpot)

    function submitButton(){
        return window.alert('Feature coming soon')
    }

    return(

        <>
        <h1>{specificSpot?.name}</h1>
           <h2>{specificSpot?.city}, {specificSpot?.country}</h2>
           <text>Hosted By {specificSpot?.Owner?.firstName}, {specificSpot?.Owner?.lastName}</text>
           <p>{specificSpot?.description}</p>

           <div>
               <label>{specificSpot?.price}  Night</label>
               <p></p>

               <button onClick={()=>submitButton()}>Reserve</button>
           </div>
       </>

    )
}

export default SpotDetail
