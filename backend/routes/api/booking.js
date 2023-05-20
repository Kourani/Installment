

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, Image } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



const validateBooking= [
      check('endDate').custom((value, { req }) => {
        if(new Date(value) <= new Date(req.body.startDate)) {
            throw new Error ("endDate cannot come before startDate");
        }
        return true
    }),


    handleValidationErrors
  ];

//get all of the current users bookings
router.get('/current', requireAuth, async(req,res)=>{

    let allBookings = await Booking.findAll({
        where:{userId: req.user.id},
        // include:[
        //     {
        //         model:Spot,
        //         attributes:['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],

        //         include:[{
        //             model:Image,
        //             attributes:['preview']
        //         }]
        //     },
        // ]
    })

    //finding ALL the SPOTS
    const BookingSpot = await Spot.findAll({
        // where:{ownerId:req.user.id},
        attributes:[
            'id', 'ownerId', 'address',
            'city', 'state', 'country', 'lat',
            'lng', 'name', 'price'
        ]
    })

    // res.json(BookingSpot)

    //finding ALL the current user SPOTS with IMAGES
    // const BookingSpotImage = await Spot.findAll({
    //     where:{ownerId:req.user.id},
    //     include:[{
    //         model:Image,
    //     }]
    // })

    const BookingSpotImage = await Image.findAll({
        where:{imagableType:"Spot"},
    })

    const plainFirst = BookingSpot.map(x => x.get({ plain: true }))

    // res.json(BookingSpotImage)


    for(let i=0; i<plainFirst.length; i++){
        for(let c=0; c<BookingSpotImage.length; c++){
            if(plainFirst[i].id === BookingSpotImage[c].imagableId)
            {
                plainFirst[i].previewImage=BookingSpotImage[c].url
            }
        }
    }

    let pf = allBookings.map(x => x.get({ plain: true }))

    console.log(plainFirst.length, 'SpotImage')
    console.log(pf.length, 'bookings')


    for(let i=0; i<plainFirst.length; i++){
        if(!plainFirst[i].previewImage)
        {
            plainFirst[i].previewImage=null
        }
    }

    // res.json(pf)

    for(let index = 0; index<pf.length; index++){
        for(let indexx=0; indexx<plainFirst.length; indexx++){
            // console.log(index, indexx)

            // console.log(pf[index].spotId, 'pf')
            console.log(plainFirst[indexx].id, 'ssssssss')
            if(pf[index].spotId === plainFirst[indexx].id)
            {
                pf[index].Spot = plainFirst[indexx]
            }
        }
    }

    for(let i=0; i<pf.length; i++){
        if(!pf[i].Spot){
            // 'Spot that was booked is currently not available'
            pf[i].Spot=[]
        }
    }

    let object = {Bookings:pf}
    res.json(object)
    return
})


//delete a booking !!
router.delete('/:id', requireAuth, async(req,res) =>{

    //creates an array with one element :: an object
    let deleteBooking = await Booking.findByPk(req.params.id)

    //if the booking does not exist
    if(!deleteBooking)
    {
        res.status(404).json({message:"Booking couldn't be found", statusCode:404})
        return
    }

    //sets the current date in the following format example '2023-1-25' with january being 0
    let  currentTime = new Date()
    const day = String(currentTime.getDate()).padStart(2, '0');
    const  month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const year = currentTime.getFullYear();

    currentTime = year + '-' + month + '-' + day;

    //creates an array of the date for each booking and today with the elements in
    //the following order [year, month, day]

    let arr = deleteBooking.startDate.split('-')
    let arrDate = currentTime.split('-')


    //creates two emtpy arrays
    let startDate = []
    let todayDate = []

    //loops through the booking array and converts the
    //data type into integer for both booking and todays date
    //pushes the converted data type into its own array
    for(let i =0; i<arr.length; i++)
    {
        let numberArr = parseInt(arr[i])
        startDate.push(numberArr)
        let tDate = parseInt(arrDate[i])
        todayDate.push(tDate)

    }

    //if the year for booking is prior to todays year CANNOT delete
    if(startDate[0] < todayDate[0])
    {
        res.status(403).json({message:"Bookings that have been started can't be deleted", statusCode:403})
        return
    }

    //if the year for booking and today are the same but the month is prior CANNOT delete
    if(startDate[0] === todayDate[0] && startDate[1]<todayDate[1])
    {
        res.status(403).json({message:"Bookings that have been started can't be deleted", statusCode:403})
        return
    }

      //if the year and month for booking and today are the same but the day is prior CANNOT delete
    if(startDate[0] === todayDate[0] && startDate[1] === todayDate[1] && startDate[2] < todayDate[2])
    {
        res.status(403).json({message:"Bookings that have been started can't be deleted", statusCode:403})
        return
    }


    //creator of the booking can delete
    if(deleteBooking.userId === req.user.id)
    {
        await deleteBooking.destroy()
        res.json({message:'Successfully Deleted', statusCode:200})
        return
    }

    const findSpots = await Spot.findAll({
        where:{ownerId:deleteBooking.userId}
    })

    //owner of the spot can delete
    if(findSpots.ownerId === req.user.id)
    {
        await deleteBooking.destroy()
        res.json({message:'Successfully Deleted'})
        return
    }

    res.status(403).json({message:'Forbidden', statusCode:403})
})


