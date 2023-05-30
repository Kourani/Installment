

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

    //get all reviews, include user
    const all = await Review.findAll({
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


    //get all images that pertain to reviews with id url imagable id
    let findImageR = await Image.findAll({
      where:{imagableType:'Review'},
      attributes:['id', 'url', 'imagableId']
    })

    let plainFirst = all.map(x => x.get({ plain: true })) //plain to be able to insert


    for(let t=0; t<findImageR.length; t++){
          for(let i=0; i<all.length; i++)
              if(plainFirst[i].id === findImageR[t].imagableId){
                plainFirst[i].ReviewImages = findImageR
              }
            }
            for(j=0; j<plainFirst.length; j++){
              if(!plainFirst[j].ReviewImages){
                plainFirst[j].ReviewImages=[]
              }
            }
        // }


        console.log( req.params.id)
    // res.json(plainFirst)

    console.log(plainFirst.length)

    let imageReview
    for(let z=0; z<plainFirst.length; z++){

        console.log(plainFirst[z].ReviewImages.length)

        for(let y=0; y<plainFirst[z].ReviewImages.length; y++){

            // console.log(plainFirst[z].ReviewImages[y].id ,'kkkkkkkkkkkkk')
            console.log(req.params.id)
            if(plainFirst[z].ReviewImages[y].id === parseInt(req.params.id)){
                imageReview = await Image.findByPk(req.params.id)
                // res.json(imageReview)
            }
        }
    }

    // return res.json(imageReview)
    // return res.json(plainFirst)
    // return res.json(imageReview)
    // return res.json('nothing')

    if(!imageReview){
        return res.status(404).json({message:"Review Image couldn't be found", statusCode:404})
    }


    for(let q=0; q <plainFirst.length; q++){
        if(plainFirst[q].userId === parseInt(req.user.id)){
            await imageReview.destroy()
            res.json({message:'Successfully Deleted', statusCode:200})
            return
        }
    }



    return res.status(404).json({message:"Review Image couldn't be found", statusCode:404})


})


// app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = router;
