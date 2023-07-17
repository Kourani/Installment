

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
                <i className="fa fa-star"></i>
            </div>
        );
    };


    function states(element){
        return(

        setDeleteId(element?.id),

        setModal(true)
        )

    }

    function userSpots(){

        return spotStateValues.map(element=>{

            if(element?.ownerId === userState?.user?.id){

                function elementRating(){
                    if(element?.avgRating%1===0){
                        return (`${element.avgRating}.0`)
                    }
                    return element.avgRating
                }

                console.log('MANAGESPOT...DELETEID',deleteId)

                return(
                    <>
                        <div>

                            <div className='manageTilesSpots' onClick={()=>{history.push(`/spots/${element.id}`)}}>

                                <button className='manageTileButton'>

                                        <img src={element.previewImage} alt='Spot Preview' />
                                </button>

                                <div className='spotInformation'>

                                    <div className='firstLine'>
                                        {element.city}, {element.state}

                                        <div className='manageStarRating'>
                                            {star()}
                                            {element.avgRating ? elementRating() : 'New'}
                                        </div>
                                    </div>

                                    <div className='secondLine'>
                                            <div className='secondLinePrice'>${element.price}</div>
                                            night
                                    </div>
                                </div>
                            </div>

                            <div className='spotButtons'>
                                        <button className='manageUpdateButton' onClick={()=>{history.push(`/spots/${element.id}/updateSpot`)}}>Update</button>
                                        <button className = "manageDeleteButton" onClick={()=>states(element)}>Delete</button>
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

            <div className='wale'>
            <div className='manageSpotsTitle'>Manage Spots</div>
            <button className='manageCreateButton' onClick={()=>history.push(`/newSpot`)}>Create a New Spot</button>
            <div>{userState?.user !=null ? check() : 'You must be logged in to manage your spots'}</div>
            </div>

            { modal && <SpotModal closeModal={setModal} toDelete={deleteId}/>}
        </>
    )

}

export default ManageSpots


// { modal && <Modal closeModal={setModal} />}
