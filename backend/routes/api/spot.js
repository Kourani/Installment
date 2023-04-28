

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, Image, Sequelize, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');


const validateSpot = [
    // check('userId')
    //     .exists({ checkFalsy: true })
    //     .isNumeric()
    //     .notEmpty()
    //     .withMessage('Please provide a valid userId.'),
    check('address')
      .exists({ checkFalsy: true })
    //   .isAlpha()
      .notEmpty()
      .withMessage('Please provide a valid address.'),
    check('city')
      .exists({ checkFalsy: true })
    //   .isAlpha()
      .notEmpty()
      .withMessage('Please provide a valid city.'),
    check('state')
      .exists({ checkFalsy: true })
    //   .isAlpha()
      .notEmpty()
      .withMessage('Please provide a valid state.'),
    check('country')
      .exists({ checkFalsy: true })
    //   .isAlpha()
      .notEmpty()
      .withMessage('Please provide a valid country.'),
    check('lat')
      .exists({ checkFalsy: true })
      .isNumeric()
      .notEmpty()
      .withMessage('Please provide a valid latitude.'),
    check('lng')
      .exists({ checkFalsy: true })
      .isNumeric()
      .notEmpty()
      .withMessage('Please provide a valid longitude.'),
    check('name')
      .exists({ checkFalsy: true })
    //   .isAlpha()
      .notEmpty()
      .withMessage('Please provide a valid name.'),
    check('description')
      .exists({ checkFalsy: true })
    //   .isAlpha()
      .notEmpty()
      .withMessage('Please provide a valid description.'),
    check('price')
      .exists({ checkFalsy: true })
      .isDecimal()
      .notEmpty()
      .withMessage('Please provide a valid price.'),
    handleValidationErrors
  ];



  //get all spots
router.get('/' , async (req,res) =>{

  const allSpots = await Spot.findAll(
  {
    // group:['id'],
      include:
      [

          // {
          //   model:Image,
          //   attributes: ['preview']
          // },

          {
              model:Review,
              group:['spotId'],
              attributes:[
                  [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating'],
              ],
          },


      ]
  })


  // for(let i=0; i<allSpots.length; i++)
  // {
  //   for(let keys in allSpots)
  //   {
  //     const averageReview = await Review.findAll({
  //       group:['spotId'],
  //       attributes:[
  //         [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating'],
  //       ]
  //     })

  //     console.log(averageReview)

  //     // let allSpots[keys] = averageReview
  //   }
  // }
  // let average = allSpots.getReview()


  // return res.json(allSpots)

  // const averageReview = await Review.findAll({
  //         group:['spotId'],
  //         attributes:[
  //           [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating'],
  //         ]
  //       })



        res.json(allSpots)
})


//get spots of current user

router.get('/current', requireAuth, async(req,res)=>{

  let currentSpot = await Spot.findAll({
    include:
      [
          {
              model:Review,
              // attributes:[
              //     [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating']
              // ]
          },

          {
              model:Image,
              attributes: ['preview']
          },
      ],

      where:{userId:req.user.id}
  })


  console.log(req.user.id)
  for(let i=0; i<currentSpot.length; i++)
  {
    if(currentSpot[i].userId === req.user.id)
    {
      res.json(currentSpot)
    }
  }

  res.send('you are not the owner of this spot')

})




//get details for a spot from an id
router.get('/:id' , async (req,res) =>{


    const find = await Spot.findByPk(req.params.id)

    if(!find){
        res.status(404).send('Spot does not exist')
    }

    const all = await Spot.findAll({
        where:{
            id:req.params.id
        },
        // attributes:{
        //     include:[
        //         [Sequelize.fn('COUNT', sequelize.col('review')), 'numReviews'],
        //         [Sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        //     ]
        // },
        include:[
            {
                model:Review,
                attributes:[
                    [Sequelize.fn('COUNT', sequelize.col('review')), 'number of reviews'],
                    [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating']
                ]
            },

            {model:Image,
            attributes: ['id','url','preview']},

            {model:User,
            attributes:['id', 'firstName', 'lastName'] }
        ],
    })
    return res.json(all)
})



//create a spot
router.post('/', requireAuth, validateSpot, async(req,res) =>{


  // if(!req.user){
  //       const err = new Error('Authentication required');
  //       err.title = 'Authentication required';
  //       err.errors = { message: 'Authentication required' };
  //       err.status = 401;

  //     }


    const {address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price} = req.body

    let newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        userId:req.user.id
    })

    res.json(newSpot)


})

