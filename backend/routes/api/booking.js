

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
    if(startDate[0] === todayDate[0] && startDate[1] === todayDate[1] && startDate[2] < todayDate)
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
router.put('/:id', async(req,res)=>{


    let findBooking = await Booking.findByPk(req.params.id)

    const {
        startDate,
        endDate,

    }=req.body


    console.log(findBooking)

    // await findBooking.update({
    //     startDate,
    //     endDate,
    //     userId: req.user.id

    // })


//     const jane = await User.create({ name: "Jane" });
// jane.favoriteColor = "blue"
// await jane.update({ name: "Ada" })
// // The database now has "Ada" for name, but still has the default "green" for favorite color
// await jane.save()

    res.json(findBooking)

})





module.exports = router;
