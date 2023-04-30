

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, Image, Sequelize, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

// const { validationResult } = require('express-validator');

const validateSpot = [
    // check('userId')
    //     .exists({ checkFalsy: true })
    //     .isNumeric()
    //     .notEmpty()
    //     .withMessage('Please provide a valid userId.'),

    check('city')
      .exists({ checkFalsy: true })
      .isAlpha('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage( "City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .isAlpha('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage("State is required"),
    check('country')
      .exists({ checkFalsy: true })
      .isAlpha('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage("Country is required"),
    check('name')
      .exists({ checkFalsy: true })
      .isAlpha('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage("Name must be less than 50 characters"),
    check('description')
      .exists({ checkFalsy: true })
      .isAlpha('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage("Description is required"),

      check('address')
      .exists({ checkFalsy: true })
      .isAlphanumeric('en-US',{ignore: ' '})
      .notEmpty()
      .withMessage( "Street address is required"),
      check('lat')
      .exists({ checkFalsy: true })
      .isNumeric()
      .notEmpty()
      .withMessage("Latitude is not valid"),
    check('lng')
      .exists({ checkFalsy: true })
      .isNumeric()
      .notEmpty()
      .withMessage("Longitude is not valid"),
    check('price')
      .exists({ checkFalsy: true })
      .isNumeric()
      .notEmpty()
      .withMessage( "Price per day is required"),

    handleValidationErrors
  ];


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


const validateQuery= [

  check('page')
    .exists({ checkFalsy: true })
    .isNumeric()
    .notEmpty()
    .withMessage('Please provide a valid page.'),

  check('size')
    .exists({ checkFalsy: true })
    .isNumeric()
    .notEmpty()
    .withMessage('Please provide a valid size.'),

    check('minLat')
    .optional()
    // .exists({ checkFalsy: true })
    .isNumeric()
    // .notEmpty()
    .withMessage('Please provide a valid Latitude.'),

    check('maxLat')
    .optional()
    // .exists({ checkFalsy: true })
    .isNumeric()
    // .notEmpty()
    .withMessage('Please provide a valid Latitude.'),

    check('minLng')
    .optional()
    // .exists({ checkFalsy: true })
    .isNumeric()
    // .notEmpty()
    .withMessage('Please provide a valid Longitude.'),

    check('maxLng')
    .optional()
    // .exists({ checkFalsy: true })
    .isNumeric()
    // .notEmpty()
    .withMessage('Please provide a valid Longitude.'),

    check('minPrice')
    .optional()
    // .exists({ checkFalsy: true })
    .isNumeric()
    // .notEmpty()
    .withMessage('Please provide a valid Price.'),

    check('maxPrice')
    .optional()
    // .exists({ checkFalsy: true })
    .isNumeric()
    // .notEmpty()
    .withMessage('Please provide a valid Price.'),


  handleValidationErrors
];




  //get all spots
router.get('/', validateQuery, async (req,res) =>{

  // await check('page').isNumeric().run(req);
  // await check('size').isNumeric({ min: 6 }).run(req);
  // await check('minLat').isNumeric().run(req);
  // await check('maxLat').isNumeric({ min: 6 }).run(req);
  // await check('minLng').isNumeric().run(req);
  // await check('maxLng').isNumeric({ min: 6 }).run(req);
  // await check('minPrice').isNumeric().run(req);
  // await check('maxPrice').isNumeric({ min: 6 }).run(req);

  // const result = validationResult(req);

  // if (!result.isNumeric()) {
  //   return res.status(400).json({ message: 'provide a valid number'});
  // }

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


    let {
      page,
      size,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice} = req.query

      console.log(page)
      console.log(size)
      console.log(minPrice)
      console.log(maxPrice)
      console.log(minLng)
      console.log(maxLng)
      console.log(minLat)
      console.log(maxLat)





      page = parseInt(page)
      size = parseInt(size)

      if(isNaN(page)) page=2
      if(page<=0) page =2

      if(isNaN(size)) size=25
      if(size<=0) size =25

       // variable = condition ? True : False
      // size = size ? 10 ? 10 : size





      // console.log(req.query)

      for(let keys in req.query)
      {

        if(keys)
        {
          let minLng1 = parseInt(minLng)
          let maxLng2 = parseInt(maxLng)

          let minLat1 = parseInt(minLat)
          let maxLat2 = parseInt(maxLat)

          let minPrice1 = parseInt(minPrice)
          let maxPrice2 = parseInt(maxPrice)

          for(let i=0; i<plainFirst.length; i++){

            // console.log(plainFirst[i].lat, 'lat')
            // console.log(plainFirst[i].lng, 'lng')
            // console.log(plainFirst[i].price, 'price')
            // console.log(minLat, 'minLAT')
            // console.log(minLng, 'minLNG')
            // console.log(minPrice, 'minPRICE')
            // console.log(maxLat, 'maxLAT')
            // console.log(maxLng, 'maxLNG')
            // console.log(maxPrice, 'maxPRICE')

            let newLat = parseInt(plainFirst[i].lat)
            let newLng = parseInt(plainFirst[i].lng)
            let newPrice = parseInt(plainFirst[i].price)

            // console.log(newLat)
            // console.log(newLng)
            // console.log(newPrice)

            //first condition LAT ONLY
            if (newLat >= minLat && newLat <=maxLat
                || newLat>=minLat
                || newLat<=maxLat
              ){
                res.json({
                  plainFirst,
                  page,
                  size
                })
                return
              }

            //second condition LNG ONLY
            if (newLng >= minLng && newLng<=maxLng
                || newLng >= minLng
                || newLng <=maxLng
              ){
                res.json({
                  plainFirst,
                  page,
                  size
                })
                return
            }

            //third condition PRICE ONLY
            if (newPrice >= minPrice && newPrice<=maxPrice
              ||newPrice >= minPrice
              ||newPrice <= maxPrice
              ) {
                res.json({
                  plainFirst,
                  page,
                  size
                })
                return
            }

            if ( (newPrice >= minPrice && newPrice<=maxPrice ||newPrice >= minPrice
              ||newPrice <= maxPrice) &&
                 (newLng >= minLng && newLng<=maxLng || newLng >= minLng
                  || newLng <=maxLng) &&
                 (newLat >= minLat && newLat <=maxLat  || newLat>=minLat
                  || newLat<=maxLat)
              ) {
                res.json({
                  plainFirst,
                  page,
                  size
                })
                return
            }

          }

        }
      }



    res.json('there is no exisiting spot with your search criteria');

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

    // console.log(spotReviews.length, '# of spots') //# of spots
    // console.log(spotReviews[0].Reviews.length, '# of reviews per spot')


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

    // res.send('you are not the owner of the spot')


  }

   // res.status(403).json({message:'Forbidden'})
  res.send('you do not own any spots')


})




//get details for a spot from an id
router.get('/:id' , async (req,res) =>{


    const find = await Spot.findByPk(req.params.id)

    if(!find){
        res.status(404).json({message:"Spot couldn't be found", status:404})
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
router.post('/', requireAuth,  validateSpot, async(req,res) =>{


    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price} = req.body

    let newSpot = await Spot.create({
        ownerId:req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,

    })

    res.status(201).json(newSpot)


})

//delete a spot !!
router.delete('/:id', requireAuth, async(req,res) =>{


    let spotDelete = await Spot.findByPk(req.params.id)

    if(!spotDelete)
    {
        return res.status(404).json({message:"Spot couldn't be found", status:404})
    }

        if(spotDelete.ownerId === req.user.id)
        {
          await spotDelete.destroy()
          res.json({
            message:'Successfully Deleted',
            status:200
          })
          return
        }

        // res.send('you are not the owner of this Spot')
        res.status(403).json({message:'Forbidden', status:403})

})

//edit a spot
router.put('/:spotId',requireAuth, validateSpot, async(req,res) =>{

    let findSpot = await Spot.findByPk(req.params.spotId)

    if(!findSpot)
    {
        res.status(404).json({message:"Spot couldn't be found", status:404})
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

  if(findSpot.ownerId === req.user.id)
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

  // res.json('you do not own this spot')
  res.status(403).json({message:'Forbidden', status:403})

})


//create a review for a spot based on spots id
router.post('/:spotId/reviews', requireAuth, validateReview, async(req,res)=>{

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
      // res.status(403).send('you have already created a review for this spot')
      res.status(403).json({message:'Forbidden'})
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
router.post('/:id/images', requireAuth, async(req,res)=>{

    const { id, url, preview } = req.body

    let find = await Spot.findByPk(req.params.id)

    if(!find){
        res.status(404).json({message:"Spot couldn't be found", status:404})
        return
    }

    if(find.ownerId !== req.user.id){
      // res.send('you are not the owner of the spot')
      res.status(403).json({message:'Forbidden', status:403})
      return
    }

    let createImage = await Image.create({
        id,
        url,
        preview,
        imagableId:req.params.id,
        imagableType:'Spot'
    }, {
      attributes:{
        exclude:['imagableId', 'imagableType', 'updatedAt', 'createdAt']
      }
    })

    console.log(createImage.id, 'idcreate')

    let findCreatedImage = await Image.findAll({
      where:{id:createImage.id},
      attributes:{exclude:['imagableId', 'imagableType', 'updatedAt', 'createdAt']}
    })

    // console.log(createImage)


    res.json(findCreatedImage[0])
})

//get all bookings for a spot by spot Id
router.get('/:id/bookings' ,requireAuth, async (req,res) =>{


  const findSpot = await Spot.findByPk(req.params.id)

  if(!findSpot){
    res.status(404).json({message:"Spot couldn't be found", status:404})
    }

    console.log(findSpot.ownerId, 'owner')
    console.log(req.user.id, 'current')



    if(findSpot.ownerId !== req.user.id)
    {
      const bookingInfo = await Booking.findAll({
        where:{spotId:req.params.id},
        attributes:['spotId', 'startDate', 'endDate']
      })

      let finalObj={Bookings:bookingInfo}
      res.json(finalObj)
    }

  const bookingSpot = await Booking.findAll({
    where:{spotId:req.params.id},
    include:[{
      model:User,
      attributes:['id', 'firstName', 'lastName']
    }]
  })

  let finalObj2={Bookings:bookingSpot}
  res.json(finalObj2)
})

//get all reviews by a spots id
router.get('/:spotId/reviews' , async (req,res) =>{

  const find = await Review.findByPk(req.params.spotId)

  if(!find){
      res.status(404).json({message:"Spot couldn't be found", status:404})
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
    res.status(404).json({message:"Spot couldn't be found", status:404})
    return
  }


  let findBooking = await Booking.findAll({
    where:{spotId:req.params.id}
  })

    for(let i=0; i<findBooking.length; i++){

      if(findBooking[i].startDate === startDate && findBooking[i].endDate === endDate){
        // res.status(403).send('Booking already exists for the spot on the selected dates')
        res.status(403).json({message:'Forbidden', status:403})
        return
      }
    }

  if(find.userId !== req.user.id)
  {
    createBooking = await Booking.create({
      spotId:req.params.id,
      userId:req.user.id,
      startDate,
      endDate,
    })
    res.json(createBooking)
  }

  // res.send('Owner of the spot cannot create a booking')
  res.status(403).json({message:'Forbidden', status:403})
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
