

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, Image, Sequelize, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// const { validationResult } = require('express-validator');

const { Op } = require("sequelize");

const validateSpot = [
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
      .isDecimal()
      .notEmpty()
      .withMessage( "Price per day is required"),

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

  // check('startDate')
  //   // .exists({ checkFalsy: true })
  //   // .isNumeric()
  //   // .notEmpty()
  //   .isDate()
  //   .withMessage( "startDate must be a date example yyyy-mm-dd"),

  //   check('endDate')
  //   // .exists({ checkFalsy: true })
  //   // .isNumeric()
  //   // .notEmpty()
  //   .isDate()
  //   // .isAfter('startDate',{comparsionDate:'startDate'})
  //   // .equals('startDate')
  //   .withMessage( "startDate must be a date example yyyy-mm-dd"),

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
    // .exists({ checkFalsy: true })
    .optional()
    .isNumeric()
    .notEmpty()
    .isInt(({min:0, max:10}))
    .withMessage('Please provide a valid page.'),

  check('size')
    // .exists({ checkFalsy: true })
    .optional()
    .isNumeric()
    .notEmpty()
    .isInt(({min:0, max:20}))
    .withMessage('Please provide a valid size.'),

    check('minLat')
    .optional()
    .isDecimal()
    .withMessage('Please provide a valid Latitude.'),

    check('maxLat')
    .optional()
    // .exists({ checkFalsy: false })
    .isDecimal()
    // .notEmpty()
    .withMessage('Please provide a valid Latitude.'),

    check('minLng')
    .optional()
    // .exists({ checkFalsy: true })
    .isDecimal()
    // .notEmpty()
    .withMessage('Please provide a valid Longitude.'),

    check('maxLng')
    .optional()
    // .exists({ checkFalsy: true })
    .isDecimal()
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


  router.get('/', validateQuery, async(req,res)=>{

    let {
          page,
          size,
          minLat,
          maxLat,
          minLng,
          maxLng,
          minPrice,
          maxPrice
    } = req.query

    //converts page and size input to a number data type
    page = parseInt(page);
    size = parseInt(size);

    //sets the page and size to default values
    if(isNaN(page)) page =0
    if(!page) page=0
    if(page<0) page=0


    if(isNaN(size)) size =20
    if(!size) size=20
    if(size<0) size=20

    console.log('page',page)
    console.log('size',size)
    console.log('offset', page*size)


              minLng = parseInt(minLng) || -Infinity
              maxLng = parseInt(maxLng)

              minPrice = parseInt(minPrice)
              maxPrice = parseInt(maxPrice)

              minLat = parseInt(minLat)
              maxLat = parseInt(maxLat)


    // 666666666666666666666666666666666666666666666

    //all the queries do NOT exist all
    if(!minLat && !minLng && !minPrice && !maxPrice && !maxLng && !maxLat){
          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          limit:size,
          offset:page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //all the queries exist
    if(minLat && minLng && minPrice && maxPrice && maxLng && maxLat){

        console.log(' YOU ARE HERE')
          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.between]:[minLat,maxLat]
            },
            lng:{
              [Op.between]:[minLng,maxLng]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          },

          limit:size,
          offset: page*size
        })


        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

          //2222222222222222222222222222222222222222222222222222

        //only minPrice and maxPrice
        if(!minLat && !minLng && minPrice && maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          },

          limit:size,
          offset:page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only minPrice and minLat
        if(minLat && !minLng && minPrice && !maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.gte]:[minPrice]
            },
            lat:{
              [Op.gte]:[minLat]
            }
          },

          limit:size,
          offset: page*size

        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only minPrice and maxLat
        if(!minLat && !minLng && minPrice && !maxPrice && !maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.gte]:[minPrice]
            },
            lat:{
              [Op.lte]:[maxLat]
            }
          },

          limit:size,
          offset: page*size

        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only minPrice and minLng
        if(!minLat && minLng && minPrice && !maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.gte]:[minPrice]
            },
            lng:{
              [Op.gte]:[minLng]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only minPrice and maxLng
        if(!minLat && !minLng && minPrice && !maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.gte]:[minPrice]
            },
            lng:{
              [Op.lte]:[maxLng]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

         //only maxPrice and minLat
         if(minLat && !minLng && !minPrice && maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.lte]:[maxPrice]
            },
            lat:{
              [Op.gte]:[minLat]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only maxPrice and maxLat
        if(!minLat && !minLng && !minPrice && maxPrice && !maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.lte]:[maxPrice]
            },
            lat:{
              [Op.lte]:[maxLat]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only maxPrice and minLng
        if(!minLat && minLng && !minPrice && maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.lte]:[maxPrice]
            },
            lng:{
              [Op.gte]:[minLng]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only maxPrice and maxLng
        if(!minLat && !minLng && !minPrice && maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            price:{
              [Op.lte]:[maxPrice]
            },
            lng:{
              [Op.lte]:[maxLng]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only minLat and maxLat
        if(minLat && !minLng && !minPrice && !maxPrice && !maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.between]:[minLat,maxLat]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

        //only minLat and minLng
        if(minLat && minLng && !minPrice && !maxPrice && !maxLng && !maxLat){

              //finds all the spots
            const allSpots = await Spot.findAll({
              attributes:[
                'id', 'ownerId',
                'address', 'city', 'state',
                'country', 'lat', 'lng',
                'name', 'description', 'price',
                'createdAt', 'updatedAt'
              ],
              where:{
                lat:{
                  [Op.gte]:[minLat]
                },
                lng:{
                  [Op.gte]:[minLng]
                }
              },
              limit:size,
              offset: page*size
            })

            // res.json(allSpots)

            //gets all the reviews
            const allReviews = await Review.findAll()
            // res.json(allReviews)

            console.log(allReviews.length, 'Reviews')
            console.log(allSpots.length, 'Spots')


            const allImages = await Image.findAll({
              where:{imagableType:'Spot'}
            })
            console.log(allImages.length)


            const insertableSpots = allSpots.map(x => x.get({ plain: true }))

            for(let i=0; i<allSpots.length; i++){
                let sum = 0
                let totalReviews = 0
              for(let z=0; z<allReviews.length; z++){
                if(allSpots[i].id === allReviews[z].spotId){
                  sum = sum + allReviews[z].stars
                  totalReviews++
                }
              }
              let average = sum/totalReviews
              insertableSpots[i].avgRating = average

              for(let d=0; d<allImages.length; d++){
                if(allSpots[i].id === allImages[d].imagableId){
                  insertableSpots[i].previewImage = allImages[d].url
                }
              }

              if(!insertableSpots[i].previewImage){
                insertableSpots[i].previewImage = null
              }
            }

            let object = {Spots:insertableSpots, page:page, size:size}
            res.json(object)
            return
        }

        //only minLat and maxLng
        if(minLat && !minLng && !minPrice && !maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.gte]:[minLat]
            },
            lng:{
              [Op.lte]:[maxLng]
            }
          },
          limit:size,
          offset: page*size
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
        }

          //only maxLat and minLng
          if(!minLat && minLng && !minPrice && !maxPrice && !maxLng && maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lat:{
                [Op.lte]:[maxLat]
              },
              lng:{
                [Op.gte]:[minLng]
              }
            },
            limit:size,
            offset: page*size
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
          }

           //only maxLat and maxLng
           if(!minLat && !minLng && !minPrice && !maxPrice && maxLng && maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lat:{
                [Op.lte]:[maxLat]
              },
              lng:{
                [Op.lte]:[maxLng]
              }
            },
            limit:size,
            offset: page*size
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
          }

          //only minLng and maxLng
          if(!minLat && minLng && !minPrice && !maxPrice && maxLng && !maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lng:{
                [Op.between]:[minLng, maxLng]
              }
            },
            limit:size,
            offset: page*size
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
          }


    //1111111111111111111111111111111111111111111

    //minPrice ONLY
    if(!minLat && !minLng && minPrice && !maxPrice && !maxLng && !maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              price:{
                [Op.gte]:[minPrice]
              }
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }

    //maxPrice ONLY
    if(!minLat && !minLng && !minPrice && maxPrice && !maxLng && !maxLat){

              //finds all the spots
            const allSpots = await Spot.findAll({
              attributes:[
                'id', 'ownerId',
                'address', 'city', 'state',
                'country', 'lat', 'lng',
                'name', 'description', 'price',
                'createdAt', 'updatedAt'
              ],
              where:{
                price:{
                  [Op.lte]:[maxPrice]
                }
              }
            })

            // res.json(allSpots)

            //gets all the reviews
            const allReviews = await Review.findAll()
            // res.json(allReviews)

            console.log(allReviews.length, 'Reviews')
            console.log(allSpots.length, 'Spots')


            const allImages = await Image.findAll({
              where:{imagableType:'Spot'}
            })
            console.log(allImages.length)


            const insertableSpots = allSpots.map(x => x.get({ plain: true }))

            for(let i=0; i<allSpots.length; i++){
                let sum = 0
                let totalReviews = 0
              for(let z=0; z<allReviews.length; z++){
                if(allSpots[i].id === allReviews[z].spotId){
                  sum = sum + allReviews[z].stars
                  totalReviews++
                }
              }
              let average = sum/totalReviews
              insertableSpots[i].avgRating = average

              for(let d=0; d<allImages.length; d++){
                if(allSpots[i].id === allImages[d].imagableId){
                  insertableSpots[i].previewImage = allImages[d].url
                }
              }

              if(!insertableSpots[i].previewImage){
                insertableSpots[i].previewImage = null
              }
            }

            let object = {Spots:insertableSpots, page:page, size:size}
            res.json(object)
            return
    }


    //minLat ONLY
    if(minLat && !minLng && !minPrice && !maxPrice && !maxLng && !maxLat){

                    //finds all the spots
                  const allSpots = await Spot.findAll({
                    attributes:[
                      'id', 'ownerId',
                      'address', 'city', 'state',
                      'country', 'lat', 'lng',
                      'name', 'description', 'price',
                      'createdAt', 'updatedAt'
                    ],
                    where:{
                      lat:{
                        [Op.gte]:[minLat]
                      }
                    }
                  })

                  // res.json(allSpots)

                  //gets all the reviews
                  const allReviews = await Review.findAll()
                  // res.json(allReviews)

                  console.log(allReviews.length, 'Reviews')
                  console.log(allSpots.length, 'Spots')


                  const allImages = await Image.findAll({
                    where:{imagableType:'Spot'}
                  })
                  console.log(allImages.length)


                  const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                  for(let i=0; i<allSpots.length; i++){
                      let sum = 0
                      let totalReviews = 0
                    for(let z=0; z<allReviews.length; z++){
                      if(allSpots[i].id === allReviews[z].spotId){
                        sum = sum + allReviews[z].stars
                        totalReviews++
                      }
                    }
                    let average = sum/totalReviews
                    insertableSpots[i].avgRating = average

                    for(let d=0; d<allImages.length; d++){
                      if(allSpots[i].id === allImages[d].imagableId){
                        insertableSpots[i].previewImage = allImages[d].url
                      }
                    }

                    if(!insertableSpots[i].previewImage){
                      insertableSpots[i].previewImage = null
                    }
                  }

                  let object = {Spots:insertableSpots, page:page, size:size}
                  res.json(object)
                  return
    }

    //maxLat ONLY
    if(!minLat && !minLng && !minPrice && !maxPrice && !maxLng && maxLat){

                                //finds all the spots
                              const allSpots = await Spot.findAll({
                                attributes:[
                                  'id', 'ownerId',
                                  'address', 'city', 'state',
                                  'country', 'lat', 'lng',
                                  'name', 'description', 'price',
                                  'createdAt', 'updatedAt'
                                ],
                                where:{
                                  lat:{
                                    [Op.lte]:[maxLat]
                                  }
                                }
                              })

                              // res.json(allSpots)

                              //gets all the reviews
                              const allReviews = await Review.findAll()
                              // res.json(allReviews)

                              console.log(allReviews.length, 'Reviews')
                              console.log(allSpots.length, 'Spots')


                              const allImages = await Image.findAll({
                                where:{imagableType:'Spot'}
                              })
                              console.log(allImages.length)


                              const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                              for(let i=0; i<allSpots.length; i++){
                                  let sum = 0
                                  let totalReviews = 0
                                for(let z=0; z<allReviews.length; z++){
                                  if(allSpots[i].id === allReviews[z].spotId){
                                    sum = sum + allReviews[z].stars
                                    totalReviews++
                                  }
                                }
                                let average = sum/totalReviews
                                insertableSpots[i].avgRating = average

                                for(let d=0; d<allImages.length; d++){
                                  if(allSpots[i].id === allImages[d].imagableId){
                                    insertableSpots[i].previewImage = allImages[d].url
                                  }
                                }

                                if(!insertableSpots[i].previewImage){
                                  insertableSpots[i].previewImage = null
                                }
                              }

                              let object = {Spots:insertableSpots, page:page, size:size}
                              res.json(object)
                              return
    }

    //minLng ONLY
    if(!minLat && minLng && !minPrice && !maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.gte]:[minLng]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //maxLng ONLY
    if(!minLat && !minLng && !minPrice && !maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.lte]:[maxLng]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }


    //minPrice maxPrice and minLat
    if(minLat && !minLng && minPrice && maxPrice && !maxLng && !maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lat:{
                [Op.gte]:[minLat]
              },
              price:{
                [Op.between]:[minPrice,maxPrice]
              }
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }

    //minPrice maxPrice and maxLat
    if(!minLat && !minLng && minPrice && maxPrice && !maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.gte]:[maxLat]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // minPrice maxPrice and minLng
    if(!minLat && minLng && minPrice && maxPrice && !maxLng && !maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lng:{
                [Op.gte]:[minLng]
              },
              price:{
                [Op.between]:[minPrice,maxPrice]
              }
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }


    //minPrice maxPrice and maxLng
    if(!minLat && !minLng && minPrice && maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.lte]:[maxLng]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice maxLat and minLng
    if(!minLat && minLng && minPrice && !maxPrice && !maxLng && maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lng:{
                [Op.gte]:[minLng]
              },
              price:{
                [Op.gte]:[minPrice]
              },
              lat:{
                [Op.lte]:[maxLat]
              }
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }

    //minPrice maxLat and maxLng
    if(!minLat && !minLng && minPrice && !maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.lte]:[maxLng]
            },
            lat:{
              [Op.lte]:[maxLat]
            },
            price:{
              [Op.gte]:[minPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice minLat and maxLat
    if(minLat && !minLng && minPrice && !maxPrice && !maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.between]:[minLat, maxLat]
            },
            price:{
              [Op.gte]:[minPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice minLat and minLng
    if(minLat && minLng && minPrice && !maxPrice && !maxLng && !maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lng:{
                [Op.gte]:[minLng]
              },
              price:{
                [Op.gte]:[minPrice]
              },
              lat:{
                [Op.gte]:[minLat]
              }
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }

    //minPrice minLat and maxLng
    if(minLat && !minLng && minPrice && !maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.lte]:[maxLng]
            },
            price:{
              [Op.gte]:[minPrice]
            },
            lat:{
              [Op.gte]:[minLat]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice minLng and maxLng
    if(!minLat && minLng && minPrice && !maxPrice && maxLng && !maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lng:{
                [Op.between]:[minLng, maxLng]
              },
              price:{
                [Op.gte]:[minPrice]
              },
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }

    //minPrice maxPrice minLat and maxLat
    if(minLat && !minLng && minPrice && maxPrice && !maxLng && maxLat){

        //finds all the spots
      const allSpots = await Spot.findAll({
        attributes:[
          'id', 'ownerId',
          'address', 'city', 'state',
          'country', 'lat', 'lng',
          'name', 'description', 'price',
          'createdAt', 'updatedAt'
        ],
        where:{
          lat:{
            [Op.between]:[minLat,maxLat]
          },
          price:{
            [Op.between]:[minPrice,maxPrice]
          }
        }
      })

      // res.json(allSpots)

      //gets all the reviews
      const allReviews = await Review.findAll()
      // res.json(allReviews)

      console.log(allReviews.length, 'Reviews')
      console.log(allSpots.length, 'Spots')


      const allImages = await Image.findAll({
        where:{imagableType:'Spot'}
      })
      console.log(allImages.length)


      const insertableSpots = allSpots.map(x => x.get({ plain: true }))

      for(let i=0; i<allSpots.length; i++){
          let sum = 0
          let totalReviews = 0
        for(let z=0; z<allReviews.length; z++){
          if(allSpots[i].id === allReviews[z].spotId){
            sum = sum + allReviews[z].stars
            totalReviews++
          }
        }
        let average = sum/totalReviews
        insertableSpots[i].avgRating = average

        for(let d=0; d<allImages.length; d++){
          if(allSpots[i].id === allImages[d].imagableId){
            insertableSpots[i].previewImage = allImages[d].url
          }
        }

        if(!insertableSpots[i].previewImage){
          insertableSpots[i].previewImage = null
        }
      }

      let object = {Spots:insertableSpots, page:page, size:size}
      res.json(object)
      return
    }

    //minPrice maxPrice minLat and minLng
    if(minLat && minLng && minPrice && maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.gte]:[minLng]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            },
            lat:{
              [Op.gte]:[minLat]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice maxPrice minLat and maxLng
    if(minLat && !minLng && minPrice && maxPrice && maxLng && !maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lng:{
                [Op.lte]:[maxLng]
              },
              lat:{
                [Op.gte]:[minLat]
              },
              price:{
                [Op.between]:[minPrice,maxPrice]
              }
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }

    //minPrice maxPrice maxLat and minLng
    if(minLat && !minLng && minPrice && maxPrice && !maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.gte]:[minLng]
            },
            lat:{
              [Op.lte]:[maxLat]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice maxPrice maxLat and maxLng
    if(!minLat && !minLng && minPrice && maxPrice && maxLng && maxLat){

            //finds all the spots
          const allSpots = await Spot.findAll({
            attributes:[
              'id', 'ownerId',
              'address', 'city', 'state',
              'country', 'lat', 'lng',
              'name', 'description', 'price',
              'createdAt', 'updatedAt'
            ],
            where:{
              lng:{
                [Op.lte]:[maxLng]
              },
              lat:{
                [Op.lte]:[maxLat]
              },
              price:{
                [Op.between]:[minPrice,maxPrice]
              }
            }
          })

          // res.json(allSpots)

          //gets all the reviews
          const allReviews = await Review.findAll()
          // res.json(allReviews)

          console.log(allReviews.length, 'Reviews')
          console.log(allSpots.length, 'Spots')


          const allImages = await Image.findAll({
            where:{imagableType:'Spot'}
          })
          console.log(allImages.length)


          const insertableSpots = allSpots.map(x => x.get({ plain: true }))

          for(let i=0; i<allSpots.length; i++){
              let sum = 0
              let totalReviews = 0
            for(let z=0; z<allReviews.length; z++){
              if(allSpots[i].id === allReviews[z].spotId){
                sum = sum + allReviews[z].stars
                totalReviews++
              }
            }
            let average = sum/totalReviews
            insertableSpots[i].avgRating = average

            for(let d=0; d<allImages.length; d++){
              if(allSpots[i].id === allImages[d].imagableId){
                insertableSpots[i].previewImage = allImages[d].url
              }
            }

            if(!insertableSpots[i].previewImage){
              insertableSpots[i].previewImage = null
            }
          }

          let object = {Spots:insertableSpots, page:page, size:size}
          res.json(object)
          return
    }

    //minPrice maxPrice minLng and maxLng
    if(!minLat && minLng && minPrice && maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.between]:[minLng, maxLng]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    ////////5555555555555555555555555

    //minPrice maxPrice minLat maxLat minLng ABCDE
    if(minLat && minLng && minPrice && maxPrice && !maxLng && maxLat){

                //finds all the spots
              const allSpots = await Spot.findAll({
                attributes:[
                  'id', 'ownerId',
                  'address', 'city', 'state',
                  'country', 'lat', 'lng',
                  'name', 'description', 'price',
                  'createdAt', 'updatedAt'
                ],
                where:{
                  lng:{
                    [Op.gte]:[minLng]
                  },
                  price:{
                    [Op.between]:[minPrice,maxPrice]
                  },
                  lat:{
                    [Op.between]:[minLat,maxLat]
                  }
                }
              })

              // res.json(allSpots)

              //gets all the reviews
              const allReviews = await Review.findAll()
              // res.json(allReviews)

              console.log(allReviews.length, 'Reviews')
              console.log(allSpots.length, 'Spots')


              const allImages = await Image.findAll({
                where:{imagableType:'Spot'}
              })
              console.log(allImages.length)


              const insertableSpots = allSpots.map(x => x.get({ plain: true }))

              for(let i=0; i<allSpots.length; i++){
                  let sum = 0
                  let totalReviews = 0
                for(let z=0; z<allReviews.length; z++){
                  if(allSpots[i].id === allReviews[z].spotId){
                    sum = sum + allReviews[z].stars
                    totalReviews++
                  }
                }
                let average = sum/totalReviews
                insertableSpots[i].avgRating = average

                for(let d=0; d<allImages.length; d++){
                  if(allSpots[i].id === allImages[d].imagableId){
                    insertableSpots[i].previewImage = allImages[d].url
                  }
                }

                if(!insertableSpots[i].previewImage){
                  insertableSpots[i].previewImage = null
                }
              }

              let object = {Spots:insertableSpots, page:page, size:size}
              res.json(object)
              return
    }

    //minPrice maxPrice minLat maxLat maxLng ABCDF
    if(minLat && !minLng && minPrice && maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.lte]:[maxLng]
            },
            lat:{
              [Op.between]:[minLat,maxLat]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice maxPrice minLat minLng maxLng ABCEF
    if(minLat && minLng && minPrice && maxPrice && maxLng && !maxLat){

                //finds all the spots
              const allSpots = await Spot.findAll({
                attributes:[
                  'id', 'ownerId',
                  'address', 'city', 'state',
                  'country', 'lat', 'lng',
                  'name', 'description', 'price',
                  'createdAt', 'updatedAt'
                ],
                where:{
                  lng:{
                    [Op.between]:[minLng, maxLng]
                  },
                  price:{
                    [Op.between]:[minPrice,maxPrice]
                  },
                  lng:{
                    [Op.gte]:[minLng]
                  }
                }
              })

              // res.json(allSpots)

              //gets all the reviews
              const allReviews = await Review.findAll()
              // res.json(allReviews)

              console.log(allReviews.length, 'Reviews')
              console.log(allSpots.length, 'Spots')


              const allImages = await Image.findAll({
                where:{imagableType:'Spot'}
              })
              console.log(allImages.length)


              const insertableSpots = allSpots.map(x => x.get({ plain: true }))

              for(let i=0; i<allSpots.length; i++){
                  let sum = 0
                  let totalReviews = 0
                for(let z=0; z<allReviews.length; z++){
                  if(allSpots[i].id === allReviews[z].spotId){
                    sum = sum + allReviews[z].stars
                    totalReviews++
                  }
                }
                let average = sum/totalReviews
                insertableSpots[i].avgRating = average

                for(let d=0; d<allImages.length; d++){
                  if(allSpots[i].id === allImages[d].imagableId){
                    insertableSpots[i].previewImage = allImages[d].url
                  }
                }

                if(!insertableSpots[i].previewImage){
                  insertableSpots[i].previewImage = null
                }
              }

              let object = {Spots:insertableSpots, page:page, size:size}
              res.json(object)
              return
    }

    //minPrice maxPrice maxLat minLng maxLng ABDEF
    if(!minLat && minLng && minPrice && maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.between]:[minLng, maxLng]
            },
            price:{
              [Op.between]:[minPrice,maxPrice]
            },
            lat:{
              [Op.lte]:[maxLat]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minPrice minLat maxLat minLng maxLng ACDEF
    if(minLat && minLng && minPrice && !maxPrice && maxLng && maxLat){

                //finds all the spots
              const allSpots = await Spot.findAll({
                attributes:[
                  'id', 'ownerId',
                  'address', 'city', 'state',
                  'country', 'lat', 'lng',
                  'name', 'description', 'price',
                  'createdAt', 'updatedAt'
                ],
                where:{
                  lng:{
                    [Op.between]:[minLng, maxLng]
                  },
                  lat:{
                    [Op.between]:[minLat,maxLat]
                  },
                  price:{
                    [Op.gte]:[minPrice]
                  }
                }
              })

              // res.json(allSpots)

              //gets all the reviews
              const allReviews = await Review.findAll()
              // res.json(allReviews)

              console.log(allReviews.length, 'Reviews')
              console.log(allSpots.length, 'Spots')


              const allImages = await Image.findAll({
                where:{imagableType:'Spot'}
              })
              console.log(allImages.length)


              const insertableSpots = allSpots.map(x => x.get({ plain: true }))

              for(let i=0; i<allSpots.length; i++){
                  let sum = 0
                  let totalReviews = 0
                for(let z=0; z<allReviews.length; z++){
                  if(allSpots[i].id === allReviews[z].spotId){
                    sum = sum + allReviews[z].stars
                    totalReviews++
                  }
                }
                let average = sum/totalReviews
                insertableSpots[i].avgRating = average

                for(let d=0; d<allImages.length; d++){
                  if(allSpots[i].id === allImages[d].imagableId){
                    insertableSpots[i].previewImage = allImages[d].url
                  }
                }

                if(!insertableSpots[i].previewImage){
                  insertableSpots[i].previewImage = null
                }
              }

              let object = {Spots:insertableSpots, page:page, size:size}
              res.json(object)
              return
    }

    // maxPrice minLat maxLat minLng and maxLng BCDEF
    if(minLat && minLng && !minPrice && maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.between]:[minLng, maxLng]
            },
            lat:{
              [Op.between]:[minLat,maxLng]
            },
            price:{
              [Op.lte]:[maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //444444444444

    // minPrice minLat maxLat minLng ACDE
    if(minLat && minLng && minPrice && !maxPrice && !maxLng && maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lat:{
                              [Op.between]:[minLat, maxLat]
                            },
                            price:{
                              [Op.gte]:[minPrice]
                            },
                            lng:{
                              [Op.gte]:[minLng]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // minPrice minLat maxLat maxLng ACDF
    if(minLat && !minLng && minPrice && !maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.between]:[minLat, maxLat]
            },
            price:{
              [Op.gte]:[minPrice]
            },
            lng:{
              [Op.lte]:[maxLng]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // minPrice minLat minLng maxLng ACEF
    if(minLat && minLng && minPrice && !maxPrice && maxLng && !maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lng:{
                              [Op.between]:[minLng, maxLng]
                            },
                            price:{
                              [Op.gte]:[minPrice]
                            },
                            lat:{
                              [Op.gte]:[minLat]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // minPrice maxLat minLng maxLng ADEF
    if(!minLat && minLng && minPrice && !maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.between]:[minLng, maxLng]
            },
            price:{
              [Op.gte]:[minPrice]
            },
            lat:{
              [Op.lte]:[maxLat]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // maxPrice minLat maxLat minLng BCDE
    if(minLat && minLng && !minPrice && maxPrice && !maxLng && maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lat:{
                              [Op.between]:[minLat, maxLat]
                            },
                            price:{
                              [Op.lte]:[maxPrice]
                            },
                            lng:{
                              [Op.gte]:[minLng]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // maxPrice minLat maxLat maxLng BCDF
    if(minLat && !minLng && !minPrice && maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.between]:[minLat, maxLat]
            },
            price:{
              [Op.lte]:[maxPrice]
            },
            lng:{
              [Op.lte]:[maxLng]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // maxPrice minLat minLng maxLng  BCEF
    if(minLat && minLng && !minPrice && maxPrice && maxLng && !maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lng:{
                              [Op.between]:[minLng, maxLng]
                            },
                            price:{
                              [Op.lte]:[maxPrice]
                            },
                            lat:{
                              [Op.gte]:[minLat]
                            }

                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // maxPrice maxLat minLng maxLng  BDEF
    if(minLat && !minLng && !minPrice && maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.between]:[minLng, maxLng]
            },
            price:{
              [Op.lte]:[maxPrice]
            },
            lat:{
              [Op.lte]:[maxLat]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // minLat maxLat minLng maxLng CDEF
    if(minLat && minLng && !minPrice && !maxPrice && maxLng && maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lat:{
                              [Op.between]:[minLat, maxLat]
                            },
                            lng:{
                              [Op.between]:[minLng,maxLng]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }


    //3333333333333333333333333333333333333333333

    // maxPrice minLat maxLat  BCD
    if(minLat && !minLng && !minPrice && maxPrice && !maxLng && maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lat:{
                              [Op.between]:[minLat, maxLat]
                            },
                            price:{
                              [Op.lte]:[maxPrice]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // maxPrice minLat minLng  BCE
    if(minLat && minLng && !minPrice && maxPrice && !maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.gte]:[minLng]
            },
            lat:{
              [Op.gte]:[minLat]
            },
            price:{
              [Op.lte]:[maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // maxPrice minLat maxLng BCF
    if(minLat && !minLng && !minPrice && maxPrice && maxLng && !maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lng:{
                              [Op.lte]:[maxLng]
                            },
                            price:{
                              [Op.lte]:[maxPrice]
                            },
                            lat:{
                              [Op.gte]:[minLat]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // maxPrice maxLat minLng BDE
    if(!minLat && minLng && !minPrice && maxPrice && !maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.gte]:[minLng]
            },
            lat:{
              [Op.lte]:[maxLat]
            },
            price:{
              [Op.lte]:[maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // maxPrice maxLat maxLng BDF
    if(!minLat && !minLng && !minPrice && maxPrice && maxLng && maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lng:{
                              [Op.lte]:[maxLng]
                            },
                            lat:{
                              [Op.lte]:[maxLat]
                            },
                            price:{
                              [Op.lte]:[maxPrice]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // maxPrice minLng maxLng BEF
    if(!minLat && minLng && !minPrice && maxPrice && maxLng && !maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.between]:[minLng, maxLng]
            },
            price:{
              [Op.lte]:[maxPrice]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    //minLat maxLat minLng CDE
    if(minLat && minLng && !minPrice && !maxPrice && !maxLng && maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lat:{
                              [Op.between]:[minLat, maxLat]
                            },
                            lng:{
                              [Op.gte]:[minLng]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // minLat maxLat maxLng CDF
    if(minLat && !minLng && !minPrice && !maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lat:{
              [Op.between]:[minLat, maxLat]
            },
            lng:{
              [Op.lte]:[maxLng]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }

    // minLat minLng maxLng CEF
    if(minLat && minLng && !minPrice && !maxPrice && maxLng && !maxLat){

                          //finds all the spots
                        const allSpots = await Spot.findAll({
                          attributes:[
                            'id', 'ownerId',
                            'address', 'city', 'state',
                            'country', 'lat', 'lng',
                            'name', 'description', 'price',
                            'createdAt', 'updatedAt'
                          ],
                          where:{
                            lng:{
                              [Op.between]:[minLng, maxLng]
                            },
                            lat:{
                              [Op.gte]:[minLat]
                            }
                          }
                        })

                        // res.json(allSpots)

                        //gets all the reviews
                        const allReviews = await Review.findAll()
                        // res.json(allReviews)

                        console.log(allReviews.length, 'Reviews')
                        console.log(allSpots.length, 'Spots')


                        const allImages = await Image.findAll({
                          where:{imagableType:'Spot'}
                        })
                        console.log(allImages.length)


                        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

                        for(let i=0; i<allSpots.length; i++){
                            let sum = 0
                            let totalReviews = 0
                          for(let z=0; z<allReviews.length; z++){
                            if(allSpots[i].id === allReviews[z].spotId){
                              sum = sum + allReviews[z].stars
                              totalReviews++
                            }
                          }
                          let average = sum/totalReviews
                          insertableSpots[i].avgRating = average

                          for(let d=0; d<allImages.length; d++){
                            if(allSpots[i].id === allImages[d].imagableId){
                              insertableSpots[i].previewImage = allImages[d].url
                            }
                          }

                          if(!insertableSpots[i].previewImage){
                            insertableSpots[i].previewImage = null
                          }
                        }

                        let object = {Spots:insertableSpots, page:page, size:size}
                        res.json(object)
                        return
    }

    // maxLat minLng maxLng DEF
    if(!minLat && minLng && !minPrice && !maxPrice && maxLng && maxLat){

          //finds all the spots
        const allSpots = await Spot.findAll({
          attributes:[
            'id', 'ownerId',
            'address', 'city', 'state',
            'country', 'lat', 'lng',
            'name', 'description', 'price',
            'createdAt', 'updatedAt'
          ],
          where:{
            lng:{
              [Op.between]:[minLng, maxLng]
            },
            lat:{
              [Op.lte]:[maxLat]
            }
          }
        })

        // res.json(allSpots)

        //gets all the reviews
        const allReviews = await Review.findAll()
        // res.json(allReviews)

        console.log(allReviews.length, 'Reviews')
        console.log(allSpots.length, 'Spots')


        const allImages = await Image.findAll({
          where:{imagableType:'Spot'}
        })
        console.log(allImages.length)


        const insertableSpots = allSpots.map(x => x.get({ plain: true }))

        for(let i=0; i<allSpots.length; i++){
            let sum = 0
            let totalReviews = 0
          for(let z=0; z<allReviews.length; z++){
            if(allSpots[i].id === allReviews[z].spotId){
              sum = sum + allReviews[z].stars
              totalReviews++
            }
          }
          let average = sum/totalReviews
          insertableSpots[i].avgRating = average

          for(let d=0; d<allImages.length; d++){
            if(allSpots[i].id === allImages[d].imagableId){
              insertableSpots[i].previewImage = allImages[d].url
            }
          }

          if(!insertableSpots[i].previewImage){
            insertableSpots[i].previewImage = null
          }
        }

        let object = {Spots:insertableSpots, page:page, size:size}
        res.json(object)
        return
    }



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


        for(let i=0; i<plainFirst.length; i++){
          if(!plainFirst[i].avgRating){
            console.log('here')
            plainFirst[i].avgRating=null
          }
          if(!plainFirst[i].previewImage){
            plainFirst[i].previewImage=null
          }
        }

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

    //an array of objects of ALL the reviews for SELECTED SPOT :: SO ALL HAVE THE SAME SPOT ID
    const allReviews = await Review.findAll({
      where:{
        spotId:req.params.id
      },

      // attributes:{
      //   group: ['id'],
      //   include:[
      //       [Sequelize.fn('COUNT', sequelize.col('review')), 'num'],
      //       [Sequelize.fn('AVG', sequelize.col('stars')), 'avg']
      //   ]
    // }
    })

    //total number of reviews for SELECTED SPOT
    let total = allReviews.length


    let sum = 0
    for(let i=0; i<allReviews.length; i++){

      sum = sum + allReviews[i].stars
    }

      let average = sum/total



    //finds ALL spots AT SELECTED SPOT
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

    //turns allSpots array of objects plain so that I CAN INSERT INTO OBJECT
    const plainFirst = all.map(x => x.get({ plain: true }))

    plainFirst[0].numReviews = total
    plainFirst[0].avgRating = average


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

    res.json(plainFirst[0])

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
  return
  }


  res.status(403).json({message:'Forbidden', status:403})
  return

})


//create a review for a spot based on spots id
router.post('/:spotId/reviews', requireAuth, validateReview, async(req,res)=>{

    let find = await Spot.findByPk(req.params.spotId)
    if(!find){
        res.status(404).send({message:"Spot couldn't be found", status:404})
        return
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
    return
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

  let findImageRI = await Image.findAll({
    where:{imagableType:'Review'},
    attributes:['id', 'url']
  })


  const plainFirst = all.map(x => x.get({ plain: true }))


  for(let t=0; t<findImageRI.length; t++){
    for(let a=0; a<findImageRI.length; a++)
    {
      if(findImageR[t].id === findImageRI[a].id){

        for(let i=0; i<all.length; i++){
          for(let d=0; d<findImageR.length; d++){

            console.log(plainFirst[i].id, findImageR[d].imagableId)
            if(plainFirst[i].id === findImageR[d].imagableId){
              // res.json(findImageR)
              // delete findImageR[d].preview
              plainFirst[i].ReviewImages = findImageRI
            }
          }
        }

          for(j=0; j<plainFirst.length; j++){
            if(!plainFirst[j].ReviewImages){
              plainFirst[j].ReviewImages=[]
            }
          }
      }
    }

  }

      let object = {Reveiws:plainFirst}
      res.json(object)
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
    return
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
