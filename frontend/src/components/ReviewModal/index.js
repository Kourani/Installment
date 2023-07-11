

import './ReviewModal.css'
import * as reviewActions from '../../store/review'

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";



function ReviewModal({closeModal}){
    const dispatch = useDispatch()
    const {spotId} = useParams()
    console.log(spotId)

    const reviewState = useSelector(state=>state.review)
    console.log('REVIEWSTATE',reviewState)

    const userState = useSelector(state=>state.session)
    console.log('USERSTATE',userState)

    const spotState = useSelector(state=>state.spot)
    console.log('SPOTSTATE', spotState)
    const spotStateValues = Object.values(spotState)

    const [review, setReview] = useState('')
    const [stars,setStars]=useState()
    const [validationErrors, setValidationErrors]=useState({})


    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa-regular fa-star"></i>
          </div>
        );
    };


    const payload={
        review,
        stars
    }

    console.log('PAYLOAD',payload)

    async function onSubmit(){
        console.log('inside the onSubmit')


        try{
            const created = await dispatch(reviewActions.postReview(spotId, payload))
            console.log('REVIEWMODAL...INSIDE TRY',created)
            return created
        }
        catch(created){
            const information = await created.json()

            console.log('REVIEWMODAL....INSIDE CATCH',information)

            const errors = {}
            if(information.statusCode===400){
                console.log('error IF')

                if(!review) errors['review']='Review is required'
                if(!stars) errors['stars']='Rating is required'
                if(stars<1 || stars>5) errors['stars'] = 'Stars must be an integer from 1 to 5'

                setValidationErrors(errors)

            }

            if(information.statusCode===403){
                errors['three']='User already has a review for this spot'
                setValidationErrors(errors)
            }
        }

        closeModal(false)
    }

    console.log('validationErrors',validationErrors)



    return(

        <>

            <div className='modalBackgroundPost'>
                <div className='modalContainerPost'>

                    {/* <div className='titleCloseBtnPost'>
                        <button onClick={()=>closeModal(false)}>X</button>
                    </div> */}

                    <div className='titlePost'>
                        How was your Stay?
                    </div>


                    <div className='bodyPost'>

                        <div className='error'>
                            {validationErrors.review}
                        </div>

                        <div className='error'>
                            {validationErrors.stars}
                        </div>

                        <div className='error'>
                            {validationErrors.three}
                        </div>

                        <div className='inputPost'>
                            <textarea className='reviewInput' value={review} onChange={(e)=>setReview(e.target.value)} placeholder="Leave your review here..."></textarea>

                            <input className='Rating' value={stars} onChange={(e)=>setStars(e.target.value)} placeholder='star Rating'/>
                        </div>

                        <div className='starDirection'>

                            <div className="filled" >
                                <i className="fa fa-star"></i>
                            </div>

                            <div className="empty" >
                                <i className="fa fa-star"></i>
                            </div>

                            <div className="filled" >
                                <i className="fa fa-star"></i>
                            </div>

                            <div className="filled" >
                                <i className="fa fa-star"></i>
                            </div>

                            <div className="filled" >
                                <i className="fa fa-star"></i>
                            </div>
                            Stars

                        </div>


                    </div>


                    <div className='footerPost'>
                        <button className='submitReviewButton' id='modalSubmit' onClick={()=>onSubmit()}>Submit your Review</button>
                    </div>
                </div>
            </div>
        </>

    )






}

export default ReviewModal
