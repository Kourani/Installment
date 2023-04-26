

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




//get reviews of current user
router.get('/current',async(req,res) =>{

    const allReviews = await Review.findAll({
        where:{
            userId:req.user.id
        }
    })

    res.json(allReviews)
})

//delete a review !!
router.delete('/:id', async(req,res) =>{



    let reviewDelete = await Review.findByPk(req.params.id)

    if(!reviewDelete)
    {
        res.status(404)
    }

    await reviewDelete.destroy()


    res.json({message:'Successfully Deleted'})
})

//edit a review
router.put('/:id', async(req,res)=>{

    let find = await Review.findByPk(req.params.id)

    if(!find){
        res.status(404).send('review does not exist')
    }

    const {
        review,
        stars
    } = req.body

    let reviewEdit = await Review.update({
        review,
        stars
    },
    {
        where:{id:req.params.id}
    }
    )

    let last = await Review.findByPk(reviewEdit[0])

    res.json(last)
})


module.exports = router;
