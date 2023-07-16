
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

    const [postModal, setPostModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const [imageTracker, setImageTracker]=useState(false)

    //to know who is logged in or if no one is logged in
    const userState = useSelector(state=>state.session)
    console.log('SPOTREVIEWS...USERSTATE', userState)


    const reviewState = useSelector(state=>state.review)
    console.log('SPOTDETAIL...reviewState',reviewState)





      console.log('IMAGE TRACKER',imageTracker)

      const spotState = useSelector((state)=>state.spot)
      console.log('SPOTDETAIL...spotState', spotState)

      const [averageReviews, setAverageReviews]=useState(()=>{
        return spotState?.matched?.avgRating ? spotState?.matched?.avgRating : null
      })

      useEffect(()=>{

        if(!imageTracker)setImageTracker(true)
        // dispatch(spotActions.getSpots())
        dispatch(spotActions.spotDetails(spotId))
        dispatch(reviewActions.getSpotReviews(spotId))
      },[dispatch, spotId, postModal, deleteModal, imageTracker, averageReviews])

      if(!spotState?.matched?.name)
      {
        return <div> Loading Spot Data</div>
      }

    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa fa-star"></i>
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

    function avgRating(){
        return ( spotState?.matched?.avgStarRating ? (spotState?.matched?.avgStarRating)?.toFixed(1) : 'New')
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


    function descendingOrder(){

        const ordered = reviewState?.Reviews?.sort(function(a,b){
            let keyA = new Date(a.createdAt)
            let keyB = new Date(b.createdAt)

            if(keyA < keyB) return 1
            if(keyA > keyB) return -1
            return 0
         })

         return ordered

    }

    console.log('SPOT DETAIL ... SORTED',descendingOrder()?.length)

    //to obtain the actual reviews
    function reviewSpot(){

        if(descendingOrder()?.length > 0){
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
                                <button className = "deleteButton" onClick={()=>{setDeleteModal(true)}}>Delete</button>
                                {deleteModal && <Modal closeModal={setDeleteModal} />}
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

                            <div>
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
                <div>
                    {reviewBySpot()}
                </div>
                </>
            )

            })

        }


    }

    console.log('SPOT DETAIL...REVIEW SPOT',reviewSpot())

    console.log('SPOTDETAIL...reviewSpot', beTheFirst())

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
        console.log('SPOT DETAIL .... IMAGES',spotState?.matched?.SpotImages[0]?.url)

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

    //when the user DOES not own the spot IS logged and there are NO reviews
    function beTheFirst(){
        console.log('SPOT DETAIL...OWNER ID',spotState?.matched?.ownerId)
        console.log('SPOT DETAIL .. USER ID', userState?.user?.id)
        console.log('SPOT DETAIL... # OF REVIEWS', reviewState?.Reviews?.length)

        if(userState?.user !== null && spotState?.matched?.ownerId !== userState?.user?.id && !reviewState?.Reviews?.length){
            console.log('INSIDE THE ELSE !! BE THE FIRST')
            return "Be the first to post a review!"
        }

        return null
    }



    function postButton(){

        if(checkReview() === 'No Review' && spotState?.matched?.ownerId !== userState?.user?.id ){
            return(
                <>
                    <button className = "postReviewButton" onClick={()=>{setPostModal(true)}}>Post a Review</button>
                    {postModal && <ReviewModal closeModal={setPostModal} />}
                </>
            )
        }
    }

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
                    <text className='host'>Hosted by {spotState?.matched?.Owner?.firstName} {spotState?.matched?.Owner?.lastName}</text>
                    <p>{spotState?.matched?.description}</p>
                </div>


                <div className='callOutInformationBox'>

                        <div className='information'>

                            <div className='priceBox'>
                                ${spotState?.matched?.price} night
                            </div>

                            <div className='ratingBox'>
                                { spotState?.matched?.avgStarRating ?

                                    <>
                                        <div className='star'>
                                            {star()}
                                        </div>

                                        <label>
                                            {spotState?.matched?.avgStarRating?.toFixed(1)}
                                        </label>

                                        <div className='dot'>
                                            {dot()}
                                        </div>

                                        <label className='numberOfReviews'>
                                            {numberOfReviews()}
                                        </label>
                                    </>
                                    :
                                    <>
                                        <div className='star'>{star()}</div>
                                        <label>{'New'}</label>
                                    </>
                                }
                            </div>
                        </div>

                        <button className='submitButton' onClick={()=>submitButton()}>Reserve</button>
                </div>

            </div>

            <div className='reviewSummary'>

                    {avgRating() !=='New' ?

                        <>
                        {star()}
                        {avgRating()}
                        {/* {averageReviews} */}
                        {dot()}
                        {numberOfReviews()}
                        </>
                        :
                        <>
                        {star()}
                        {avgRating()}
                        </>
                    }

            </div>

            <div>
                {postButton()}
            </div>

            <p></p>

            <div>
                {reviewSpot() ? reviewSpot() : beTheFirst()}
            </div>

       </>
    )
}
export default SpotDetail
