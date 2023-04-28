

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, Image } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//get all of the current users bookings
router.get('/current', requireAuth, async(req,res)=>{

    const allBookings = await Booking.findAll({
        where:{userId: req.user.id},
        include:[
            {
                model:Spot,
                attributes:['id', 'userId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],

                include:[{
                    model:Image,
                    attributes:['preview']
                }]
            },
        ]
    })

    res.json(allBookings)
})


//delete a booking !!
router.delete('/:id', requireAuth, async(req,res) =>{

    //creates an array with one element :: an object
    let deleteBooking = await Booking.findByPk(req.params.id)

    //if the booking does not exist
    if(!deleteBooking)
    {
        res.status(404).send('Booking does not exist')
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
        res.status(400).send('Cannot delete booking, Booking was set to start in a prior year')
        return
    }

    //if the year for booking and today are the same but the month is prior CANNOT delete
    if(startDate[0] === todayDate[0] && startDate[1]<todayDate[1])
    {
        res.status(400).send('Cannot delete booking, Booking was set to start in a prior month')
        return
    }

      //if the year and month for booking and today are the same but the day is prior CANNOT delete
    if(startDate[0] === todayDate[0] && startDate[1] === todayDate[1] && startDate[2] < todayDate[2])
    {
        res.status(400).send('Cannot delete booking, Booking was set to start in a prior day of the month')
        return
    }


    //creator of the booking can delete
    if(deleteBooking.userId === req.user.id)
    {
        await deleteBooking.destroy()
        res.json({message:'Successfully Deleted'})
        return
    }

    const findSpots = await Spot.findAll({
        where:{userId:deleteBooking.userId}
    })

    //owner of the spot can delete
    if(findSpots.userId === req.user.id)
    {
        await deleteBooking.destroy()
        res.json({message:'Successfully Deleted'})
        return
    }

    res.send('You did not book this trip')
})


//edit a booking
router.put('/:id', requireAuth, async(req,res)=>{

    const {startDate, endDate}=req.body

    let findBooking = await Booking.findByPk(req.params.id)

    if(!findBooking){
        res.status(404).send('Booking does not exist')
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

        // console.log(end)
        // console.log(today)
        // console.log(startRequest)
        // console.log(endRequest)

    //if the year for booking is prior to todays year CANNOT edit booking
    if(end[0] < today[0])
    {
        res.status(400).send('Cannot edit booking, Booking was set to end in a prior year')
        return
    }

    //if the year for booking and today are the same but the month is prior CANNOT edit booking
    if(end[0] === today[0] && end[1]<today[1])
    {
        res.status(400).send('Cannot edit booking, Booking was set to end in a prior month')
        return
    }

      //if the year and month for booking and today are the same but the day is prior CANNOT edit booking
    if(end[0] === today[0] && end[1] === today[1] && end[2] < today[2])
    {
        res.status(400).send('Cannot edit booking, Booking was set to end in a prior day of the month')
        return
    }


    console.log(end)
    console.log(endRequest)

        //if
        if(
            end[0] === endRequest[0] &&
            end[1] === endRequest[1] &&
            end[2] === endRequest[2] &&
            start[0] === startRequest[0] &&
            start[1] === startRequest[1] &&
            start[2] === startRequest[2]
            )
        {
            res.status(403).send('Cannot edit booking, Booking already exists with those start and end dates')
            return
        }


    if(findBooking.userId === req.user.id)
    {
        await findBooking.update({
            startDate,
            endDate
        })


    res.send(findBooking)
    }


    res.send('you did not create this booking')

})





module.exports = router;
