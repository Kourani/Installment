

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//get all bookings for a spot based on the spots Id 
router.get('/:spotId' , async (req,res) =>{

    const all = await Booking.findAll({


    })
    return all
})

//get all of the current users bookings
router.get('/:userId', async(req,res)=>{
    const allBookings = await Booking.findAll({
        where:{userId: req.params.userId}
    })

    res.json(allBookings)
})


module.exports = router;
