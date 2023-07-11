
import './SpotDetail.css'
import ReviewModal from './../ReviewModal'
import Modal from '../Modal'

import * as spotActions from '../../store/spot'
import * as reviewActions from '../../store/review'

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import {useParams} from 'react-router-dom'

function SpotDetail(){

    const dispatch = useDispatch()

    const {spotId} = useParams()
    console.log('SPOTDETAIL...SPOTID',spotId)

    const [modal, setModal] = useState(false)

    //to know who is logged in or if no one is logged in
    const userState = useSelector(state=>state.session)
    console.log('SPOTREVIEWS...USERSTATE', userState)

    const spotState = useSelector((state)=>state.spot)
    console.log('SPOTDETAIL...spotState', spotState)

    const reviewState = useSelector(state=>state.review)
    console.log('SPOTDETAIL...reviewState',reviewState)

    useEffect(()=>{
        dispatch(spotActions.spotDetails(spotId))
        dispatch(reviewActions.getSpotReviews(spotId))
      },[dispatch, spotId, modal])

    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa-regular fa-star"></i>
          </div>
        );
    };

    const dot = () => {
        return (
          <div style={{ color: "black", fontSize: "8px" }}>
            <i className="fa-solid fa-circle"></i>
          </div>
        );
    };

    function submitButton(){
        return window.alert('Feature coming soon')
    }

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

        if(reviewState?.Reviews){
            reviewState.Reviews?.forEach(element=>{
            averageRating +=element.stars
            })

            console.log('AVERAGE',averageRating)
            console.log('LENGTH',reviewState?.Reviews.length)

            if(averageRating%reviewState?.Reviews.length === 0){
                return (`${(averageRating/reviewState?.Reviews.length)}.0`)
            }

            return ( averageRating !== 0 ? averageRating/reviewState?.Reviews.length : 'New')
        }
    }

    //to obtain the actual reviews
    function reviewSpot(){
        if(reviewState?.Reviews?.length > 0){
            console.log('inside the first if!')
            return reviewState?.Reviews.map(element=>{

            //sets the current date in the following format example '2023-1-25' with january being 0

            let  postedDate = new Date(element.createdAt)
            const  month = String(postedDate.getMonth() + 1).padStart(2, '0');
            const year = postedDate.getFullYear()
            postedDate = monthNames[parseInt(month)-1] + ' ' +year;

            function deleteButton(){
                if(userState.user !== null){
                    if((element?.User?.id === userState?.user?.id)  && (parseInt(element?.spotId) === parseInt(spotId))){
                        return(
                            <>
                                <button className = "deleteButton" onClick={()=>{setModal(true)}}>Delete</button>
                                { element?.spotId && modal && <Modal closeModal={setModal} />}
                            </>
                        )
                    }
                }
            }

            console.log('SPOTDETAIL...deleteButton', deleteButton())

            function reviewBySpot(){
                if(parseInt(element?.spotId) === parseInt(spotId)){
                    return(
                        <>
                        <div className='Reviews'>
                            <div className='firstName'>
                                {element?.User?.firstName}

                            </div>

                            <div className='date'>
                                {postedDate}
                            </div>

                            <div className='review'>
                                {element?.review}
                            </div>

                            <div className='deleteButton'>
                                {deleteButton()}
                            </div>


                            <p></p>
                        </div>
                        </>
                    )
                }
            }

            console.log('SPOTDETAIL...reviewBySpot',reviewBySpot())

            return(
                <>
                {reviewBySpot()}
                </>
            )

            })

        }

        if(spotState?.matched?.ownerId !== userState?.user?.id && userState?.user !== null && reviewState?.Reviews?.length===0){
            console.log('INSIDE THE ELSE !! BE THE FIRST')
            return(

                    <div>Be the first to post a review!</div>

            )
        }
    }

    console.log('SPOTDETAIL...reviewSpot', reviewSpot())

    //to obtain the number of reviews
    function numberOfReviews(){
          if(reviewState?.Reviews?.length === 1){
              return `${reviewState?.Reviews?.length} Review`
          } else
              if(reviewState?.Reviews?.length > 1) {
              return `${reviewState?.Reviews?.length} Reviews`
          } else {
          return `New`
      }
    }

    //the first image for that spot
    function spotImage(){
        return (
            <div className='imageContainerImage'>
                <img src={spotState?.matched?.SpotImages[0]?.url} alt='Spot Preview'/>
            </div>
        )
    }

    //the other images for that spot
    function spotImages(){

        return spotState?.matched?.SpotImages.map(element=>{

            if(element !== spotState?.matched?.SpotImages[0]){
                return (
                    <>
                    <div className='imageContainerImages'>
                        <img src={element.url} alt='Spot Preview' />
                    </div>
                    </>
                )
            }

        })
    }

    function checkReview(){
        if(userState.user !== null){

            let decide = 'No Review'

            if(spotState?.matched?.ownerId !== userState?.user?.id){
                for(let i=0; i<reviewState?.Reviews?.length; i++){
                    if(reviewState?.Reviews[i]?.userId === userState?.user?.id){
                        decide='Has Review'
                        return decide
                    }
                }
            }

            return decide
        }

    }

    console.log('SPOTDETAIL....CHECKREVIEW', checkReview())

    function postButton(){

        if(checkReview() === 'No Review'){
            return(
                <>
                    <button className = "postReviewButton" onClick={()=>{setModal(true)}}>Post a Review</button>
                    { checkReview() && modal && <ReviewModal closeModal={setModal} />}
                </>
            )
        }
    }
    console.log('hereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', checkReview())

    return(
        <>

            <h1>{spotState?.matched?.name}</h1>
            <h3>{spotState?.matched?.city}, {spotState?.matched?.state}, {spotState?.matched?.country}</h3>

            <div className='grids'>
                {spotImage()}
                <div className='spotGridsImages'>{spotImages()}</div>
            </div>


            <div className='solidLine'>

                <div className='hostedBy'>
                    <text className='host'>Hosted By {spotState?.matched?.Owner?.firstName}, {spotState?.matched?.Owner?.lastName}</text>
                    <p>{spotState?.matched?.description}</p>
                </div>

                <div className='callOutInformationBox'>

                    <div className='information'>
                        ${spotState?.matched?.price} night
                        {avgReviewsRating() !==0 ?

                            <>
                                <div className='star'>{star()}</div>
                                <label>{spotState?.matched?.avgStarRating%1 === 0 ? `${(spotState?.matched?.avgStarRating)}.0` : spotState?.matched?.avgStarRating}</label>
                                <div className='dot'>{dot()}</div>
                                <label className='numberOfReviews'>{numberOfReviews()}</label>
                            </>
                            :
                            <>
                                <div className='star'>{star()}</div>
                                <label>{spotState?.matched?.avgStarRating%1 === 0 ? `${(spotState?.matched?.avgStarRating)}.0` : spotState?.matched?.avgStarRating}</label>
                            </>
                        }
                    </div>

                    <div className='outerSubmit'>
                        <button className='submitButton' onClick={()=>submitButton()}>Reserve</button>
                    </div>

                </div>



            </div>

            <div className='reviewSummary'>

                    {avgReviewsRating() !=='New' ?

                        <>
                        {star()}
                        {avgReviewsRating()}
                        {dot()}
                        {numberOfReviews()}
                        </>
                        :
                        <>
                        {star()}
                        {avgReviewsRating()}
                        </>
                    }

            </div>

            <div>
            {postButton()}
            </div>

            <p></p>

            <div>
            {reviewSpot()}
            </div>

       </>
    )
}
export default SpotDetail
