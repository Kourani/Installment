

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, Image, Sequelize, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

// const { validationResult } = require('express-validator');

const { Op } = require("sequelize");

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
      // .exists({ checkFalsy: true })
      // .isAlpha('en-US',{ignore: ' '})
      .isLength({min:undefined, max:50})
      .withMessage("Name must be less than 50 characters")
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

      // check('street').custom((value, { req }) => {
      //   if(!req.body.address && !req.body.city && !req.body.state && !req.body.country && !req.body.lat && !req.body.lng && !req.body.name && !req.body.description && !req.body.price) {
      //       throw new Error ("Street address is required, City is required, State is required, Country is required, Latitude is not valid, Longitude is not valid, Name must be less than 50 characters, Description is required, Price per day is required");
      //   }
      // }),


    handleValidationErrors
  ];


const validateReview = [
  check('review')
    // .exists({ checkFalsy: true })
    // .isAlphanumeric('en-US',{ignore: ' '})
    .notEmpty()
    .withMessage("Review text is required"),

  check('stars')
    // .exists({ checkFalsy: true })
    // .isNumeric()
    // .notEmpty()
    .isInt({min:1, max:5})
    .withMessage( "Stars must be an integer from 1 to 5"),

  handleValidationErrors
];

const validateBooking= [

  check('startDate')
    // .exists({ checkFalsy: true })
    // .isNumeric()
    // .notEmpty()
    .isDate()
    .withMessage( "St"),

    check('endDate')
    // .exists({ checkFalsy: true })
    // .isNumeric()
    // .notEmpty()
    .isDate()
    // .isAfter('startDate',{comparsionDate:'startDate'})
    // .equals('startDate')
    .withMessage( "Stars must be an integer from 1 to 5"),

    check('endDate').custom((value, { req }) => {
      if(new Date(value) <= new Date(req.body.startDate)) {
          throw new Error ( "endDate cannot be on or before startDate");
      }
      return true
  }),


  handleValidationErrors
];


