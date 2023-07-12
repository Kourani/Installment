
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

    const spotValues = Object.values(spotState)
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

            function checkRating(){
                if(element.avgRating%1===0){
                    return `${element.avgRating}.0`
                }
            }


            return(
                <>
                    <div className='one'>
                        <button className='spotTileButton' key='spotTile' onClick={()=>onClicked()}>
                                <div className="imageContainer">
                                    <img className='imageTile' src={element.previewImage} alt='Spot Preview' />
                                </div>
                        </button>

                        <div className='tileInformation'>

                            <div className='line1'>
                                <div className='elementCity'>{element.city}, {element.state}</div>

                                <div className='starter'>
                                    <div className='starFunction'>{star()}</div>
                                    <div className='averageRating'>{element.avgRating ? checkRating() : 'New'}</div>
                                </div>
                            </div>

                            <div className='price'>
                                ${element.price}night
                            </div>

                        </div>

                    </div>
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
