

import './ManageSpots.css'
import SpotModal from "./../SpotModal"

import * as spotActions from '../../store/spot'

import { React, useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

// import { useParams } from 'react-router-dom';

function ManageSpots(){

    const dispatch = useDispatch()
    const history = useHistory()



    const [modal, setModal] = useState(false)
    const [deleteId, setDeleteId] = useState('')


    const spotState = useSelector(state=>state.spot)
    const spotStateValues = Object.values(spotState)

    const userState = useSelector(userState=>userState.session)

    useEffect(()=>{
        dispatch(spotActions.getSpots())
    },[dispatch])

    const star = () => {
        return (
            <div style={{ color: "black", fontSize: "20px" }}>
                <i className="fa-regular fa-star"></i>
            </div>
        );
    };


    function userSpots(){

        function states(element){
            return(

            setDeleteId(element?.id),

            setModal(true)
            )

        }

        return spotStateValues.map(element=>{

            if(element?.ownerId === userState?.user?.id){



                console.log('MANAGESPOT...DELETEID',deleteId)

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
                                        <button className = "manageDeleteButton" onClick={()=>states(element)}>Delete {element.id}</button>
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

            { modal && <SpotModal closeModal={setModal} toDelete={deleteId}/>}
        </>
    )

}

export default ManageSpots


// { modal && <Modal closeModal={setModal} />}
