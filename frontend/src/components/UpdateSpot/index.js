
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
    // console.log('UPDATE...SPOTSTATE', spotState)

    useEffect(()=>{
        dispatch(spotActions.getSpots())
    },[dispatch])

    const [country, setCountry] = useState(spotState[spotId]?.country)
    const [address, setStreetAddress] = useState(spotState[spotId]?.address)
    const [city, setCity] = useState(spotState[spotId]?.city)
    const [state, setState] = useState(spotState[spotId]?.state)
    const [price, setPrice] = useState(spotState[spotId]?.price)
    const [description, setDescription]=useState(spotState[spotId]?.description)
    const [name, setName] = useState(spotState[spotId]?.name)
    const [image, setImage]= useState(spotState[spotId]?.previewImage)

    const [validationErrors, setValidationErrors] = useState({})
    const [buttonOff, setButtonOff] = useState(false)
    const [submitted, setSubmitted] = useState(false)





    async function handleSubmit (e){
        e.preventDefault()
        setSubmitted(true)

        try{
            const payload ={
                country,
                address,
                city,
                state,
                description,
                name,
                price,
                image
            }


    console.log('UPDATESPOTS...PAYLOAD',payload)

            const created = await dispatch(spotActions.updateSpot(spotId,payload))
            console.log('UPDATE SPOT....INSIDE TRY',created)
            // return created
        }
        catch(created){
            const information = await created.json()
            console.log('UPDATE SPOT...INSIDE CATCH',information)

            if(information.statusCode===400){
                const errors={}

                if(!country) errors['country']='Country is required'
                if(!address) errors['address']='Address is required'
                if(!city) errors['city']='City is required'
                if(!state) errors['state']='State is required'
                if(!description || description.length<30) errors['description']='Description must be 30 or more characters'
                if(!name) errors['name']='Name is required'
                if(name.length>50) errors['name']='Name must be less than 50 characters'
                if(!price) errors['price']='Price is required'
                if(!image) errors['image']='Preview image is required'

                setValidationErrors(errors)
            }
        }



        // reset form values
        // setCountry(country)
        // setStreetAddress(address)
        // setCity(city)
        // setPrice(price)
        // setName(name)
        // setImage(image)

        // setValidationErrors({})
        // setButtonOff(true)

        history.push(`spots/${spotId}`)
    }

    return(
        <>

            <form className='updateForm' onSubmit={handleSubmit}>

                <div className='group'>
                <h2 className='updatePageTitle'>Update your Spot</h2>
                    <div className='title'>Where's your place located?</div>
                    <div>Guests will only get your exact address once they booked a reservation</div>

                    <label> Country
                        <input className='inputField' type='text'
                        value={country}
                        onChange={(e)=>setCountry(e.target.value)}>
                        </input>
                    </label>

                    <div className='error'>
                        {validationErrors.country}
                    </div>

                    <label> Street Address
                        <input className='inputField' type='Address'
                        value={address}
                        onChange={(e)=>setStreetAddress(e.target.value)}>
                        </input>
                    </label>

                    <div className='error'>
                        { submitted && validationErrors.streetAddress && `*${validationErrors.streetAddress}`}
                    </div>

                    <label>City
                        <input type='city'
                        value={city}
                        onChange={(e)=>setCity(e.target.value)}>
                        </input>
                    </label>

                    <div className='error'>
                        {submitted && validationErrors.city && `*${validationErrors.city}`}
                    </div>

                    <label>State
                        <input type='state'
                        value={state}
                        onChange={(e)=>setState(e.target.value)}>
                        </input>
                    </label>

                    <div className='error'>
                        {submitted && validationErrors.state && `*${validationErrors.state}`}
                    </div>

                </div>

                <div className='group'>
                    <div className='title'>Describe your place to your guests</div>
                    <div>Mention the best features of your space and any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                    <textarea className='inputField' value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    placeholder="Please write at least 30 characters"></textarea>

                    <div className='error'>
                        {submitted && validationErrors?.description && `*${validationErrors.description}`}
                    </div>
                </div>

                <div className='group'>
                    <div className='title'>Create a title for your spot</div>
                    <div> Catch guests' attention with a spot title that highlights what makes your place special</div>
                    <input className='inputField'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Name of your spot"></input>
                </div>

                <div className='group'>
                    <div className='title'>Set a base price for your spot</div>
                    <div>Competitive pricing can help your listing stand out and rank higher in search results</div>
                    <input className='inputField'
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    placeholder="Price per night (USD)"></input>

                    <div className='error'>
                        {submitted && validationErrors.price && `*${validationErrors.price}`}
                    </div>
                </div>

                <div className='group'>
                    <div className='title'>Liven up your spot with photos</div>
                    <div>Submit a link to at lest one photo to publish your spot</div>

                    <input
                        className='inputField'
                        value={image}
                        onChange={(e)=>setImage(e.target.value)}
                        placeholder='Preview Image'
                    />


                    <div className='error'>
                        {submitted && validationErrors.image && `*${validationErrors.image}`}
                    </div>

                    <input className='inputField' placeholder="Image URL"></input>
                    <input className='inputField' placeholder="Image URL"></input>
                    <input className='inputField' placeholder="Image URL"></input>
                    <input className='inputField' placeholder="Image URL"></input>
                </div>


                <div className='outerUpdate'>
                    <button className='updateButton' type='newSpot' disabled={buttonOff} >
                        Update your Spot
                    </button>
                </div>

            </form>

        </>
    )

}

export default UpdateSpot
