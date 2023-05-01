

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
router.get('/current',requireAuth, async(req,res) =>{

    const allReviews = await Review.findAll({
        where:{
            userId:req.user.id
        },
        attributes:[
            'id', 'userId', 'spotId',
            'review', 'stars', 'createdAt',
            'updatedAt'
        ],
        include:[{
            model:User,
            attributes:['id', 'firstName', 'lastName']
        },
        {
            model:Spot,
            attributes:['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],

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

    // res.json(allReviews)

    // let findSpots = await Spot.findAll({
    //     where:{ownerId:req.user.id}
    // })
    // res.json(findSpots)

    // const plainFirst = allReviews.map(x => x.get({ plain: true }))
    // console.log(allReviews[0].id)

    // let findImageReviews = await Image.findAll({
    //     where:{imagableType:'Review'}
    // })

    // res.json(findImageReviews)

    // let findImages = await Image.findAll({
    //     where:{imagableType:'Spot'}
    // })

    // console.log(findImages.length)
    // console.log(findSpots.length)



// const plainFirst = findSpots.map(x => x.get({ plain: true }))

//     for(let i=0; i<findImages.length; i++){
//         for(let a=0; a<findSpots.length; a++){
//             console.log(findImages[i].imagableId, findSpots[a].id,)
//             // console.log(findSpots[a].id, 'hhhhhhhhhh')
//             if(findImages[i].imagableId === findSpots[a].id){
//                 console.log('here')
//                 plainFirst[a].previewImage = findImages[i].url
//             }
//         }
//     }


// const plainFirstR = allReviews.map(x => x.get({ plain: true }))

// for(let i=0; i<allReviews.length; i++){
//     for(let z=0; z<plainFirst.length; z++){
//         if(plainFirstR[i].spotId === plainFirst[z].id){
//             plainFirstR[i].Spot = plainFirst
//         }
//     }
// }



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
    res.status(403).json({message:'Forbidden', status:403})

})

//edit a review
router.put('/:id', requireAuth, validateReview, async(req,res)=>{

    let findReview = await Review.findByPk(req.params.id)

    if(!findReview){
        res.status(404).json({message:"Review couldn't be found", status:404})
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
    res.status(403).json({message:'Forbidden', status:403})
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
    res.status(403).json({message:'Forbidden', status:403})
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
            model:Image,
        }]
    })

    console.log(ImageCount[0].Images.length)

    if(ImageCount[0].Images.length > 10){
        res.status(403).json({message:"Maximum number of images for this resource was reached",status:403})
    }

    res.json(findCreatedImageReview[0])
})


module.exports = router;
