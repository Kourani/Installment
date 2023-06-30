
import './AllSpots.css'
import { getSpots } from "../../store/spot";
import * as reviewActions from '../../store/review'

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom';

function AllSpots(){

    const dispatch = useDispatch()
    const {spotId} = useParams()

    console.log('spotId',spotId)

    const spotState = useSelector(state=>state.spot)
    console.log('SPOTSTATE',spotState)

    const reviewState = useSelector(state=>state.review)
    console.log('REVIEWSTATE', reviewState)

    useEffect(()=>{
        dispatch(getSpots())
        dispatch(reviewActions.getReviews(spotId))
    },[dispatch])

    let values = Object.values(spotState)
   

    const history = useHistory()


    function spotTiles(){
        return values.map(element =>{
            return (
                <>
                <button key={`${element.id}`} onClick={()=> history.push(`/spots/${element.id}`)}>

                    <ul>
                        <div>{element.previewImage}</div>
                        <li> {element.city} {element.country}</li>
                        <li>{element.avgRating ? element.avgRating : 'New'}</li>
                        <li> {element.price} Night</li>
                    </ul>
                </button>
                <div>{`* ${element.avgRating}`}</div>
                </>
            )
        })
    }


    return(
        <>
            <h1>SPOTSSS</h1>
            {spotTiles()}
        </>
    )

}

export default AllSpots