//edit a booking
router.put('/:id', requireAuth, validateBooking, async(req,res)=>{

    const {startDate, endDate}=req.body

    let findBooking = await Booking.findByPk(req.params.id)

    if(!findBooking){
        res.status(404).json({message:"Booking couldn't be found", statusCode:404})
        return
    }

        //sets the current date in the following format example '2023-1-25' with january being 0
        let  currentTime = new Date()
        const day = String(currentTime.getDate()).padStart(2, '0');
        const  month = String(currentTime.getMonth() + 1).padStart(2, '0');
        const year = currentTime.getFullYear();

        currentTime = year + '-' + month + '-' + day;


        let arr = findBooking.endDate.split('-')
        let arr2 = findBooking.startDate.split('-')
        let curr = currentTime.split('-')
        let end1 = endDate.split('-')
        let start1 = startDate.split('-')

        console.log(findBooking.endDate, 'aaa')
        console.log(endDate, 'bbbbbb')


        let today = []
        let end = []
        let start = []
        let endRequest = []
        let startRequest = []

        for(let i=0; i<arr.length; i++){

            let convert = parseInt(arr[i])
            end.push(convert)

            let convert2 = parseInt(arr2[i])
            start.push(convert2)

            let todaya = parseInt(curr[i])
            today.push(todaya)

            let end2 = parseInt(end1[i])
            endRequest.push(end2)

            let start2 = parseInt(start1[i])
            startRequest.push(start2)
        }

        console.log(end)
        console.log(today)
        console.log(startRequest)
        console.log(endRequest)

    //if the year for booking is prior to todays year CANNOT edit booking
    if(end[0] < today[0])
    {
        res.status(403).json({message:"Past bookings can't be modified", statusCode:403})
        return
    }

    //if the year for booking and today are the same but the month is prior CANNOT edit booking
    if(end[0] === today[0] && end[1]<today[1])
    {
        res.status(403).json({message:"Past bookings can't be modified", statusCode:403})
        return
    }

      //if the year and month for booking and today are the same but the day is prior CANNOT edit booking
    if(end[0] === today[0] && end[1] === today[1] && end[2] < today[2])
    {
        res.status(4003).send({message:"Past bookings can't be modified", statusCode:403})
        return
    }


    console.log(end, 'endddd')
    console.log(endRequest, 'req')

        // if(
        //     end[0] === endRequest[0] &&
        //     end[1] === endRequest[1] &&
        //     end[2] === endRequest[2] &&
        //     start[0] === startRequest[0] &&
        //     start[1] === startRequest[1] &&
        //     start[2] === startRequest[2]
        //     )
        // {
        //     // res.status(403).json({message:'Forbidden', status:403})
        //     // return
        // }



        // if(endRequest[0] < start[0] < endRequest[0])
        // {
        //     res.status(403).json({message: "Start date conflicts with an existing booking"})
        // }

        // if(startRequest[0] === start[0] && startRequest[1] < start[1] < endRequest[1])
        // {
        //     res.status(403).json({message: "Start date conflicts with an existing booking"})
        // }

        // if(startRequest[0] === start[0] && startRequest[1] === start[1] && startRequest[2] < start[2] < endRequest[2])
        // {
        //     res.status(403).json({message: "Start date conflicts with an existing booking"})
        // }


        // let findBooking1 = await Booking.findAll({
        //     where:{id:req.params.id},
        //     // include:[
        //     //     {
        //     //     model:Spot,
        //     //     }
        //     // ]
        //   })

        //   res.json(findBooking1)

        // let Datee = startDate.split('-')
        // console.log(Datee)

        // let enda = endDate.split('-')
        // console.log(enda, 'end')

        // for(let i=0; i<findBooking1.length; i++){



        //   let insidee = findBooking1[i].startDate.split('-')
        //   console.log(insidee, 'startttt')

        //   let inside = findBooking1[i].endDate.split('-')
        //   console.log(inside, 'startttt')

        //   let insideDateI = parseInt(insidee[i])
        //   let insideEndI=parseInt(inside)

        //   let DateI = parseInt(Datee[i])
        //   let endI = parseInt(enda[i])

        //     if(insideDateI<DateI && DateI<insideEndI){
        //       console.log(insideDateI, 'insideDateI')
        //       console.log(DateI, 'DateI'),
        //       console.log(insideEndI, 'insideEndI')

        //       res.status(403).json({message: "Sorry, this spot is already booked for the specified dates", errors: ["Start date conflicts with an existing booking"], status:403})
        //       return
        //     }

        //     if(insideDateI<endI && endI<insideEndI){
        //       console.log(insideDateI, 'insideDateIeeeeeeee')
        //       console.log(DateI, 'DateIeeeeeeeeee'),
        //       console.log(endI, 'endIeeeeeeeeee'),
        //       console.log(insideEndI, 'insideEndIeeeeeeeee')

        //       res.status(403).json({message: "Sorry, this spot is already booked for the specified dates", errors: ["End date conflicts with an existing booking"],status:403})
        //       return
        //     }

        //   if(findBooking1[i].startDate === startDate && findBooking1[i].endDate === endDate){
        //     // res.status(403).send('Booking already exists for the spot on the selected dates')
        //     res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", errors: [
        //       "Start date conflicts with an existing booking",
        //       "End date conflicts with an existing booking"
        //     ], status:403})
        //     return
        //   }
        // }


        console.log(findBooking.spotId)
        if(findBooking.spotId && findBooking.startDate && findBooking.endDate)
        {
            // console.log((findBooking.startDate))
            // console.log(startDate, 'rrrr')
            if(findBooking.startDate === startDate && findBooking.endDate === endDate){

                if(startRequest[0] < start[0] < endRequest[0])
                {
                    res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
                    error:["Start date conflicts with an existing booking"]})
                    return
                }

                if(startRequest[0] === start[0] && startRequest[1] < start[1] < endRequest[1])
                {
                    res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
                    error:["Start date conflicts with an existing booking"]})
                    return
                }

                if(startRequest[0] === start[0] && startRequest[1] === start[1] && startRequest[2] < start[2] < endRequest[2])
                {
                    res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
                    error:["Start date conflicts with an existing booking"]})
                    return
                }




                if(startRequest[0] < start[0] && start[0]< endRequest[0])
                {
                    res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
                    error:["Start date conflicts with an existing booking"]})
                    return
                }

                if(startRequest[0] === start[0] && startRequest[1] < start[1] < endRequest[1])
                {
                    res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
                    error:["Start date conflicts with an existing booking"]})
                    return
                }

                if(startRequest[0] === start[0] && startRequest[1] === start[1] && startRequest[2] < start[2] < endRequest[2])
                {
                    res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
                    error:["Start date conflicts with an existing booking"]})
                    return
                }
            }
        }

    //only the owner of the booking can update the booking
    if(findBooking.userId === req.user.id)
    {
        await findBooking.update({
            startDate,
            endDate
        })

    res.json(findBooking)
    return
    }


    res.status(403).json({message:'Forbidden', statusCode:403})

})





module.exports = router;
