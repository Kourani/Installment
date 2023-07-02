

import './SpotReviews.css'
import * as reviewActions from '../../store/review'
import Modal from './../Modal'

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import {useParams} from 'react-router-dom'


function SpotReviews(){

    const dispatch = useDispatch()
    const {spotId} = useParams()

    useEffect(()=>{
        dispatch(reviewActions.getReviews(spotId))
    },[dispatch]
    )

    //to know who is logged in or if no one is logged in
    const userState = useSelector(state=>state.session)
    console.log('USERSTATE', userState)

    //to obtain access to the reviews state
    const spotReviews = useSelector((state)=>state.review)
    console.log('SPOTREVIEWS', spotReviews)

    //to obtain access to the the spots state
    const spotState = useSelector(state=>state.spot)
    console.log('SPOTSTATE',spotState)

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

            console.log('AVERAGE',averageRating)
            console.log('LENGTH',spotReviews?.Reviews.length)

            if(averageRating===0){
                return averageRating
            }

            return (averageRating/spotReviews?.Reviews.length)
        }

    }

    const [modal, setModal] = useState(false)

    //to obtain the actual reviews
    function reviewSpot(){

        if(spotReviews?.Reviews?.length > 0){
            console.log('INSIDE THE FIRST IF')
            const theArray = spotReviews?.Reviews

            let reviewsMap = theArray.map(element=>{
                console.log('MAP')
                console.log(element,'iiiiiiiiiii')
                //sets the current date in the following format example '2023-1-25' with january being 0
                let  postedDate = new Date(element.createdAt)
                const  month = String(postedDate.getMonth() + 1).padStart(2, '0');
                const year = postedDate.getFullYear()
                postedDate = monthNames[parseInt(month)-1] + '-' + year;

                return (
                    <ul>
                        { element?.User?.id === userState?.user?.id  ?
                            (<>
                            <li>{element?.User?.firstName}, {console.log('aaaaaaaaaaaa',element?.User?.id)}</li>
                            <li>{postedDate}</li>
                            <li>{element?.review}</li>
                            <button className = "openModalBtn" onClick={()=>{setModal(true)}}>Delete</button>
                            { modal && <Modal closeModal={setModal} />}
                            </>) :

                            <>
                            <li>{element?.User?.firstName}</li>
                            <li>{postedDate}</li>
                            <li>{element?.review}</li>
                            </>}
                    </ul>
                       )
                })

            return reviewsMap
        }

        if(spotState?.matched?.ownerId !== userState?.user?.id && userState?.user !== null && spotReviews?.Reviews?.length===0)
        {
            console.log('INSIDE THE ELSE !! BE THE FIRST')
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
        <div> {star()} {numberOfReviews()}</div>
        <div>* {avgReviewsRating()}</div>
        {reviewSpot()}
        </>
    )
}

export default SpotReviews