const validateQuery= [

  check('page')
    .exists({ checkFalsy: true })
    .isNumeric()
    .notEmpty()
    .isInt(({min:0, max:10}))
    .withMessage('Please provide a valid page.'),

  check('size')
    .exists({ checkFalsy: true })
    .isNumeric()
    .notEmpty()
    .isInt(({min:0, max:20}))
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

      let {
        page,
        size,
        minLat,
        maxLat,
        minLng,
        maxLng,
        minPrice,
        maxPrice} = req.query

    page = parseInt(page);
    size = parseInt(size);

    if (isNaN(page)) page =0
    if(page<0) page=0

    if(isNaN(size)) size =20
    if(size<0) size=20

  let array = []

  if(minPrice, maxPrice, minLat, maxLat, minLng, maxLng){

            let testing = await Spot.findAll({
              where:{
                price:{
                    [Op.between]:[minPrice,maxPrice],
                    [Op.between]:[minLat,maxLat],
                    [Op.between]:[minLng,maxLng],
                  }
              },

              attributes:[
                'id', 'ownerId',
                'address', 'city',
                'state', 'country',
                'lat', 'lng', 'name',
                'description','price',
                'createdAt', 'updatedAt'],
            })

            array = [...testing]
          }
        else {

          if(maxLat && minLat){

            let spotLat = await Spot.findAll({
              where:{
                lat:{
                [Op.between]:[minLat,maxLat]}
              },
              attributes:[
                'id', 'ownerId',
                'address', 'city',
                'state', 'country',
                'lat', 'lng', 'name',
                'description','price',
                'createdAt', 'updatedAt'],
            })

            array = [...spotLat]
            // return res.json({array,page,size})

          }else if(!minLat){

            let spotMinLat = await Spot.findAll({
              where:{
                lat:{
                [Op.lte]:[maxLat]}
              },
              attributes:[
                'id', 'ownerId',
                'address', 'city',
                'state', 'country',
                'lat', 'lng', 'name',
                'description','price',
                'createdAt', 'updatedAt'],
            })

            array = [...spotMinLat]

          }else if(!maxLat){

            let spotMaxLat = await Spot.findAll({
              where:{
                lat:{
                [Op.gte]:[minLat]}
              },
              attributes:[
                'id', 'ownerId',
                'address', 'city',
                'state', 'country',
                'lat', 'lng', 'name',
                'description','price',
                'createdAt', 'updatedAt'],
            })

            array = [...spotMaxLat]

          }

          if(minLng && maxLng){

            spotLng = await Spot.findAll({
              where:{
                lng:{
                  [Op.between]:[minLng,maxLng]},
                },
                attributes:[
                  'id', 'ownerId',
                  'address', 'city',
                  'state', 'country',
                  'lat', 'lng', 'name',
                  'description','price',
                  'createdAt', 'updatedAt'],
            })

            array = [...spotLng]

          }else if(!minLng){

            let spotMinLng = await Spot.findAll({
              where:{
                lng:{
                  [Op.lte]:[maxLng]},
                },
                attributes:[
                  'id', 'ownerId',
                  'address', 'city',
                  'state', 'country',
                  'lat', 'lng', 'name',
                  'description','price',
                  'createdAt', 'updatedAt'],
            })

            array = [...spotMinLng]


          }else if(!maxLng){
            let spotMaxLng = await Spot.findAll({
              where:{
                lng:{
                  [Op.gte]:[minLng]},
                },
                attributes:[
                  'id', 'ownerId',
                  'address', 'city',
                  'state', 'country',
                  'lat', 'lng', 'name',
                  'description','price',
                  'createdAt', 'updatedAt'],
            })

            array = [... spotMaxLng]

          }

          if(minPrice && maxPrice){

            let spotPrice = await Spot.findAll({
              where:{
                price:{
                  [Op.between]:[minPrice,maxPrice]},
                },
                attributes:[
                  'id', 'ownerId',
                  'address', 'city',
                  'state', 'country',
                  'lat', 'lng', 'name',
                  'description','price',
                  'createdAt', 'updatedAt'],
              })

            array = [...spotPrice]

          }else if(!minPrice){

            let spotMinPrice = await Spot.findAll({
              where:{
                price:{
                  [Op.lte]:[maxPrice]},
                },
                attributes:[
                  'id', 'ownerId',
                  'address', 'city',
                  'state', 'country',
                  'lat', 'lng', 'name',
                  'description','price',
                  'createdAt', 'updatedAt'],
            })

            array = [... spotMinPrice]

          }else if(!maxPrice){

            let spotMaxPrice = await Spot.findAll({
              where:{
                price:{
                  [Op.gte]:[minPrice]},
                },
                attributes:[
                  'id', 'ownerId',
                  'address', 'city',
                  'state', 'country',
                  'lat', 'lng', 'name',
                  'description','price',
                  'createdAt', 'updatedAt'],
            })

            array = [spotMaxPrice]

          }

          // res.json(array,page,size)
        }


  // res.json(array) // this gives me all the spots that have the queries


  //finds all the spots with reviews attributes spotId and stars
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

    //creates a review array of objects
    let undy = []

    for(let i=0; i<spotReviews.length; i++){
      undy.push(spotReviews[i].Reviews)
    }


    // res.json(undy)

    //an array of lengths
    let twos = []

    for(let a=0; a<spotReviews.length; a++){

      twos.push(spotReviews[a].Reviews.length)

    }


    //an array of the average rating
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






    //finds all the spots with select attributes
    const allSpots = await Spot.findAll({
      attributes:[
                    'id', 'ownerId',
                    'address', 'city',
                    'state', 'country',
                    'lat', 'lng', 'name',
                    'description','price',
                    'createdAt', 'updatedAt'],

      // where:{
      //   price:{[Op.between]:[minPrice, maxPrice]},
      //   lat:{[Op.between]:[minLat, maxLat]},
      //   lng:{[Op.between]:[minLng, maxLng]}
      // },


        // include:[
        //   {
        //     model:Image,
        //     attributes:['url']
        //   }
        // ]
      })

      // res.json(allSpots)



      //finds all the images
      const findImages = await Image.findAll()

      // res.json(findImages)

    //you cannot add to the object until you get the PLAIN OBJECTS !!
    const plainFirst = array.map(x => x.get({ plain: true }))

    //adds the averageRating key value pair into the object
    for(let h=0; h<average.length; h++){
      plainFirst[h].avgRating = average[h]
    }


    for(let d=0; d<plainFirst.length; d++){
      for(let e=0; e<findImages.length; e++){
        console.log(d,e)
        if(plainFirst[d].id === findImages[e].imagableId)
        {
          plainFirst[d].previewImage = findImages[e].url
        }
      }
    }

    // plainFirst.push(`page:${page}`, `size:${size}`)
    let objCreate = {Spots:plainFirst, page:page, size:size}
    res.json(objCreate)

    // console.log(objCreate)


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
        where:{ownerId:req.user.id}
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

      attributes:[
        'id', 'ownerId', 'address',
        'city', 'state', 'country',
        'lat', 'lng', 'name', 'description',
        'price', 'createdAt', 'updatedAt'
      ],
        where:{ownerId:req.user.id}
    })

    let findImage = await Image.findAll({
      where:{imagableType:'Spot'}
    })





    // res.json(currentSpot)

  // console.log(req.user.id)
  for(let i=0; i<currentSpot.length; i++)
  {
    if(currentSpot[i].ownerId === req.user.id)
    {
      // res.json(currentSpot)

       //you cannot add to the object until you get the PLAIN OBJECTS !!
        const plainFirst = currentSpot.map(x => x.get({ plain: true }))


        // res.json(findImage)

        console.log(findImage[0].imagableId,'gggggggggggg')

        if(average.length>0){
          for(let h=0; h<average.length; h++){
            plainFirst[h].avgRating = average[h]
          }
        }

        for(let i=0; i<plainFirst.length; i++){
          for(let s=0; s<findImage.length; s++){
            if(plainFirst[i].id===findImage[s].imagableId){
              plainFirst[i].previewImage=findImage[s].url
            }
          }
        }
        // res.json(plainFirst)
        //adds the averageRating key value pair into the object
        console.log(average.length,'average array')
        // res.json(average.length)

        let plainFirst1 ={Spots:plainFirst}
        res.json(plainFirst1)
        return
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
        return
    }

    const allReviews = await Review.findAll({
      where:{
        spotId:req.params.id
      },
      attributes:{
        include:[
            [Sequelize.fn('COUNT', sequelize.col('review')), 'num'],
            [Sequelize.fn('AVG', sequelize.col('stars')), 'avg']
        ]
    }
    })

    console.log(allReviews[0].id,'iiiiiii')
    console.log(allReviews[0].review,'yyyyy')
    console.log(allReviews[0].stars,'sssssss')
    console.log(allReviews[0].num,'yyyyy')


    const second = allReviews.map(x => x.get({ plain: true }))

    // console.log(plainFirstt[0].num,'pppppppppppppppppppppppppppppp')
    // res.json(allReviews)

    const all = await Spot.findAll({
        where:{
            id:req.params.id
        },
        attributes:[
          'id', 'ownerId', 'address',
          'city', 'state', 'country',
          'lat', 'lng', 'name', 'description',
          'price', 'createdAt', 'updatedAt'
        ],
        // attributes:{
        //     include:[
        //         [Sequelize.fn('COUNT', sequelize.col('review')), 'numReviews'],
        //         [Sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        //     ]
        // },
        // include:[
            // {
            //     model:Review,
            //     attributes:[
            //         [Sequelize.fn('COUNT', sequelize.col('review')), 'number of reviews'],
            //         [Sequelize.fn('AVG', sequelize.col('stars')), 'average rating']
            //     ]
            // },

        //     {model:Image,
        //     attributes: ['id','url','preview']},

        //     {model:User,
        //     attributes:['id', 'firstName', 'lastName'] }
        // ],
    })

    const plainFirst = all.map(x => x.get({ plain: true }))

    // res.json(plainFirst)

    console.log(allReviews[0].spotId)
    console.log(req.params.id)
    console.log(plainFirst[0].id)
    // res.json(allReviews)

    if(second[0].spotId === parseInt(req.params.id)){
      console.log('here')
      console.log(allReviews[0].numReviews, '####RR')
      console.log(allReviews[0].avgStarRating, 'RRRRr')
      plainFirst[0].numReviews = second[0].num
      plainFirst[0].avgStarRating = second[0].avg
    }

    const lastly = await Spot.findAll({
      where:{
        id:req.params.id
      },
      include:[
        {model:Image,
          attributes: ['id','url','preview']},

          {model:User,
          attributes:['id', 'firstName', 'lastName'] }
      ],
      })


      // res.json(lastly)
      if(plainFirst[0].id === lastly[0].id){
        plainFirst[0].SpotImages = lastly[0].Images
        plainFirst[0].Owner = lastly[0].User
      }

    res.json(plainFirst)

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
        return
    }

    const {
        address,
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

  // res.json(findSpot)

  const alas = await Spot.findAll({
    where:{id:req.params.spotId},
    attributes:[
      'id', 'ownerId', 'address','city',
      'state', 'country', 'lat',
      'lng', 'description', 'price',
      'createdAt', 'updatedAt'
    ]
  })
  res.json(alas[0])
  }

  // res.json('you do not own this spot')
  res.status(403).json({message:'Forbidden', status:403})

})


