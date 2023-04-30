

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, Spot, Image } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [

    check('review')
      .exists({ checkFalsy: true })
      .isAlphanumeric('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage('Please provide a valid review.'),

    check('stars')
      .exists({ checkFalsy: true })
      .isNumeric()
      .notEmpty()
      .withMessage('Please provide a valid rating.'),

    handleValidationErrors
  ];



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
        res.status(404).json({message:"Review couldn't be found", status:404})
        return
    }

    if(deleteReview.userId === req.user.id)
    {
        await deleteReview.destroy()
        res.json({message:'Successfully Deleted', status:200})
        return
    }


    console.log(deleteReview.userId, 'creator'),
    console.log(req.user.id, 'current user')

    // res.send('You did not write this review')
    res.status(403).json({message:'Forbidden'})

})

//edit a review
router.put('/:id', requireAuth, validateReview, async(req,res)=>{

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

    // res.send('you did not write this review')
    res.status(403).json({message:'Forbidden'})
})

//create an image for a review
router.post('/:id/images', requireAuth, async(req,res)=>{

    const { id, url, preview } = req.body

    let find = await Review.findByPk(req.params.id)

    if(!find){
        res.status(404).json({message:"Review couldn't be found", status:404})
        return
    }

    if(find.userId !== req.user.id){
    //   res.send('you did not write this review')
    res.status(403).json({message:'Forbidden'})
      return
    }

    let createImageReview = await Image.create({
        id,
        url,
        preview,
        imagableId:req.params.id,
        imagableType:'Review'
    })

    let findCreatedImageReview = await Image.findAll({
        where:{id:createImageReview.id},
        attributes:{exclude:['preview','imagableId', 'imagableType', 'updatedAt', 'createdAt']}
      })



    res.json(findCreatedImageReview)
})


module.exports = router;
