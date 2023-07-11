
import './CreateSpot.css'
import * as spotActions from '../../store/spot'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

function CreateSpot(){

    const history = useHistory()
    const dispatch = useDispatch()

    const [country, setCountry] = useState('')
    const [address, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')

    const [price, setPrice] = useState('')
    const [description, setDescription]=useState('')
    const [name, setName] = useState('')
    const [image, setImage]= useState('')

    const [lat, setLatitude] = useState('')
    const [lng, setLongitude] = useState('')

    const [validationErrors, setValidationErrors] = useState({})

    const [submitted, setSubmitted] = useState(false)
    const [buttonOff, setButtonOff] = useState(true)

    useEffect(()=>{
        if(country && address && city && state && price && description
            && name && image){
                setButtonOff(false)
            }
    },[dispatch, country, address, city, state, price, description, name, image])


    async function handleSubmit (e){
        e.preventDefault()

        setSubmitted(true)

        const payload ={
            country,
            address,
            city,
            state,
            description,
            name,
            price,
            image,
            lat,
            lng
        }

        try {
            const created = await dispatch(spotActions.createSpot(payload));
            console.log('TRY BLOCK....CREATED',created)

            history.push(`/spots/${created.id}`)
            return created

        }
        catch (created) {

            const information = await created.json()
            console.log('CATCH BLOCK....CATCHME',information)

            if(information.statusCode===400){
                console.log('error IF')
                const errors = {}
                if(!price) errors['price']='Price per night is required'
                if(!country) errors['country']='Country is required'
                if(!city) errors['city']='City is required'
                if(!state) errors['state']='State is required'
                if(!address) errors['streetAddress']='Street Address is required'
                if(!image) errors['image']='Preview Image URL is required'
                if(!description || (description && description.length<30)) errors['description']='Description needs 30 or more characters'
                if(!name) errors['name'] ='Spot name must be less than 50 characters'
                setValidationErrors(errors)

            }
        }


        // reset form values
        setCountry('')
        setStreetAddress('')
        setCity('')
        setState('')
        setLatitude('')
        setLongitude('')
        setDescription('')
        setName('')
        setImage('')
    }

    console.log('insideCatch',validationErrors)
    return(
        <>
            <form className='createForm' onSubmit={handleSubmit}>


                <div className='section'>

                <h2 className='pageTitle'>Create a New Spot</h2>

                    <div className='titles'>Where's your place located?</div>
                    <div>Guests will only get your exact address once they booked a reservation</div>

                    <div className='country'>

                        <label className='sweet'> Country
                            <div className='error'>
                                {submitted && validationErrors.country}
                            </div>

                        </label>
                        <input className='input' type='text' value={country} onChange={(e)=>setCountry(e.target.value)}/>


                    </div>

                    <div className='country'>
                        <label className='sweet'> Street Address
                        <div className='error'>
                            {submitted && validationErrors.streetAddress}
                        </div>

                        </label>
                        <input className='input' type='Address' value={address} onChange={(e)=>setStreetAddress(e.target.value)}/>


                    </div>

                    <div className='country'>
                        <label>City
                            <input className='input' type='city' value={city} onChange={(e)=>setCity(e.target.value)}/>
                        </label>

                        <div className='error'>
                            {submitted && validationErrors.city}
                        </div>
                    </div>


                    <div className='country'>
                        <label>State
                            <input className='input' type='state' value={state} onChange={(e)=>setState(e.target.value)}/>
                        </label>

                        <div className='error'>
                            {submitted && validationErrors.state}
                        </div>
                    </div>


                    <div className='country'>
                        <label>Latitude
                            <input className='input' type='latitude' value={lat} onChange={(e)=>setLatitude(e.target.value)}/>
                        </label>

                        <div className='error'>
                            {submitted && validationErrors.lat}
                        </div>
                    </div>

                    <div className='country'>
                        <label>Longitude
                            <input className='input' type='longitude' value={lng} onChange={(e)=>setLongitude(e.target.value)}/>
                        </label>

                        <div className='error'>
                            {submitted && validationErrors.lng}
                        </div>
                    </div>


                </div>


                <div className='section'>
                    <div className='titles'>Describe your place to your guests</div>

                    <div className='subs'>Mention the best features of your space and any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                    <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Please write at least 30 characters"></textarea>

                    <div className='error'>
                        {submitted && validationErrors.description}
                    </div>

                </div>

                <div className='section'>
                    <div className='titles'>Create a title for your spot</div>
                    <div className='subs'> Catch guests' attention with a spot title that highlights what makes your place special</div>
                    <input className='input' value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name of your spot"/>
                </div>

                <div className='error'>
                        {submitted && validationErrors.name}
                </div>

                <div className='section'>
                    <div className='titles'>Set a base price for your spot</div>
                    <div className='subs'>Competitive pricing can help your listing stand out and rank higher in search results</div>
                    <input className='input' value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price per night (USD)"/>

                    <div className='error'>
                        {submitted && validationErrors.price}
                    </div>
                </div>

                <div className='section'>
                    <div className='titles'>Liven up your spot with photos</div>
                    <div className='subs'>Submit a link to at lest one photo to publish your spot</div>
                    <input className='input' value={image} onChange={(e)=>setImage(e.target.value)} placeholder="Preview of Image URL"/>

                    <div className='error'>
                        {submitted && validationErrors.image}
                    </div>

                    <input className='input' placeholder="Image URL"/>
                    <input className='input' placeholder="Image URL"/>
                    <input className='input' placeholder="Image URL"/>
                    <input className='input' placeholder="Image URL"/>
                </div>


                <button className='createButton' type='newSpot' disabled={buttonOff} >
                    Create Spot
                </button>
            </form>
        </>
    )

}

export default CreateSpot
