

import './ReviewModal.css'

import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function ReviewModal({postModal}){
    const dispatch = useDispatch()
    const {spotId} = useParams()

    const reviewState = useSelector(state=>state.review)
    console.log('REVIEWSTATE',reviewState)

    const userState = useSelector(state=>state.session)
    console.log('USERSTATE',userState)

    const spotState = useSelector(state=>state.spot)
    console.log('SPOTSTATE', spotState)
    const spotStateValues = Object.values(spotState)

    const star = () => {
        return (
          <div style={{ color: "black", fontSize: "20px" }}>
            <i className="fa-regular fa-star"></i>
          </div>
        );
    };

    return(
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">

                    <div>How was your Stay?</div>

                    <textarea placeholder="Leave your review here..."></textarea>

                    <div className='starDirection'>
                        {star()}{star()}{star()}{star()}{star()}
                    </div>

                    <button id='modalSubmit'>Submit your Review</button>
                </div>
            </div>
        </div>

    )






}

export default ReviewModal
