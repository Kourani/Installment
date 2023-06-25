

import React from "react";
import './SpotDetail.css'
import * as spotActions from '../../store/spot'


import { useSelector, useDispatch} from "react-redux";


function SpotDetail(){

    const dispatch = useDispatch()
    const specificSpot = useSelector((state)=>state)
    console.log(specificSpot, 'specificSpot')

    return(
        <>
        <h1>{specificSpot.name}</h1>
        <h2>Location City State Country</h2>
        <text>Hosted By first Name last Name</text>
        <p>Description</p>
        <div>
            price
            <label>Night</label>
            <button>Reserve</button>
        </div>
        </>
    )
}

export default SpotDetail
