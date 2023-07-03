
import './CreateSpot.css'
import * as spotActions from '../../store/spot'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

function CreateSpot(){

    const history = useHistory()
    const dispatch = useDispatch()

    const [country, setCountry] = useState()
    const [streetAddress, setStreetAddress] = useState()
    const [city, setCity] = useState()
    const [state, setState] = useState()

    const [price, setPrice] = useState()
    const [description, setDescription]=useState()
    const [name, setName] = useState()
    const [image, setImage]= useState()

    const [validationErrors, setValidationErrors] = useState({})
    const [buttonOff, setButtonOff] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    //this use Effect checks for changes in the input parameters
    //if they are satisfactory ok if not they display the error message

    // useEffect(()=>{
    //     const errors = {}
    //     if(!price) errors['price']='Price per night is required'
    //     if(!country) errors['country']='Country is required'
    //     if(!city) errors['city']='City is required'
    //     if(!state) errors['state']='State is required'
    //     if(!streetAddress) errors['streetAddress']='Street Address is required'
    //     if(!image) errors['image']='Preview Image URL is required'
    //     if(!description || (description && description.length<30)) errors['description']='Description needs 30 or more characters'

    //     setValidationErrors(errors)
    //     console.log('ERRORS', errors)
    //     console.log('DESCRIPTION', description)
    //     if(!Object.keys(errors).length) setButtonOff(false)

    // }, [price, country, city, state, streetAddress, image, description])

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
        setCountry('')
        setCity('')
        setValidationErrors({})
        setButtonOff(true)
    }

    const spotState = useSelector(state=>state.spot)
    console.log('spotState', spotState)

    return(
        <>
            <h2>Create a New Spot</h2>
            <div>Where's your place located?</div>
            <div>Guests will only get your exact address once they booked a reservation</div>

            <form onSubmit={handleSubmit}>
                <label>Country
                    <input type='text' value={country} onChange={(e)=>setCountry(e.target.value)}></input>
                </label>

                <div className='error'>
                    {validationErrors.country}
                </div>

                <label> Street Address
                    <input type='Address' value={streetAddress} onChange={(e)=>setStreetAddress(e.target.value)}></input>
                </label>

                <div className='error'>
                    { submitted && validationErrors.streetAddress && `*${validationErrors.streetAddress}`}
                </div>

                <label>City
                    <input type='city' value={city} onChange={(e)=>setCity(e.target.value)}> </input>
                </label>

                <div className='error'>
                    {submitted && validationErrors.city && `*${validationErrors.city}`}
                </div>

                <label>State
                    <input type='state' value={state} onChange={(e)=>setState(e.target.value)}> </input>
                </label>

                <div className='error'>
                    {submitted && validationErrors.state && `*${validationErrors.state}`}
                </div>

                <div>Describe your place to your guests</div>
                <div>Mention the best features of your space and any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Please write at least 30 characters"></textarea>

                <div className='error'>
                    {submitted && validationErrors?.description && `*${validationErrors.description}`}
                </div>

                <div>Create a title for your spot</div>
                <div> Catch guests' attention with a spot title that highlights what makes your place special</div>
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name of your spot"></input>

                <div>Set a base price for your spot</div>
                <div>Competitive pricing can help your listing stand out and rank higher in search results</div>
                <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price per night (USD)"></input>

                <div className='error'>
                    {submitted && validationErrors.price && `*${validationErrors.price}`}
                </div>

                <div>Liven up your spot with photos</div>
                <div>Submit a link to at lest one photo to publish your spot</div>
                <input value={image} onChange={(e)=>setImage(e.target.value)} placeholder="Preview of Image URL"></input>

                <div className='error'>
                    {submitted && validationErrors.image && `*${validationErrors.image}`}
                </div>

                <input placeholder="Image URL"></input>
                <input placeholder="Image URL"></input>
                <input placeholder="Image URL"></input>
                <input placeholder="Image URL"></input>


                <button type='newSpot' disabled={buttonOff}>
                    Create Spot
                </button>
            </form>
        </>
    )

}

export default CreateSpot
