

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Sequelize, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//get all spots
router.get('/' , async (req,res) =>{

    const allSpots = await Spot.findAll({
        include: ['state', 'country', 'city', 'latitude',
                'longitude', 'name', 'description',
                'price', 'createdAt', 'updatedAt', 'previewImage',
                 'avgRating']
    })

    res.json(allSpots)
})

//get details for a spot from an id
router.get('/:id' , async (req,res) =>{

    const all = await Spot.findAll({
        where:{
            id:req.params.id
        },
        attributes:{
            include:[
                [Sequelize.fn('COUNT', sequelize.col('review')), 'numReviews'],
                [Sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        },
        include:[{
                model:Review,
                attributes:['review']
            },
                {model:Image,
                attributes: ['id', 'url', 'preview']
            }
        ],
    })
    return res.json({
        'id':id,
        'userId':userId,
        'address':address
    })
})

//create a spot
router.post('/', async(req,res) =>{
    let newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        latitude,
        longitude,
        name,
        description,
        price,
        userId:user.id
    })
    res.json(newSpot)
})

//delete a spot !!
router.delete('/:spotId', async(req,res) =>{
    let spotDelete = Spot.findAll({
        where: {id: req.params.spotId},
    })

    let indexx = spotDelete.findIndex(req.params.spotId)
    let updatedSpots = spotDelete.splice(indexx, 1)


    console.log(spotDelete)

    res.json(updatedSpots)
})






module.exports = router;
