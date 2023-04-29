

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

  const spotReviews = await Spot.findAll(
    {
      // group:['id'],
        include:
        [
            {
                model:Review,
                attributes:['spotId','stars']
            },
        ]
    })

    // res.json(spotReviews)

    console.log(spotReviews.length, 'spots') //# of spots
    console.log(spotReviews[0].Reviews.length, 'reviews')

    let undy = []

    for(let i=0; i<spotReviews.length; i++){
      undy.push(spotReviews[i].Reviews)
    }


    // res.json(undy)

    let twos = []

    for(let a=0; a<spotReviews.length; a++){

      twos.push(spotReviews[a].Reviews.length)

    }


    let average = []

    for(let z = 0; z<undy.length; z++){

      if(Array.isArray(undy[z]) && undy[z].length>0)
      {
        console.log('99999999')
        if(undy[z].length === twos[z]){
          // console.log(undy[z].length)
          // console.log(twos[z].length)
          console.log('1111111111')
          let sum = 0
          for(let y=0; y<undy[z].length; y++){
            console.log('aaaaaaa')

            sum = sum + undy[z][y].stars
            console.log(sum)
            // average.push(sum/twos[z])

          }
          average.push(sum/twos[z])
        }
      }
    }

    console.log(average.length)
    console.log(average)


    //finds all the spots includes the images preview
    const allSpots = await Spot.findAll({
        include:[
          {
            model:Image,
            attributes:['preview']
          }
        ]
      })

    //you cannot add to the object until you get the PLAIN OBJECTS !!
    const plainFirst = allSpots.map(x => x.get({ plain: true }))

    //adds the averageRating key value pair into the object
    for(let h=0; h<average.length; h++){
      plainFirst[h].averageRating = average[h]
    }

    res.json(plainFirst);

})


//get spots of current user

router.get('/current', requireAuth, async(req,res)=>{

  //AVERAGE
  const spotReviews = await Spot.findAll(
    {
      // group:['id'],
        include:
        [
            {
                model:Review,
                attributes:['spotId','stars']
            },
        ],
        where:{userId:req.user.id}
    })



    // res.json(spotReviews)




    //creates an empty array
    let undy = []
    let twos = []

    //pushes each review arraies of reviews into undy array
    //creates an array where # of elements = # of spots, and the value of each element is the # of reviews for that spot

    console.log(spotReviews.length, '# of spots') //# of spots
    console.log(spotReviews[0].Reviews.length, '# of reviews per spot')


    for(let i=0; i<spotReviews.length; i++){
      // console.log(spotReviews, 'ssssssssssssssss')
      console.log(spotReviews[i].Reviews.length, 'reviews in order')
      if(spotReviews[i].Reviews.length>0)
      {
        undy.push(spotReviews[i].Reviews)
        twos.push(spotReviews[i].Reviews.length)
      }
    }

    // res.json(undy)

    console.log(twos, 'twos')
    // res.json(twos)


    let average = []

    if(undy.length>0){
      for(let z = 0; z<undy.length; z++){
        if(Array.isArray(undy[z]) && undy[z].length>0)
        {
          console.log('99999999')
          if(undy[z].length === twos[z]){
            // console.log(undy[z].length)
            // console.log(twos[z].length)
            console.log('1111111111')
            let sum = 0
            for(let y=0; y<undy[z].length; y++){
              console.log('aaaaaaa')

              sum = sum + undy[z][y].stars
              console.log(sum)
              // average.push(sum/twos[z])

            }
            average.push(sum/twos[z])
          }
        }
      }
    }


    console.log(average)
    // res.json(average)

    let currentSpot = await Spot.findAll({
      include:
        [
            // {
            //     model:Review,
            //     // attributes:[
            //     //     [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating']
            //     // ]
            // },
            {
                model:Image,
                attributes: ['preview']
            },
        ],

        where:{userId:req.user.id}
    })

    // res.json(currentSpot)

  // console.log(req.user.id)
  for(let i=0; i<currentSpot.length; i++)
  {
    if(currentSpot[i].userId === req.user.id)
    {
      // res.json(currentSpot)

       //you cannot add to the object until you get the PLAIN OBJECTS !!
        const plainFirst = currentSpot.map(x => x.get({ plain: true }))

        // res.json(plainFirst)
        //adds the averageRating key value pair into the object
        console.log(average.length)
        // res.json(average.length)
        if(average.length>0){
          for(let h=0; h<average.length; h++){
            plainFirst[h].averageRating = average[h]
          }
        }
        res.json(plainFirst);
    }


  }

  // res.send('you are not the owner of this spot')

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
router.get('/:id/bookings' ,requireAuth, async (req,res) =>{


  const findSpot = await Spot.findByPk(req.params.id)

  if(!findSpot){
    res.status(404).send('Spot does not exist')
    }

    console.log(findSpot.userId, 'owner')
    console.log(req.user.id, 'current')


    if(findSpot.userId !== req.user.id)
    {
      const bookingInfo = await Booking.findAll({
        where:{spotId:req.params.id},
        attributes:['spotId', 'startDate', 'endDate']
      })

      res.json(bookingInfo)
    }

  const bookingSpot = await Booking.findAll({
    where:{spotId:req.params.id},
    include:[{
      model:User,
      attributes:['id', 'firstName', 'lastName']
    }]
  })

  res.json(bookingSpot)
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

  //gets the data ::
  const {startDate, endDate} = req.body

//returns an array of object of spots
  let find = await Spot.findByPk(req.params.id)

  //if the desired spot does not exist 404
  if(!find){
    res.status(404).send('Spot does not exist')
    return
  }


  let findBooking = await Booking.findAll({
    where:{spotId:req.params.id}
  })

    for(let i=0; i<findBooking.length; i++){

      if(findBooking[i].startDate === startDate && findBooking[i].endDate === endDate){
        res.status(403).send('Booking already exists for the spot on the selected dates')
        return
      }
    }

  if(find.userId !== req.user.id)
  {
    createBooking = await Booking.create({
      startDate,
      endDate,
      spotId:req.params.id,
      userId:req.user.id
    })
    res.json(createBooking)
  }

  res.send('Owner of the spot cannot create a booking')
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
