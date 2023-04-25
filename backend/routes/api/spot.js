

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, Image, Sequelize, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


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
router.get('' , async (req,res) =>{

    const allSpots = await Spot.findAll(
    {
        include:
        [
            {
                model:Review,
                attributes:[
                    [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating']
                ]
            },

            {
                model:Image,
                attributes: ['preview']
            },
        ]
    })

    return res.json(allSpots)
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
router.post('/', async(req,res) =>{

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
router.delete('/:spotId', async(req,res) =>{

    let spotDelete = await Spot.findByPk(req.params.spotId)

    if(!spotDelete)
    {
        res.status(404)
    }

    await spotDelete.destroy()


    res.json({message:'Successfully Deleted'})
})

//edit a spot
router.put('/:spotId',async(req,res) =>{

    let find = await Spot.findByPk(req.params.spotId)

    if(!find)
    {
        res.status(404).send('invalid spot')
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

    let editSpot = await Spot.update({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        },

        {
            where: {id: req.params.spotId}
        })


        // let last

        // for(let i=0; i<editSpot.length; i++){
        //     last = await Spot.findByPk(i)
        //     res.json(last)
        // }

        let last = await Spot.findByPk(editSpot[0])
        res.json(last)
})


//create a review for a spot based on spots id
router.post('/:spotId/reviews', async(req,res)=>{

    let find = await Spot.findByPk(req.params.spotId)
    if(!find){
        res.status(404).send('Spot does not exist')
    }

    const { review, stars} = req.body

    let reviewCreate = await Review.create({
        userId: req.user.id,
        spotId:req.params.spotId,
        review,
        stars,
        },

        {
        where:{id:req.params.spotId}
    })

    res.json(reviewCreate)
})


//get spots of current user
router.get('/current', async(req, res) =>{

    let currentSpot = await Spot.findAll({
        where: id = req.user.id
    })

    console.log(currentSpot)

    res.json(currentSpot)
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
router.get('/:spotId/bookings' , async (req,res) =>{

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
      attributes:['review']
  })

  res.json(all)
})


//create a booking based on spot id

router.post('/:id/bookings', async(req,res)=>{

  let find = await Spot.findByPk(req.params.id)

  if(!find){
    res.status(404).send('Spot does not exist')
  }

  const {startDate, endDate} = req.body

  let createBooking = await Booking.create({
    startDate,
    endDate,
    spotId:req.params.id,
    userId:req.user.id
  },
  {
    where:{spotId:req.params.id}
  })

  res.json(createBooking)
})












module.exports = router;
