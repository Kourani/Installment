
import * as reviewActions from '../../store/review'

import React, { useEffect } from "react";
import { useSelector, useDispatch} from "react-redux";
import {useParams} from 'react-router-dom'

function SpotReviews(){

    const dispatch = useDispatch()
    const {spotId} = useParams()
    console.log('spotId', spotId)

    useEffect(()=>{
        dispatch(reviewActions.getReviews(spotId))
    },[dispatch]
    )

    const spotReviews = useSelector((state)=>state.review)
    console.log('SPOTREVIEWS', spotReviews)

    const spotReviewValues = Object.values(spotReviews)
    console.log(spotReviewValues)

    const userState = useSelector(state=>state.session)
    console.log('USERSTATE', userState)

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

    //to obtain the actual reviews
    function reviewSpot(){
        if(spotReviews.Reviews){
            return spotReviews?.Reviews.map(element=>{
                //sets the current date in the following format example '2023-1-25' with january being 0
                let  postedDate = new Date(element.createdAt)
                const day = String(postedDate.getDate()).padStart(2, '0');
                const  month = String(postedDate.getMonth() + 1).padStart(2, '0');
                const year = postedDate.getFullYear()
                postedDate = monthNames[parseInt(month)-1] + '-' + year;

            return (
                <>
                <ul>
                <li>{element.User.firstName}</li>
                <li>{postedDate}</li>
                <li>{element.review}</li>
                </ul>
                </>
            )
        })

        }
    }

    //to obtain the number of reviews
    function numberOfReviews(){
        if(spotReviews?.Reviews){
            if(spotReviews?.Reviews.length === 1){
                return `${spotReviews?.Reviews.length} Review`
            }
            if(spotReviews?.Reviews.length > 1){
                return `${spotReviews?.Reviews.length} Reviews`
            }
        }
        else{
            return `New`
        }
    }

    //to do to the checks if reviews exist 
    function userChecks(){
        if(spotState.matched && userState.user)
        {
            console.log('OWNERID',spotState.matched.ownerId)
            console.log('USERID',userState.user.id)

            if(spotState.matched.ownerId !== userState.user.id && userState.user !== null && !spotReviews.Reviews)
            {
                return <li>Be the first to post a review!</li>
            }
        }

    }

    return(
        <>
        <ul>{userChecks()}</ul>
        <div>{numberOfReviews()}</div>
        <div>{avgReviewsRating()}</div>
        {reviewSpot()}
        </>
    )
}

export default SpotReviews
