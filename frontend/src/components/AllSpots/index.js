

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spot";

import './AllSpots.css'
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

function AllSpots(){

    const dispatch = useDispatch()
    const spotState = useSelector(state=>state.spot)
    console.log('SPOTSTATE',spotState)

    useEffect(()=>{
        dispatch(getSpots())
    },[dispatch])

    let values = Object.values(spotState)
    console.log('VALUES',values)

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
                <div>{element.avgRating}</div>
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
