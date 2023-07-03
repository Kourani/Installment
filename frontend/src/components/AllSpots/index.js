
import './AllSpots.css'
import { getSpots } from "../../store/spot";
import * as reviewActions from '../../store/review'

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function AllSpots(){

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(()=>{
        dispatch(getSpots())

    },[dispatch])

    const spotState = useSelector(state=>state.spot)
    console.log('ALLSPOTS...SPOTSTATE',spotState)

    let spotValues = Object.values(spotState)
    console.log('ALLSPOTS...values',spotValues)

    //creates the star icon
    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa-regular fa-star"></i>
          </div>
        );
      };



    function spotTiles(){
        return spotValues.map(element =>{

            function onClicked(){
                history.push(`/spots/${element.id}`)
                dispatch(reviewActions.getSpotReviews(element.id))
                return
              }
              
            return (
                <>
                <button key='spotTile' onClick={()=>onClicked()}>

                    <ul key='listedItems'>
                        <div key='image'>{element.previewImage}</div>
                        <li key='cityState'> {element.city}, {element.state}</li>
                        <li key='rating'>Average Spot Rating: {element.avgRating ?  element.avgRating : 'New'}</li>
                        <li key='price'> {element.price} Night</li>
                    </ul>
                </button>

                <div key='ratingBelow'> {star()}Average Spot Rating:{element.avgRating ?  element.avgRating : 'New'}</div>
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