//create a review for a spot based on spots id
router.post('/:spotId/reviews', requireAuth, validateReview, async(req,res)=>{

    let find = await Spot.findByPk(req.params.spotId)
    if(!find){
        res.status(404).send({message:"Spot couldn't be found", status:404})
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
      res.status(403).json({message:"User already has a review for this spot", status:403})
      return
    }

  }

    let createReview = await Review.create({
        userId: req.user.id,
        spotId:req.params.spotId,
        review,
        stars,
        })

    res.status(201).json(createReview)
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
    return
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
    }],

    attributes:{include:[
      "id",
    "spotId",
    "userId",
    "startDate",
    "endDate",
    "createdAt",
    "updatedAt"]}
  })

  let finalObj2={Bookings:bookingSpot}
  res.json(finalObj2)
})

//get all reviews by a spots id
router.get('/:spotId/reviews' , async (req,res) =>{

  const find = await Review.findByPk(req.params.spotId)

  if(!find){
      return res.status(404).json({message:"Spot couldn't be found", status:404})
  }

  const all = await Review.findAll({
      where:{spotId:req.params.spotId},
      include:[
        {
          model:User,
          attributes:['id', 'firstName', 'lastName']
        },
        // {
        //   model:Image
        // }
      ]
  })

  // res.json(all)

  let findImageR = await Image.findAll({
    where:{imagableType:'Review'},
    attributes:['id', 'url', 'imagableId']
  })

  const plainFirst = all.map(x => x.get({ plain: true }))


  for(let i=0; i<all.length; i++){
    for(let d=0; d<findImageR.length; d++){
      console.log(plainFirst[i].id, findImageR[d].imagableId)
      if(plainFirst[i].id === findImageR[d].imagableId){
        // res.json(findImageR)
        // delete findImageR[d].preview
        plainFirst[i].ReviewImages = findImageR
      }
    }
  }

  res.json(plainFirst)
  return
})


