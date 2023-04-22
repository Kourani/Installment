

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//get all reviews by a spots id
router.get('/:spotId/review' , async (req,res) =>{


    const all = await Review.findAll()

    res.json(all)
})

//get all the reviews
router.get('/current',async(req,res) =>{

    console.log(req.params.current)
    const allReviews = await Review.findAll({
        where:{
            id:req.params.current
        }
    })

    res.json(allReviews)
})


module.exports = router;
