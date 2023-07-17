
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

    const [lat, setLatitude] = useState('')
    const [lng, setLongitude] = useState('')

    const [url, setImage]= useState('')
    const [image1, setImage1]= useState('')
    const [image2, setImage2]= useState('')
    const [image3, setImage3]= useState('')
    const [image4, setImage4]= useState('')

    const [preview, setPreview]=useState(true)

    const [validationErrors, setValidationErrors] = useState({})

    const [submitted, setSubmitted] = useState(false)
    const [buttonOff, setButtonOff] = useState(true)



    const payload ={
        country,
        address,
        city,
        state,
        description,
        name,
        price,
        lat,
        lng
    }

    const imagePayload ={
        url,
        preview
    }

    const imagePayload1 ={
        url:image1,
        preview
    }

    const imagePayload2 ={
        url:image2,
        preview
    }

    const imagePayload3 ={
        url:image3,
        preview
    }

    const imagePayload4 ={
        url:image4,
        preview
    }

    useEffect(()=>{
        if(country && address && city && state && price && description && name && url){
            setButtonOff(false)
        }

    },[dispatch, validationErrors, country, address, city, state, price, description, name, url])


    console.log('valid',validationErrors)
    // console.log(validationErrors)

    function stringOfDigits(price) {
        return /^\d+$/.test(price)
    }

    function stringOfDigitsLat(lat) {
            if(lat !== undefined ){
                return /^\d+$/.test(lat)
            }
    }

    function stringOfDigitsLng(lng) {
            if(lng!==undefined) {
                return /^\d+$/.test(lng)
            }
    }

    async function handleSubmit (e){
        e.preventDefault()

        setSubmitted(true)

    if(!url || (!(url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') ) ) ) {

        console.log('no URL')

                const errors = {}
                if(!country) errors['country']='Country is required'
                if(!address) errors['streetAddress']='Address is required'
                if(!city) errors['city']='City is required'
                if(!state) errors['state']='State is required'
                if(!description  || description.length<30) errors['description']='Description needs a minimum of 30 characters'
                if(!name) errors['name'] ='Name is required'
                if(name.length>50) errors['name']='Name must be less than 50 characters'
                if(!price) errors['price']='Price per night is required'
                if(price && stringOfDigits(price)===false) errors['price']=`price must be a number`

                if(!url) errors['image']='Preview Image is required'
                if(url && !(url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg'))) errors['image']='Preview Image URL must end in .png .jpg or .jpeg'


                if(image1 && !(image1.endsWith('.png') || image1.endsWith('.jpg') || image1.endsWith('.jpeg') ) ) errors['image1']='Image URL must end in .png .jpg or .jpeg'
                if(image2 && !(image2.endsWith('.png') || image2.endsWith('.jpg') || image2.endsWith('.jpeg') ) ) errors['image2']='Image URL must end in .png .jpg or .jpeg'
                if(image3 && !(image3.endsWith('.png') || image3.endsWith('.jpg') || image3.endsWith('.jpeg'))) errors['image3']='Image URL must end in .png .jpg or .jpeg'
                if(image4 && !(image4.endsWith('.png') || image4.endsWith('.jpg') || image4.endsWith('.jpeg'))) errors['image4']='Image URL must end in .png .jpg or .jpeg'

                setValidationErrors(errors)

    }

    if(url && ((url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') ) )){

        console.log('yes url')

        try {
            const created = await dispatch(spotActions.createSpot(payload));
            console.log('TRY BLOCK....CREATED',created)

            const imageCreation=await dispatch(spotActions.createImage(created.id, imagePayload))

            if(image1!==''){
                const imageCreation=await dispatch(spotActions.createImage(created.id, imagePayload1))
            }

            if(image2!==''){
                const imageCreation=await dispatch(spotActions.createImage(created.id, imagePayload2))
            }

            if(image3!==''){
                const imageCreation=await dispatch(spotActions.createImage(created.id, imagePayload3))
            }

            if(image4!==''){
                const imageCreation=await dispatch(spotActions.createImage(created.id, imagePayload4))
            }

            history.push(`/spots/${created.id}`)
            return
        }
        catch (created) {

            const errors ={}

            const information = await created.json()

            console.log(information)

            if(information.statusCode===400){

                if(!country) errors['country']='Country is required'
                if(!address) errors['streetAddress']='Address is required'
                if(!city) errors['city']='City is required'
                if(!state) errors['state']='State is required'
                if(!description  || description.length<30) errors['description']='Description needs a minimum of 30 characters'
                if(!name) errors['name'] ='Name is required'
                if(name.length>50) errors['name']='Name must be less than 50 characters'
                if(!price) errors['price']='Price per night is required'
                if(price && stringOfDigits(price)===false) errors['price']=`price must be a number`

                if(!url) errors['image']='Preview Image is required'
                if(url && !(url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg'))) errors['image']='Preview Image URL must end in .png .jpg or .jpeg'

                if(image1 && !(image1.endsWith('.png') || image1.endsWith('.jpg') || image1.endsWith('.jpeg') ) ) errors['image1']='Image URL must end in .png .jpg or .jpeg'
                if(image2 && !(image2.endsWith('.png') || image2.endsWith('.jpg') || image2.endsWith('.jpeg') ) ) errors['image2']='Image URL must end in .png .jpg or .jpeg'
                if(image3 && !(image3.endsWith('.png') || image3.endsWith('.jpg') || image3.endsWith('.jpeg'))) errors['image3']='Image URL must end in .png .jpg or .jpeg'
                if(image4 && !(image4.endsWith('.png') || image4.endsWith('.jpg') || image4.endsWith('.jpeg'))) errors['image4']='Image URL must end in .png .jpg or .jpeg'

                setValidationErrors(errors)
            }

            if(information.statusCode===500){
                errors['internal']='Something unexpected has occured. Please Try again'
                setValidationErrors(errors)
            }
        }
    }

        // reset form values
        setCountry('')
        setStreetAddress('')
        setCity('')
        setState('')
        setDescription('')
        setName('')
        setPrice('')
        setLatitude(undefined)
        setLongitude(undefined)

        setImage('')
        setImage1('')
        setImage2('')
        setImage3('')
        setImage4('')

        setButtonOff(true)
    }



    return(
        <>
            <form className='createForm' onSubmit={handleSubmit}>

                <div className='error'>
                            {submitted && validationErrors.internal}
                </div>

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

                        <input
                            className='input'
                            type='text'
                            placeholder='Country'
                            value={country}
                            onChange={(e)=>setCountry(e.target.value)}
                        />

                    </div>

                    <div className='country'>
                        <label className='sweet'> Street Address
                        <div className='error'>
                            {submitted && validationErrors.streetAddress}
                        </div>

                        </label>
                        <input
                        className='input'
                        type='Address'
                        placeholder='Address'
                        value={address}
                        onChange={(e)=>setStreetAddress(e.target.value)}/>


                    </div>

                    <div className='cityAndState'>
                        <div className='country'>
                            <label className='sweet'>City
                            <div className='error'>
                                {submitted && validationErrors.city}
                            </div>

                            </label>

                            <div className='comma'>
                                <input
                                className='inputCity'
                                type='city'
                                placeholder='City'
                                value={city}
                                onChange={(e)=>setCity(e.target.value)}/>
                                <span className='commaSpan'>,</span>
                            </div>
                        </div>


                        <div className='country'>
                            <label className='sweet'>State
                                <div className='error'>
                                    {submitted && validationErrors.state}
                                </div>
                            </label>

                            <input
                            className='input'
                            type='state'
                            placeholder='STATE'
                            value={state}
                            onChange={(e)=>setState(e.target.value)}/>
                        </div>
                    </div>

                    <div className='latAndLng'>
                        <div className='country'>
                            <label className='sweet'>Latitude
                            <div className='error'>
                                {submitted && validationErrors.lat}
                            </div>
                            </label>
                            <div className='comma'>
                            <input
                            className='input'
                            type='latitude'
                            placeholder='Latitude'
                            value={lat}
                            onChange={(e)=>setLatitude(e.target.value)}/>
                            <span className='commaSpan'>,</span>
                            </div>
                        </div>

                        <div className='country'>
                            <label className='sweet'>Longitude
                                <div className='error'>
                                    {submitted && validationErrors.lng}
                                </div>
                            </label>

                            <input
                            className='input'
                            type='longitude'
                            placeholder='Longitude'
                            value={lng}
                            onChange={(e)=>setLongitude(e.target.value)}/>
                        </div>
                    </div>


                </div>


                <div className='section'>
                    <div className='titles'>Describe your place to your guests</div>

                    <div className='subs'>Mention the best features of your space and any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                    <textarea className='textAreaCreateSpot' value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Please write at least 30 characters"></textarea>

                    <div className='error'>
                        {submitted && validationErrors.description}
                    </div>

                </div>

                <div className='section'>
                    <div className='titles'>Create a title for your spot</div>
                    <div className='subs'> Catch guests' attention with a spot title that highlights what makes your place special</div>
                    <input className='input' value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name of your spot"/>

                    <div className='error'>
                        {submitted && validationErrors.name}
                    </div>
                </div>



                <div className='section'>
                    <div className='titles'>Set a base price for your spot</div>
                    <div className='subs'>Competitive pricing can help your listing stand out and rank higher in search results</div>
                    <div className='createNewSpotPrice'>
                        $<input className='inputFixedPrice' value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price per night (USD)"/>
                    </div>

                    <div className='error'>
                        {submitted && validationErrors.price}
                    </div>
                </div>

                <div className='section'>
                    <div className='titles'>Liven up your spot with photos</div>
                    <div className='subs'>Submit a link to at lest one photo to publish your spot</div>
                    <input className='input' value={url} onChange={(e)=>setImage(e.target.value)} placeholder="Preview Image URL"/>

                    <div className='error'>
                        {submitted && validationErrors.image}
                    </div>

                    <input className='input' value={image1} onChange={(e)=>setImage1(e.target.value)} placeholder="Image URL"/>
                    <div className='error'>
                        {submitted && validationErrors.image1}
                    </div>

                    <input className='input' value={image2} onChange={(e)=>setImage2(e.target.value)} placeholder="Image URL"/>
                    <div className='error'>
                        {submitted && validationErrors.image2}
                    </div>

                    <input className='input' value={image3} onChange={(e)=>setImage3(e.target.value)} placeholder="Image URL"/>
                    <div className='error'>
                        {submitted && validationErrors.image3}
                    </div>

                    <input className='input' value={image4} onChange={(e)=>setImage4(e.target.value)} placeholder="Image URL"/>
                    <div className='error'>
                        {submitted && validationErrors.image4}
                    </div>

                </div>


                <button className='createButton' type='newSpot' disabled={false} >
                    Create Spot
                </button>
            </form>
        </>
    )

}

export default CreateSpot