//create a booking based on spot id

router.post('/:id/bookings', requireAuth, validateBooking, async(req,res)=>{

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

    let Datee = startDate.split('-')
    console.log(Datee)

    let end = endDate.split('-')
    console.log(end, 'end')

    for(let i=0; i<findBooking.length; i++){

      // if(findBooking[i].endDate === findBooking[i].startDate){
      //   res.status(400).json({message:"Validation error", status:400, errors:"endDate cannot be on or before startDate"})
      // }

      let insidee = findBooking[i].startDate.split('-')
      console.log(insidee, 'startttt')

      let inside = findBooking[i].endDate.split('-')
      console.log(inside, 'startttt')

      let insideDateI = parseInt(insidee[i])
      let insideEndI=parseInt(inside)

      let DateI = parseInt(Datee[i])
      let endI = parseInt(end[i])

        if(insideDateI<DateI && DateI<insideEndI){
          console.log(insideDateI, 'insideDateI')
          console.log(DateI, 'DateI'),
          console.log(insideEndI, 'insideEndI')

          res.status(403).json({message: "Sorry, this spot is already booked for the specified dates", errors: ["Start date conflicts with an existing booking"], status:403})
          return
        }

        if(insideDateI<endI && endI<insideEndI){
          console.log(insideDateI, 'insideDateIeeeeeeee')
          console.log(DateI, 'DateIeeeeeeeeee'),
          console.log(endI, 'endIeeeeeeeeee'),
          console.log(insideEndI, 'insideEndIeeeeeeeee')

          res.status(403).json({message: "Sorry, this spot is already booked for the specified dates", errors: ["End date conflicts with an existing booking"],status:403})
          return
        }

      if(findBooking[i].startDate === startDate && findBooking[i].endDate === endDate){
        // res.status(403).send('Booking already exists for the spot on the selected dates')
        res.status(403).json({message:"Sorry, this spot is already booked for the specified dates", errors: [
          "Start date conflicts with an existing booking",
          "End date conflicts with an existing booking"
        ], status:403})
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
