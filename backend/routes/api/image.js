

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Image, Spot, Review, User } = require('../../db/models');

const router = express.Router();
// const app = express()

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


//delete a spot image
router.delete('/spot-images/:id', requireAuth, async(req,res)=>{

    let imageSpot = await Image.findByPk(req.params.id)

    if(!imageSpot)
    {
        return res.status(404).json({message:"Spot Image couldn't be found", statusCode:404})
    }

    console.log(imageSpot.imagableType, 'type')
    console.log(imageSpot.imagableId, 'id')


    // res.json(imageSpot)

    if(imageSpot.imagableType === 'Spot')
    {
        const findSpot = await Spot.findAll({
            where:{id:imageSpot.imagableId}
        })

        console.log(findSpot[0].ownerId, 'owner')
        console.log(req.user.id, 'current')

        if(findSpot[0].ownerId === req.user.id)
        {
            await imageSpot.destroy()
            res.json({message:'Successfully Deleted', statusCode:200})
            return
        }

    }

    // res.send('you are not the owner of this Spot')
    res.status(403).json({message:'Forbidden', statusCode:403})

})


//delete a review image
router.delete('/review-images/:id', requireAuth, async(req,res)=>{

    let imageReview = await Image.findByPk(req.params.id)

    // console.log(imageReview)

    if(!imageReview)
    {
        return res.status(404).json({message:"Review Image couldn't be found", statusCode:404})
    }

    console.log(imageReview.imagableType, 'type')
    console.log(imageReview.imagableId, 'id')

    if(imageReview.imagableType === 'Review')
    {
        const findReview = await Review.findAll({
            where:{id:imageReview.imagableId}
        })

        // res.json(findReview)

        console.log(findReview[0].userId)

        if(findReview[0].userId === req.user.id)
        {
            await imageReview.destroy()
            res.json({message:'Successfully Deleted', statusCode:200})
            return
        }

    }

    // res.send('you did not write this review')
    res.status(403).json({message:'Forbidden',statusCode:403})

})


// app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = router;
