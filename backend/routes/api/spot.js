

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Sequelize, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



router.get('/' , async (req,res) =>{

    const all = await Spot.findAll()
    return all
})

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
        include:{
            model:Review,
            attributes:[]
        },
        include:{
            model:Image,
            attributes: ['id', 'url', 'preview']
        }
    })

    return res.json({
        'id':id,
        'userId':userId,
        'address':address
    })
})




module.exports = router;
