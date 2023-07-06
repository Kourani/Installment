
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

            <form className='createForm' onSubmit={handleSubmit}>


                <div className='section'>

                <h2 className='pageTitle'>Create a New Spot</h2>
                
                    <div className='titles'>Where's your place located?</div>
                    <div>Guests will only get your exact address once they booked a reservation</div>
                    <label>Country
                        <input className='input' type='text' value={country} onChange={(e)=>setCountry(e.target.value)}/>
                    </label>

                    <div className='error'>
                        {validationErrors.country}
                    </div>

                    <label> Street Address
                        <input className='input' type='Address' value={streetAddress} onChange={(e)=>setStreetAddress(e.target.value)}/>
                    </label>

                    <div className='error'>
                        { submitted && validationErrors.streetAddress && `*${validationErrors.streetAddress}`}
                    </div>

                    <label>City
                        <input className='input' type='city' value={city} onChange={(e)=>setCity(e.target.value)}/>
                    </label>

                    <div className='error'>
                        {submitted && validationErrors.city && `*${validationErrors.city}`}
                    </div>

                    <label>State
                        <input className='input' type='state' value={state} onChange={(e)=>setState(e.target.value)}/>
                    </label>

                    <div className='error'>
                        {submitted && validationErrors.state && `*${validationErrors.state}`}
                    </div>
                </div>


                <div className='section'>
                    <div className='titles'>Describe your place to your guests</div>
                    <div className='subs'>Mention the best features of your space and any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                    <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Please write at least 30 characters"></textarea>

                    <div className='error'>
                        {submitted && validationErrors?.description && `*${validationErrors.description}`}
                    </div>
                </div>

                <div className='section'>
                    <div className='titles'>Create a title for your spot</div>
                    <div className='subs'> Catch guests' attention with a spot title that highlights what makes your place special</div>
                    <input className='input' value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name of your spot"/>
                </div>

                <div className='section'>
                    <div className='titles'>Set a base price for your spot</div>
                    <div className='subs'>Competitive pricing can help your listing stand out and rank higher in search results</div>
                    <input className='input' value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price per night (USD)"/>

                    <div className='error'>
                        {submitted && validationErrors.price && `*${validationErrors.price}`}
                    </div>
                </div>

                <div className='section'>
                    <div className='titles'>Liven up your spot with photos</div>
                    <div className='subs'>Submit a link to at lest one photo to publish your spot</div>
                    <input className='input' value={image} onChange={(e)=>setImage(e.target.value)} placeholder="Preview of Image URL"/>

                    <div className='error'>
                        {submitted && validationErrors.image && `*${validationErrors.image}`}
                    </div>

                    <input className='input' placeholder="Image URL"/>
                    <input className='input' placeholder="Image URL"/>
                    <input className='input' placeholder="Image URL"/>
                    <input className='input' placeholder="Image URL"/>
                </div>


                <button className='createButton' type='newSpot' disabled={buttonOff}>
                    Create Spot
                </button>
            </form>
        </>
    )

}

export default CreateSpot
