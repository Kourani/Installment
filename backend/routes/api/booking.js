

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//get all of the current users bookings
router.get('/current', async(req,res)=>{
    
    const allBookings = await Booking.findAll({
        where:{userId: req.user.id}
    })

    res.json(allBookings)
})


//delete a booking !!
router.delete('/:id', async(req,res) =>{

    let bookingDelete = await Booking.findByPk(req.params.id)

    if(!bookingDelete)
    {
        res.status(404)
    }

    await bookingDelete.destroy()


    res.json({message:'Successfully Deleted'})
})


//edit a booking
router.put('/:id', async(req,res)=>{

    const {
        startDate,
        endDate,

    }=req.body

    let editBooking = await Booking.update({
        startDate,
        endDate,
        userId: req.user.id,

    },
    {
        where:{id:req.params.id}
    })

    console.log(editBooking)
    console.log(req.params.id)
    // let final = await Booking.findByPk(editBooking[0])

    res.json(editBooking)
})





module.exports = router;
