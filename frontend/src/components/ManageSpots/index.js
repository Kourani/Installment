

import './ManageSpots.css'
import * as spotActions from '../../store/spot'
import Modal from "./../Modal"

import { React, startTransition, useState } from 'react'
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

    const [modal, setModal] = useState(false)

    const spotState = useSelector(state=>state.spot)
    const spotStateValues = Object.values(spotState)

    const userState = useSelector(userState=>userState.session)

    const star = () => {
        return (
            <div style={{ color: "black", fontSize: "20px" }}>
                <i className="fa-regular fa-star"></i>
            </div>
        );
    };

    function userSpots(){
        return spotStateValues.map(element=>{

            if(element?.ownerId === userState?.user?.id){

                return(
                    <>
                        <div>
                            <button className='manageTileButton' onClick={()=>{history.push(`/spots/${element.id}`)}}>

                                <div className='imageContainer'>
                                    <img src={element.previewImage} alt='Spot Preview' />
                                </div>
                            </button>

                            <div className='spotInformation'>

                                    <div className='firstLine'>
                                        {element.city}, {element.state}
                                        {star()}
                                        {element.avgRating ? element.avgRating : 'New'}
                                    </div>

                                    {element.price}night

                                    <div className='spotButtons'>
                                        <button className='manageUpdateButton' onClick={()=>{history.push(`/spots/${element.id}/updateSpot`)}}>Update</button>
                                        <button className = "manageDeleteButton" onClick={()=>setModal(true)}>Delete</button>
                                        { modal && <Modal closeModal={setModal} />}
                                    </div>

                            </div>
                        </div>
                    </>

                )
            }
        })
    }

    function check(){
        if(userSpots().length){
            return (<div className='spots'>{userSpots()}</div>)
        }
    }



    return(
        <>

            <div className='whole'>
            <div>Manage Your Spots</div>
            <button className='createButton' onClick={()=>history.push(`/newSpot`)}>Create a New Spot</button>
            <div>{userState?.user !=null ? check() : 'You must be logged in to manage your spots'}</div>
            </div>
        </>
    )

}

export default ManageSpots
