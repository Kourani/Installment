

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, Spot, Image } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




//get reviews of current user
router.get('/current',requireAuth, async(req,res) =>{

    const allReviews = await Review.findAll({
        where:{
            userId:req.user.id
        },
        include:[{
            model:User,
            attributes:['id', 'firstName', 'lastName']
        },
        {
            model:Spot,
            attributes:['id', 'userId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],

            include:[
                {model:Image,
                attributes:['preview']}
            ]
        },
        {
            model:Image,
        }
    ]
    })

    res.json(allReviews)
})

//delete a review !!
router.delete('/:id', requireAuth, async(req,res) =>{

    let deleteReview = await Review.findByPk(req.params.id)

    if(!deleteReview)
    {
        res.status(404).send('Review does not exist')
        return
    }

    if(deleteReview.userId === req.user.id)
    {
        await deleteReview.destroy()
        res.json({message:'Successfully Deleted'})
        return
    }


    console.log(deleteReview.userId, 'creator'),
    console.log(req.user.id, 'current user')

    res.send('You did not write this review')



})

//edit a review
router.put('/:id', requireAuth, async(req,res)=>{

    let findReview = await Review.findByPk(req.params.id)

    if(!findReview){
        res.status(404).send('review does not exist')
    }

    const {
        review,
        stars
    } = req.body

    if(findReview.userId === req.user.id) {
        await findReview.update({
            review,
            stars
        })

        res.json(findReview)
    }


    // console.log(findReview)

    res.send('you did not write this review')


})


module.exports = router;
