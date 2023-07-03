
import './SpotDetail.css'
import Modal from './../Modal'

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

    useEffect(()=>{
      dispatch(spotActions.spotDetails(spotId))
      dispatch(reviewActions.getSpotReviews(spotId))
    },[dispatch, spotId])

    //to know who is logged in or if no one is logged in
    const userState = useSelector(state=>state.session)
    console.log('SPOTREVIEWS...USERSTATE', userState)

    const spotState = useSelector((state)=>state.spot)
    console.log('SPOTDETAIL...spotState', spotState)

    const reviewState = useSelector(state=>state.review)
    console.log('SPOTDETAIL...reviewState',reviewState)


    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa-regular fa-star"></i>
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

      if(reviewState.Reviews){
          reviewState.Reviews?.forEach(element=>{
              averageRating +=element.stars
          })

          console.log('AVERAGE',averageRating)
          console.log('LENGTH',reviewState?.Reviews.length)

          if(averageRating===0){
              return averageRating
          }

          return (averageRating/reviewState?.Reviews.length)
      }

  }

  //to obtain the actual reviews
  function reviewSpot(){

      if(reviewState?.Reviews?.length > 0){

          let theArray = reviewState?.Reviews
          console.log('SPOTREVIEWS...THE ARRAY', theArray)

          return theArray.map(element=>{

              //sets the current date in the following format example '2023-1-25' with january being 0
              let  postedDate = new Date(element.createdAt)
              const  month = String(postedDate.getMonth() + 1).padStart(2, '0');
              const year = postedDate.getFullYear()
              postedDate = monthNames[parseInt(month)-1] + '-' + year;

              console.log('SPOTREVIEWS...ELEMENT',element?.User.id)
              console.log('SPOTREVIWS...USERID',userState?.user.id)

              function reviewBySpot(){
                  console.log('SPOTREVIEWS...ELEMENT ID',element.spotId)
                  console.log('SPOTREVIEWS...SPOTID',spotId)
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

              console.log('SPOTREVIEWS...REVIEWBYSPOT', reviewBySpot())

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

      if(spotState?.matched?.ownerId !== userState?.user?.id && userState?.user !== null && reviewState?.Reviews?.length===0)
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
          if(reviewState?.Reviews?.length === 1){
              return `${reviewState?.Reviews?.length} Review`
          } else
              if(reviewState?.Reviews?.length > 1) {
              return `${reviewState?.Reviews?.length} Reviews`
          } else {
          return `New`
      }
  }

  console.log('HELLO',spotState?.matched?.Owner?.firstName)
    return(

        <>
        <h1>{spotState?.matched?.name}</h1>
           <h3>{spotState?.matched?.city}, {spotState?.matched?.state}, {spotState?.matched?.country}</h3>
           <text>Hosted By {spotState?.matched?.Owner?.firstName}, {spotState?.matched?.Owner?.lastName}</text>
           <p>{spotState?.matched?.description}</p>

           <div>
               <label>{spotState?.matched?.price}  Night</label>
               <p></p>

               <button onClick={()=>submitButton()}>Reserve</button>
           </div>

        <div> Number of Reviews {star()} {numberOfReviews()}</div>
        <div>Average Review Star Rating {star()} {avgReviewsRating()} </div>
        {reviewSpot()}


       </>
    )
}

export default SpotDetail
