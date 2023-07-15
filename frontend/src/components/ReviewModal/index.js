

import './ReviewModal.css'
import * as reviewActions from '../../store/review'

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';


function ReviewModal({closeModal}){
    const dispatch = useDispatch()
    const history = useHistory()
    const {spotId} = useParams()
    console.log(spotId)

    const userState = useSelector(state=>state.session)
    console.log('USERSTATE',userState)

    const spotState = useSelector(state=>state.spot)
    console.log('SPOTSTATE', spotState)
    const spotStateValues = Object.values(spotState)

    const reviewState = useSelector(state=>state.review)
    console.log('REVIEWSTATE',reviewState)

    const [review, setReview] = useState('')
    const [stars,setStars]=useState()
    const [tempStars, setTempStars]=useState()
    const [validationErrors, setValidationErrors]=useState({})
    const [buttonOff, setButtonOff]=useState(true)

    useEffect(()=>{

        if(review && stars){
            if(review.length>9){
                setButtonOff(false)
            }
        }
    },[dispatch,review,stars])





    const payload={
        review,
        stars
    }

    console.log('PAYLOAD',payload)

    console.log('ONSUBMIT',onSubmit)
    async function onSubmit(){
        console.log('inside the onSubmit')


        try{
            const created = await dispatch(reviewActions.postReview(spotId, payload))
            console.log('REVIEWMODAL...INSIDE TRY',created)
            // history.push(`/spots/${spotId}`)
            closeModal(false)
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
    }

    console.log('validationErrors',validationErrors)

    console.log('REVIEW MODAL ... BUTTON OFF', buttonOff)


    function starMount(){
        const star1 = () => {
            return (
              <div style={{ color: "black", fontSize: "20px" }}>
                <i className="fa-regular fa-star"></i>
              </div>
            );
        };

        const star2 = () => {
            return (
              <div style={{ color: "black", fontSize: "20px" }}>
                <i className="fa-regular fa-star"></i>
              </div>
            );
        };

        const star3 = () => {
            return (
              <div style={{ color: "black", fontSize: "20px" }}>
                <i className="fa-regular fa-star"></i>
              </div>
            );
        };

        const star4 = () => {
            return (
              <div style={{ color: "black", fontSize: "20px" }}>
                <i className="fa-regular fa-star"></i>
              </div>
            );
        };

        const star5 = () => {
            return (
              <div style={{ color: "black", fontSize: "20px" }}>
                <i className="fa-regular fa-star"></i>
              </div>
            );
        };

    }

    console.log('HERE',stars)

    function doStars(){
        if(stars === 1){
            <i className="fa-solid fa-star" ></i>
            return
        }
    }



    return(

        <>

            <div className='modalBackgroundPost'>
                <div className='modalContainerPost'>

                    <div className='titleCloseBtnPost'>
                        <button onClick={()=>closeModal(false)}>X</button>
                    </div>

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

                        <div className='homeReviewInput'>
                            <textarea className='reviewInput' cols='50' rows='4' value={review} onChange={(e)=>setReview(e.target.value)} placeholder="Leave your review here..."></textarea>

                            <div className='starDirection'>

                            <button className="toBeFilled"  >
                                <div className='starStyle' onClick={()=>setStars(1)} onMouseEnter={()=>setTempStars(1)} onMouseLeave={()=>setTempStars('')}>
                                    { tempStars >= 1 ||stars>=1 ? <i className="fa-solid fa-star" ></i> :  <i className="fa-regular fa-star"></i> }
                                </div>
                            </button>


                                <div  onClick={()=>setStars(2)} onMouseEnter={()=>setTempStars(2)} onMouseLeave={()=>setTempStars('')}>
                                    { tempStars >= 2 || stars>=2 ? <i className="fa-solid fa-star"></i> :  <i className="fa-regular fa-star"></i> }
                                </div>


                            <div  onClick={()=>setStars(3)} onMouseEnter={()=>setTempStars(3)} onMouseLeave={()=>setTempStars('')}>
                                    { tempStars >= 3 || stars>=3 ? <i className="fa-solid fa-star"></i> :  <i className="fa-regular fa-star"></i> }
                                </div>

                                <div  onClick={()=>setStars(4)} onMouseEnter={()=>setTempStars(4)} onMouseLeave={()=>setTempStars('')}>
                                    { tempStars >= 4 || stars>=4 ? <i className="fa-solid fa-star"></i> :  <i className="fa-regular fa-star"></i> }
                                </div>


                                <div  onClick={()=>setStars(5)} onMouseEnter={()=>setTempStars(5)} onMouseLeave={()=>setTempStars('')}>
                                    { tempStars >= 5 || stars>=5 ? <i className="fa-solid fa-star"></i> :  <i className="fa-regular fa-star"></i> }
                                </div>

                            <div className='starsWord'>
                            Stars
                            </div>

                        </div>

                        </div>






                    </div>


                    <div className='footerPost'>
                        <button className='submitReviewButton' id='modalSubmit' onClick={()=>onSubmit()} disabled={buttonOff}>Submit your Review</button>
                    </div>
                </div>
            </div>
        </>

    )

}

export default ReviewModal
