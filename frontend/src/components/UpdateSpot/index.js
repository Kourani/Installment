
import './UpdateSpot.css'
import * as spotActions from '../../store/spot'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom';

function UpdateSpot(){

    const history = useHistory()
    const dispatch = useDispatch()
    const {spotId} = useParams()

    const spotState = useSelector(state=>state.spot)

    const [country, setCountry] = useState(spotState[spotId]?.country)

    const [streetAddress, setStreetAddress] = useState(spotState[spotId]?.address)
    const [city, setCity] = useState(spotState[spotId]?.city)
    const [state, setState] = useState(spotState[spotId]?.state)

    const [price, setPrice] = useState(spotState[spotId]?.price)
    const [description, setDescription]=useState(spotState[spotId]?.description)
    const [name, setName] = useState(spotState[spotId]?.name)
    const [image, setImage]= useState(spotState[spotId]?.previewImage)

    const [validationErrors, setValidationErrors] = useState({})
    const [buttonOff, setButtonOff] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(()=>{
        dispatch(spotActions.getSpots())
    },[dispatch])

    async function handleSubmit (e){
        e.preventDefault()

        const errors = {}
        if(!price) errors['price']='Price per night is required'
        if(!country) errors['country']='Country is required'
        if(!city) errors['city']='City is required'
        if(!state) errors['state']='State is required'
        if(!streetAddress) errors['streetAddress']='Street Address is required'
        if(!image) errors['image']='Preview Image URL is required'
        if(!description || (description && description.length<30)) errors['description']='Description needs 30 or more characters'

        setValidationErrors(errors)
        console.log('ERRORS', errors)
        console.log('DESCRIPTION', description)
        setSubmitted(true)

        const payload ={
            country,
            streetAddress,
            city,
            state,
            price
        }


        const created= await dispatch(spotActions.createSpot(payload))
        console.log('created',created)

        //reset form values
        setCountry(spotState[spotId]?.country)
        setStreetAddress(spotState[spotId]?.address)
        setCity(spotState[spotId]?.city)
        setPrice(spotState[spotId]?.price)
        setName(spotState[spotId]?.name)
        setImage(spotState[spotId]?.image)

        setValidationErrors({})
        setButtonOff(true)
    }

    return(
        <>
            <h2>Update your Spot</h2>
            <div>Where's your place located?</div>
            <div>Guests will only get your exact address once they booked a reservation</div>

        <form onSubmit={handleSubmit}>

            <label>Country
                <input type='text'

                defaultValue={country}
                onChange={(e)=>setCountry(e.target.defaultValue)}>
                </input>
            </label>

            <div className='error'>
                {validationErrors.country}
            </div>

            <label> Street Address
                <input type='Address'
                defaultValue={spotState[spotId]?.address}
                onChange={(e)=>setStreetAddress(e.target.defaultValue)}>
                </input>
            </label>

            <div className='error'>
                { submitted && validationErrors.streetAddress && `*${validationErrors.streetAddress}`}
            </div>

            <label>City
                <input type='city'
                defaultValue={spotState[spotId]?.city}
                onChange={(e)=>setCity(e.target.defaultValue)}>
                </input>
            </label>

            <div className='error'>
                {submitted && validationErrors.city && `*${validationErrors.city}`}
            </div>

            <label>State
                <input type='state'
                defaultValue={spotState[spotId]?.state}
                onChange={(e)=>setState(e.target.defaultValue)}>
                </input>
            </label>

            <div className='error'>
                {submitted && validationErrors.state && `*${validationErrors.state}`}
            </div>

            <div>Describe your place to your guests</div>
            <div>Mention the best features of your space and any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
            <textarea defaultValue={spotState[spotId]?.description}
            onChange={(e)=>setDescription(e.target.defaultValue)}
            placeholder="Please write at least 30 characters"></textarea>

            <div className='error'>
                {submitted && validationErrors?.description && `*${validationErrors.description}`}
            </div>

            <div>Create a title for your spot</div>
            <div> Catch guests' attention with a spot title that highlights what makes your place special</div>
            <input
            defaultValue={spotState[spotId]?.name}
            onChange={(e)=>setName(e.target.defaultValue)}
            placeholder="Name of your spot"></input>

            <div>Set a base price for your spot</div>
            <div>Competitive pricing can help your listing stand out and rank higher in search results</div>
            <input
            defaultValue={spotState[spotId]?.price}
            onChange={(e)=>setPrice(e.target.defaultValue)}
            placeholder="Price per night (USD)"></input>

            <div className='error'>
                {submitted && validationErrors.price && `*${validationErrors.price}`}
            </div>

            <div>Liven up your spot with photos</div>
            <div>Submit a link to at lest one photo to publish your spot</div>
            <input
            defaultValue={spotState[spotId]?.previewImage}
            onChange={(e)=>setImage(e.target.defaultValue)}
            placeholder='Preview Image'></input>

            <div className='error'>
                {submitted && validationErrors.image && `*${validationErrors.image}`}
            </div>

            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>
            <input placeholder="Image URL"></input>


            <button type='newSpot' disabled={buttonOff} onClick={()=>{history.push(`spots/${spotId}`)}}>
                Update your Spot
            </button>

        </form>

        </>
    )

}

export default UpdateSpot
