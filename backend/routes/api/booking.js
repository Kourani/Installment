

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

    //find all the bookings that belong to the current user
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

    //input
    const {startDate, endDate} = req.body

    //find the booking by its id
    let findBooking = await Booking.findByPk(req.params.id)




    //if it does not exist ERROR
    if(!findBooking){
        res.status(404).json({message:"Booking couldn't be found", statusCode:404})
        return
    }

    //if the current user did not book ERROR
    if(findBooking.userId !== req.user.id)
    {
        res.status(403).json({message:'Forbidden', statusCode:403})
        return
    }

        //sets the current date in the following format example '2023-1-25' with january being 0
        let  currentTime = new Date()
        const day = String(currentTime.getDate()).padStart(2, '0');
        const  month = String(currentTime.getMonth() + 1).padStart(2, '0');
        const year = currentTime.getFullYear()
        currentTime = year + '-' + month + '-' + day;

        console.log(currentTime,'weeeeeeeeeeeee')

        if(findBooking.endDate < currentTime){
            res.status(403).json({ message: "Past bookings can't be modified",statusCode: 403})
            return
          }


        let newStart1 = new Date(startDate)
        let newEnd1 = new Date(endDate)

        let datee = newStart1.getDate();

        if (datee < 10) {
            datee = '0' + datee;
          }

        let  montha = newStart1.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12

        if (montha < 10) {
            montha= '0' + montha;
          }

        let yeara = newStart1.getFullYear();

      let newStart = yeara + "-" + montha + "-" + datee;

      console.log(newStart)



      let dayy = newEnd1.getDate();

      if (dayy < 10) {
        dayy = '0' + dayy;
      }
      let monthh = newEnd1.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
      if (monthh < 10) {
        monthh = '0' + monthh;
      }

      let yearr = newEnd1.getFullYear();

      let newEnd = yearr + "-" + monthh + "-" + dayy;

  console.log(newEnd)


          let findBookings = await Booking.findAll({raw:true})

          let number =findBooking.id
          console.log(number, 'number')


          for(let i=0; i<findBookings.length; i++){

            if(findBooking.id !== number){

                console.log(findBookings[i].endDate , 'endDate')
                console.log(currentTime, 'current !!!')


              // console.log(findBookings[i].id, findBookings[i].id)

              if(findBookings[i].startDate >= newStart && findBookings[i].endDate <= newEnd){
                res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: [
                  "Start date conflicts with an existing booking",
                    "End date conflicts with an existing booking"]
                    })
                    return
              }

              if(newStart >= findBookings[i].startDate && newStart <=findBookings[i].endDate){
                res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: [
                    "Start date conflicts with an existing booking"]
                    })

                return
              }

              if(newEnd >= findBookings[i].startDate && newStart <=findBookings[i].endDate){
                console.log(newEnd)
                console.log(findBookings[i].startDate)
                console.log(newStart)
                console.log(findBookings[i].endDate)
                res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: [
                    "End date conflicts with an existing booking"]
                    })

                    return
              }



            }


          }

    //     let today = []
    //     let end = []
    //     let start = []
    //     let endRequest = []
    //     let startRequest = []

    //     for(let i=0; i<arr.length; i++){

    //         let convert = parseInt(arr[i])
    //         end.push(convert)

    //         let convert2 = parseInt(arr2[i])
    //         start.push(convert2)

    //         let todaya = parseInt(curr[i])
    //         today.push(todaya)

    //         let end2 = parseInt(end1[i])
    //         endRequest.push(end2)

    //         let start2 = parseInt(start1[i])
    //         startRequest.push(start2)
    //     }


    //     //if the year for booking is prior to todays year CANNOT edit booking
    //     if(end[0] < today[0])
    //     {
    //         res.status(403).json({message:"Past bookings can't be modified", statusCode:403})
    //         return
    //     }

    //     //if the year for booking and today are the same but the month is prior CANNOT edit booking
    //     if(end[0] === today[0] && end[1]<today[1])
    //     {
    //         res.status(403).json({message:"Past bookings can't be modified", statusCode:403})
    //         return
    //     }

    //     //if the year and month for booking and today are the same but the day is prior CANNOT edit booking
    //     if(end[0] === today[0] && end[1] === today[1] && end[2] < today[2])
    //     {
    //         res.status(403).send({message:"Past bookings can't be modified", statusCode:403})
    //         return
    //     }





    //     let update
    //     ///checks if the booking has started but NOT ended

    //          //if the year for booking is prior to todays year CANNOT edit booking
    //          if(start[0] < today[0])
    //          {
    //              update = await findBooking.update({
    //               endDate
    //             })

    //             update.startDate = findBooking.startDate

    //             return res.json(update)
    //          }

    //          //if the year for booking and today are the same but the month is prior CANNOT edit booking
    //          if(start[0] === today[0] && start[1]<today[1])
    //          {
    //           update = await findBooking.update({
    //             endDate
    //           })

    //           update.startDate = findBooking.startDate

    //           return res.json(update)
    //          }

    //          //if the year and month for booking and today are the same but the day is prior CANNOT edit booking
    //          if(start[0] === today[0] && start[1] === today[1] && start[2] < today[2])
    //          {

    //           update = await findBooking.update({
    //             endDate
    //           })

    //           update.startDate = findBooking.startDate
    //           return res.json(update)
    //          }





    //     // if(findBooking.spotId && findBooking.startDate && findBooking.endDate)
    //     // {

    //     //     if(findBooking.startDate === startDate && findBooking.endDate === endDate){

    //     //         if(startRequest[0] < start[0] && start[0] < endRequest[0])
    //     //         {
    //     //             res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
    //     //             error:["Start date conflicts with an existing booking"]})
    //     //             return
    //     //         }

    //     //         if(startRequest[0] === start[0] && startRequest[1] < start[1] && start[1] < endRequest[1])
    //     //         {
    //     //             res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
    //     //             error:["Start date conflicts with an existing booking"]})
    //     //             return
    //     //         }

    //     //         if(startRequest[0] === start[0] && startRequest[1] === start[1] && startRequest[2] < start[2] && start[2] < endRequest[2])
    //     //         {
    //     //             res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
    //     //             error:["Start date conflicts with an existing booking"]})
    //     //             return
    //     //         }

    //     //         if(startRequest[0] < start[0] && start[0]< endRequest[0])
    //     //         {
    //     //             res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
    //     //             error:["Start date conflicts with an existing booking"]})
    //     //             return
    //     //         }

    //     //         if(startRequest[0] === start[0] && startRequest[1] < start[1] && start[1] < endRequest[1])
    //     //         {
    //     //             res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
    //     //             error:["Start date conflicts with an existing booking"]})
    //     //             return
    //     //         }

    //     //         if(startRequest[0] === start[0] && startRequest[1] === start[1] && startRequest[2] < start[2] && start[2] < endRequest[2])
    //     //         {
    //     //             res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", statusCode:403,
    //     //             error:["Start date conflicts with an existing booking"]})
    //     //             return
    //     //         }
    //     //     }
    //     // }

    //     let bodyStart = startDate.split('-')
    //     let bodyEnd = endDate.split('-')


    //     let bookingStart = []
    //     let bookingEnd = []

    //     let startYear = []
    //     let startMonth = []
    //     let startDay = []

    //     let endYear = []
    //     let endMonth = []
    //     let endDay = []



    //     let allBooks1 = await Booking.findAll()
    //     let allBooks = []
    //     for(let z=0; z<allBooks1.length; z++){
    //       // console.log('ggggghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    //       // console.log(allBooks1[z].id)
    //       // console.log(parseInt(req.params.id))
    //       if (allBooks1[z].id !== parseInt(req.params.id)){
    //         allBooks.push(allBooks1[z])
    //       }
    //     }

    //     // res.send(allBooks)

    //     // res.json(allBooks)
    //     // res.json(allBooks)

    // //creates an array of arraes for end and start
    //     for(let k=0; k<allBooks.length; k++){
    //     let books = allBooks[k].startDate.split('-')

    //     bookingStart.push(books)

    //     let bookEnd = allBooks[k].endDate.split('-')

    //     bookingEnd.push(bookEnd)

    //     }


    //   //creates a 3 sepearte array for year month and day
    //   for(let q=0; q<bookingStart.length; q++){

    //     if(Array.isArray(bookingStart[q])){
    //       console.log(q, 'hereeeeeeeeeeeeeeeeeeeeeeee')
    //       startYear.push(bookingStart[q][0])
    //       startMonth.push(bookingStart[q][1])
    //       startDay.push(bookingStart[q][2])

    //       endYear.push(bookingEnd[q][0])
    //       endMonth.push(bookingEnd[q][1])
    //       endDay.push(bookingEnd[q][2])
    //     }
    //   }


    //   for ( l=0; l<startYear.length; l++){

    //     // if the START year and month is the same BUT the day is different

    //     //&& (bodyStart[2] < startDay[l] && bodyEnd[2] < startDay[l]) was included in the if statement below !!
    //     if( (startYear[l] === bodyStart[0] && bodyEnd[0] <= startYear[l]) && (startMonth[l] === bodyStart[1] && bodyEnd[1] <= startMonth[l]) )
    //     {

    //       if(bodyStart[2] >= startDay[l]){

    //         res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //           statusCode: 403,
    //           errors: [
    //               "Start date conflicts with an existing booking",
    //               "End date conflicts with an existing booking "]
    //               })

    //               return

    //       }

    //       if(bodyEnd[2] >= startDay[l]){

    //         res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //           statusCode: 403,
    //           errors: [
    //               "End date conflicts with an existing booking "]
    //               })

    //               return

    //       }

    //     update = await findBooking.update({
    //         startDate,
    //         endDate
    //     })

    //     return res.json(update)
    //     }

    //     // if the END year and month is the same BUT the day is different

    //     // && (bodyStart[2] > endDay[l] && bodyEnd[2] > endDay[l]) was included in the if statement below !!
    //     if( (endYear[l] === bodyStart[0] && bodyEnd[0] >= endYear[l]) && (endMonth[l] === bodyStart[1] && bodyEnd[1] >= endMonth[l])  )
    //       {
    //         // res.send('hereeeeeeeeee')

    //         if(bodyStart[2] <= endDay[l] && bodyEnd[2] <=endDay[l]){

    //           res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //             statusCode: 403,
    //             errors: [
    //                 "Start date conflicts with an existing booking",
    //                 "End date conflicts with an existing booking"]
    //                 })

    //                 return

    //               }


    //         if(bodyStart[2] <= endDay[l]){

    //           res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //             statusCode: 403,
    //             errors: [
    //                 "Start date conflicts with an existing booking"]
    //                 })

    //                 return

    //               }


    //               update = await findBooking.update({
    //                 startDate,
    //                 endDate
    //             })

    //             return res.json(update)
    //     }




    //     if(startYear[l] === bodyEnd[0] && bodyStart[0] <= startYear[l] && (startMonth[l] === bodyEnd[1] && bodyStart[1] <= startMonth[l]) ){

    //       console.log('hhhhhhhhhhhhhaaaaaaaaaaahv')

    //       if(bodyEnd[2] < startDay[l])
    //       {

    //         update = await findBooking.update({
    //           startDate,
    //           endDate
    //       })

    //       return res.json(update)

    //       }
    //     }



    //      //if the START year is the same but the month is different
    //     if( startYear[l] === bodyStart[0] && bodyEnd[0] <= startYear[l] )
    //     {

    //       if(bodyEnd[1] >= startMonth[l] && bodyStart[1] >= startMonth[l]){

    //         res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //         statusCode: 403,
    //         errors: [
    //           "End date conflicts with an existing booking",
    //           "Start date conflicts with an existing booking"]
    //         })

    //         return
    //       }

    //       if(bodyEnd[1] >= startMonth[l]){

    //         res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //         statusCode: 403,
    //         errors: [
    //           "End date conflicts with an existing booking"]
    //         })

    //         return
    //       }


    //       if((bodyStart[1] < startMonth[l] && bodyEnd[1] < startMonth[l])) {


    //         update = await findBooking.update({
    //             startDate,
    //             endDate
    //         })

    //         return res.json(update)

    //       }

    //     }

    //     //if the END year is the same but the month is different
    //     if( endYear[l] === bodyStart[0] && bodyEnd[0] >= endYear[l] )
    //     {

    //       if(bodyStart[1] <= endMonth[l] && bodyEnd[1] <= endMonth[l]){

    //         res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //           statusCode: 403,
    //           errors: [
    //               "Start date conflicts with an existing booking",
    //               "End date conflicts with an existing booking"]
    //               })

    //               return

    //             }

    //       if(bodyStart[1] <= endMonth[l]){

    //         res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //           statusCode: 403,
    //           errors: [
    //               "Start date conflicts with an existing booking"]
    //               })

    //               return

    //             }

    //             for(let z=0; z<endYear.length; z++){
    //               if(bodyStart[0]<=startYear[l] && bodyEnd[0]>=endYear[z]){
    //                 res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //                 statusCode: 403,
    //                 errors: [
    //                     "End date conflicts with an existing booking"]
    //                     })

    //                     return
    //               }
    //             }


    //             if((bodyStart[1] > endMonth[l] && bodyEnd[1] > endMonth[l])) {


    //                 update = await findBooking.update({
    //                     startDate,
    //                     endDate
    //                 })

    //                 return res.json(update)
    //             }

    //     }


    //     if(startYear[l] === bodyEnd[0] && bodyStart[0] <= startYear[l] ){

    //       console.log('hhhhhhhhhhhhhaaaaaaaaaaahv')

    //       if(bodyEnd[1] < startMonth[l])
    //       {

    //         update = await findBooking.update({
    //           startDate,
    //           endDate
    //       })

    //       return res.json(update)

    //       }
    //     }


    //     //COMPARE BASED ON YEAR ONLY !!!

    //     //if the booking start and end falls between an existing booking ERROR
    //     if((startYear[l] <= bodyEnd[0] && bodyEnd[0] <= endYear[l]) && (startYear[l] <= bodyStart[0] && bodyStart[0] <= endYear[l]) ){

    //       res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //       statusCode: 403,
    //       errors: [
    //         "Start date conflicts with an existing booking",
    //         "End date conflicts with an existing booking"
    //       ]
    //       })
    //       return
    //     }

    //     //if the booking starts during an existing booking ERROR
    //     if(startYear[l] <= bodyStart[0] && bodyStart[0] <= endYear[l]){

    //       res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //       statusCode: 403,
    //       errors: [
    //         "Start date conflicts with an existing booking"
    //       ]
    //       })
    //       return
    //     }

    //     //if the booking ends during an existing booking ERROR
    //     if(startYear[l] <= bodyEnd[0] && bodyEnd[0] <= endYear[l]){

    //       res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //       statusCode: 403,
    //       errors: [
    //         "End date conflicts with an existing booking"]
    //       })
    //       return
    //     }

    //     //if the booking length encapsulates a current booking error
    //     if(bodyStart[0] < startYear[l] && bodyEnd[0] > startYear[l]){

    //       res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates",
    //       statusCode: 403,
    //       errors: [
    //         "End date Conflicts with an existing booking"]
    //       })
    //       return
    //     }

    //   }


      let first = await findBooking.update({
        startDate,
        endDate
    })

    return res.json(first)
})


module.exports = router;
