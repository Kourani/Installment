
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
            console.log('ELEMENTTTTTT',element)

            function onClicked(){
                history.push(`/spots/${element.id}`)
                dispatch(reviewActions.getSpotReviews(element.id))
                return
              }

            return (
                <>
                <button key='spotTile' onClick={()=>onClicked()}>
                <div>
                <div className="imageContainer">
                    <img src={element.previewImage} alt='Spot Preview' />
                </div>

                    <ul key='listedItems'>
                        <li key='cityState'> {element.city}, {element.state}</li>
                        <li key='rating'>Average Spot Rating: {element.avgRating ?  element.avgRating : 'New'}</li>
                        <li key='price'> {element.price} Night</li>
                        <li key='spot-name'>{element.name}</li>
                    </ul>
                    
                    Average Spot Rating: {element.avgRating ?  element.avgRating : 'New'}
                </div>
                </button>


                </>
            )
        })
    }

    return(
            <div className='spotGrid'>
                {spotTiles()}
            </div>
    )

}

export default AllSpots
