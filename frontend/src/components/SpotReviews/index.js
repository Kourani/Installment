

import './SpotReviews.css'
import Modal from './../Modal'

import * as reviewActions from '../../store/review'
import * as spotActions from '../../store/spot'

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import {useParams} from 'react-router-dom'


function SpotReviews(){

    const dispatch = useDispatch()
    const {spotId} = useParams()
  
    const [modal, setModal] = useState(false)

    useEffect(()=>{
        dispatch(reviewActions.getSpotReviews(spotId))
        dispatch(spotActions.getSpots())
    },[dispatch], [spotId])


    //to know who is logged in or if no one is logged in
    const userState = useSelector(state=>state.session)

    //to obtain access to the reviews state
    const spotReviews = useSelector((state)=>state.review)

    //to obtain access to the the spots state
    const spotState = useSelector(state=>state.spot)

    const monthNames = [
        'Janurary',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'Novemeber',
        'December'
    ]

    //to obtain the average rating of the reviews
    function avgReviewsRating(){
        let averageRating = 0

        if(spotReviews.Reviews){
            spotReviews.Reviews?.forEach(element=>{
                averageRating +=element.stars
            })

            if(averageRating===0){
                return averageRating
            }

            return (averageRating/spotReviews?.Reviews.length)
        }

    }



    //to obtain the actual reviews
    function reviewSpot(){

        if(spotReviews?.Reviews?.length > 0){

            let theArray = spotReviews?.Reviews

            return theArray.map(element=>{

                //sets the current date in the following format example '2023-1-25' with january being 0
                let  postedDate = new Date(element.createdAt)
                const  month = String(postedDate.getMonth() + 1).padStart(2, '0');
                const year = postedDate.getFullYear()
                postedDate = monthNames[parseInt(month)-1] + '-' + year;

                function reviewBySpot(){
                    if(parseInt(element?.spotId) === parseInt(spotId))
                    {
                        return (

                                    <>
                                    <li>{element?.User?.firstName}</li>
                                    <li>{postedDate}</li>
                                    <li>{element?.review}</li>
                                    </>

                               )
                    }}

                return (
                    <ul>
                        { (element?.User?.id === userState?.user?.id)  && (parseInt(element?.spotId) === parseInt(spotId)) ?
                            (<>
                            <li>{element?.User?.firstName}</li>
                            <li>{postedDate}</li>
                            <li>{element?.review}</li>
                            <button className = "openModalBtn" onClick={()=>{setModal(true)}}>Delete</button>
                            { modal && <Modal closeModal={setModal} />}
                            </>) :

                            <>
                           {reviewBySpot()}
                            </>}
                    </ul>)

                })

        }

        if(spotState?.matched?.ownerId !== userState?.user?.id && userState?.user !== null && spotReviews?.Reviews?.length===0)
        {
            return (
            <ul>
                <li>Be the first to post a review!</li>
            </ul>)
        }
    }

    //to obtain the number of reviews
    function numberOfReviews(){
            if(spotReviews?.Reviews?.length === 1){
                return `${spotReviews?.Reviews?.length} Review`
            } else
                if(spotReviews?.Reviews?.length > 1) {
                return `${spotReviews?.Reviews?.length} Reviews`
            } else {
            return `New`
        }
    }

    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa-regular fa-star"></i>
          </div>
        );
      };

    return(
        <>
        <div> Number of Reviews {star()} {numberOfReviews()}</div>
        <div>Average Review Star Rating {star()} {avgReviewsRating()} </div>
        {reviewSpot()}
        </>
    )

}

export default SpotReviews
