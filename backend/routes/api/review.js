

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, Spot, Image } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [

    check('review')
    //   .exists({ checkFalsy: true })
    //   .isAlphanumeric('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage( "Review text is required"),

    check('stars')
    //   .exists({ checkFalsy: true })
    //   .isNumeric()
    //   .notEmpty()
      .isInt({min:1, max:5})
      .withMessage( "Stars must be an integer from 1 to 5"),

    handleValidationErrors
  ];



//get reviews of current user
router.get('/current', requireAuth, async(req,res) =>{

        //finds ALL the CURRENT user REVIEWS includes the USER date and the IMAGE data
        const allReviews = await Review.findAll({
            where:{
                userId:req.user.id
                },

                attributes:[
                    'id', 'userId', 'spotId',
                    'review', 'stars', 'createdAt', 'updatedAt'
                    ],

                    include:[{
                        model:User,
                        attributes:['id', 'firstName', 'lastName']
                    },
                            // {
                            //     model:Spot,
                            //     attributes:['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],

                            //     include:[
                            //         {model:Image,
                            //         attributes:['url']}
                            //     ]
                            // },
                    {
                        model:Image, as: 'ReviewImages',
                        attributes:['id', 'url']
                    }
                    ]
                    })

        //find ALL the SPOTS
        const allSpots = await Spot.findAll({
            attributes: { exclude: ['description', 'createdAt', 'updatedAt'] }
        })

        //find ALL the IMAGES that belong to a SPOT
        const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
        })


        console.log(allSpots.length)
        console.log(allImages.length)

        const plainFirst = allSpots.map(x => x.get({ plain: true }))

        const plainFirstR = allReviews.map(x => x.get({ plain: true }))

        //adds an the image url to the spots
        for(let i=0; i<allSpots.length; i++){
            for(let z=0; z<allImages.length; z++){
                if(plainFirst[i].id === allImages[z].imagableId){
                    plainFirst[i].previewImage = allImages[z].url
                }
            }
            if(!plainFirst[i].previewImage){
                plainFirst[i].previewImage= null
            }
        }

        console.log(plainFirst.length, 'sssss')
        console.log(plainFirstR.length, 'rrrr')

        // res.json(plainFirstR)

        for(let i=0; i<plainFirst.length; i++){
            for(let z=0; z<plainFirstR.length; z++){
                console.log(plainFirst[i].id, 'spot', plainFirstR[z].spotId, 'reveiw')
                if(plainFirst[i].id===plainFirstR[z].spotId){
                    plainFirstR[z].Spot = plainFirst[i]
                }
            }

        }


        for(let h=0; h<plainFirstR.length; h++){
            if(!plainFirstR[h].Spot){
                // console.log(!plainFirstR[h].Spot)
                plainFirstR[h].Spot=[]
            }
        }

        let object = {Reviews:plainFirstR}
        res.json(object)
        })

//delete a review !!
router.delete('/:id', requireAuth, async(req,res) =>{

        let deleteReview = await Review.findByPk(req.params.id)

            if(!deleteReview)
            {
                res.status(404).json({message:"Review couldn't be found", statusCode:404})
                return
            }

            if(deleteReview.userId === req.user.id)
                {
                    await deleteReview.destroy()
                    res.json({message:'Successfully Deleted', statusCode:200})
                    return
                }


                console.log(deleteReview.userId, 'creator'),
                console.log(req.user.id, 'current user')

                // res.send('You did not write this review')
                res.status(403).json({message:'Forbidden', statusCode:403})

})

//edit a review
router.put('/:id', requireAuth, validateReview, async(req,res)=>{

    let findReview = await Review.findByPk(req.params.id)

    if(!findReview){
        res.status(404).json({message:"Review couldn't be found", statusCode:404})
        return
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

        const orderR = await Review.findAll({
            where:{id:req.params.id},
            attributes:[
                'id', 'userId', 'spotId',
                'review', 'stars', 'createdAt', 'updatedAt'
            ]
        })

        return res.json(orderR[0])

    }


    // console.log(findReview)

    // res.send('you did not write this review')
    res.status(403).json({message:'Forbidden', statusCode:403})
})

//create an image for a review
router.post('/:id/images', requireAuth, async(req,res)=>{

    const { id, url, preview } = req.body

    let find = await Review.findByPk(req.params.id)

    if(!find){
        res.status(404).json({message:"Review couldn't be found", statusCode:404})
        return
    }

    if(find.userId !== req.user.id){
    //   res.send('you did not write this review')
    res.status(403).json({message:'Forbidden', statusCode:403})
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

    let ImageCount = await Review.findAll({
        where:{id:req.params.id},
        include:[{
            model:Image, as: 'ReviewImages',
        }]
    })

    // res.json(ImageCount)
    console.log(ImageCount[0].ReviewImages.length)

    if(ImageCount[0].ReviewImages.length > 10){
        res.status(403).json({message:"Maximum number of images for this resource was reached",statusCode:403})
    }

    res.json(findCreatedImageReview[0])
})


module.exports = router;
