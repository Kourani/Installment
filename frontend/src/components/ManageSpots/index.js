

import './ManageSpots.css'
import * as spotActions from '../../store/spot'
import Modal from "./../Modal"

import { React, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

// import { useParams } from 'react-router-dom';

function ManageSpots(){
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(()=>{
        dispatch(spotActions.getSpots())
    },[dispatch])


    const allSpots = useSelector(state=>state.spot)
    const values = Object.values(allSpots)

    const user = useSelector(userState=>userState.session)

    const [modal, setModal] = useState(false)



    function userSpots(){
        return values.map(element=>{
            if(element.ownerId === user.user.id){

                return(
                    <>
                    <button onClick={()=>{history.push(`/spots/${element.id}`)}}>
                        <div className="imageContainer">
                            <img src={element.previewImage} alt='Spot Preview' />
                        </div>
                        <ul>
                            <li>{element.city}, {element.country}</li>
                            <li>{element.avgRating ? element.avgRating : 'New'}</li>
                            <li>{element.price} Night</li>
                        </ul>
                    </button>
                        <button onClick={()=>{history.push(`/spots/${element.id}/updateSpot`)}}>Update</button>
                        <button className = "openModalBtn" onClick={()=>setModal(true)}>Delete</button>
                        { modal && <Modal closeModal={setModal} />}
                    </>

                )
            }
        })
    }

    function check(){
        if(userSpots().length){
            return userSpots()
        }
        else{
            return <div>nothing</div>
        }
    }

    return(
        <>
        <h1>Manage Spots</h1>
        <NavLink to='/newSpot'>Create a Spot</NavLink>
        <div>{user.user !=null ? check() : 'You must be logged in to manage your spots'}</div>
        </>
    )

}

export default ManageSpots