//delete a spot !!
router.delete('/:id', requireAuth, async(req,res) =>{


    let spotDelete = await Spot.findByPk(req.params.id)

    if(!spotDelete)
    {
        return res.status(404).send('Spot does not exist')
    }

        if(spotDelete.userId === req.user.id)
        {
          await spotDelete.destroy()
          res.json({message:'Successfully Deleted'})
          return
        }

        res.send('you are not the owner of this Spot')

})

//edit a spot
router.put('/:spotId',requireAuth, async(req,res) =>{

    let findSpot = await Spot.findByPk(req.params.spotId)

    if(!findSpot)
    {
        res.status(404).send('Spot does not exist')
    }

    const { address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price } = req.body

  if(findSpot.userId === req.user.id)
  {
    await findSpot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
  })

  res.json(findSpot)
  }

  res.json('you do not own this spot')

})


//create a review for a spot based on spots id
router.post('/:spotId/reviews', requireAuth, async(req,res)=>{

    let find = await Spot.findByPk(req.params.spotId)
    if(!find){
        res.status(404).send('Spot does not exist')
    }

    const {review, stars} = req.body


    let findReview = await Review.findAll({
      where:{spotId: req.params.spotId}
    })

  //does not allow the current user to create a second review for the same spot

  // console.log(findReview.review)
  // console.log(findReview.userId, 'userId')
  // console.log(req.user.id)

  // res.json(findReview)
  for(let i=0; i<findReview.length; i++)
  {
    if(findReview[i].userId === req.user.id && findReview[i].review){

      console.log('here')
      res.status(403).send('you have already created a review for this spot')
      return
    }

  }
  
    let createReview = await Review.create({
        userId: req.user.id,
        spotId:req.params.spotId,
        review,
        stars,
        })

    res.json(createReview)
})

//create an image for a spot
router.post('/:id/images', async(req,res)=>{

    let find = await Spot.findByPk(req.params.id)

    if(!find){
        res.status(404).send('Spot does not exist')
    }

    const { id, url, preview } = req.body

    let createImage = await Image.create({
        id,
        url,
        preview,
        imagableId:req.params.id
    })

    res.json(createImage)
})

//get all bookings for a spot by spot Id
router.get('/:spotId/bookings' , requireAuth, async (req,res) =>{

  const find = await Booking.findByPk(req.params.spotId)

  if(!find){
      res.status(404).send('Spot does not exist')
  }

  const BookingSpot = await Booking.findAll({
      where:{spotId:req.params.spotId}
  })

  res.json(BookingSpot)
})

//get all reviews by a spots id
router.get('/:spotId/reviews' , async (req,res) =>{

  const find = await Review.findByPk(req.params.spotId)

  if(!find){
      res.status(404).send('Spot does not exist')
  }

  const all = await Review.findAll({
      where:{spotId:req.params.spotId},
      include:[
        {
          model:User,
          attributes:['id', 'firstName', 'lastName']
        },
        {
          model:Image
        }
      ]
  })

  res.json(all)
})


//create a booking based on spot id

router.post('/:id/bookings', requireAuth, async(req,res)=>{

  let find = await Spot.findByPk(req.params.id)

  if(!find){
    res.status(404).send('Spot does not exist')
  }

  const {startDate, endDate} = req.body

  console.log(req.user.id, 'current user')
  console.log(find.userId, 'owner')

  if(find.userId !== req.user.id)
  {
    let createBooking = await Booking.create({
      startDate,
      endDate,
      spotId:req.params.id,
      userId:req.user.id
    })
    res.json(createBooking)
  }

})




// //delete a spot !!
// router.delete('/:spotId', requireAuth, async(req,res) =>{


//   let spotDelete = await Spot.findByPk(req.params.spotId)

//   console.log(spotDelete)

//   if(!spotDelete)
//   {
//     return res.status(404).send('Spot does not exist')

//   }

//   // if(spotDelete !== 'null')

// // {
//     // await spotDelete.destroy()
//     res.json({message:'Successfully Deleted'})
// // }


//   // console.log(req.user.id)

// })












module.exports = router;
