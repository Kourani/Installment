
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

    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa-regular fa-star"></i>
          </div>
        );
      };


      console.log('ALLSPOTS...VALUES',values)
    function spotTiles(){
        return values.map(element =>{
            return (
                <>
                <button key={`${element.id}`} onClick={()=> history.push(`/spots/${element.id}`)}>

                    <ul>
                        <div>{element.previewImage}</div>
                        <li> {element.city}, {element.state}</li>
                        <li>{element.avgRating ?  element.avgRating : 'New'}</li>
                        <li> {element.price} Night</li>
                    </ul>
                </button>

                <div> {star()}{element.avgRating ?  element.avgRating : 'New'}</div>
                </>
            )
        })
    }


    return(
        <>
            {spotTiles()}
        </>
    )

}

export default AllSpots
