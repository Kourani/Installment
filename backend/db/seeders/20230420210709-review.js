'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const {Spot, User, Review} = require('../models')

const spotReviews = [
  {
    name: 'Last',
    userId:1,
    reviews:[
      {stars:5, review:'user 1'}
    ]
  },
  {
    name: 'Sweet',
    userId:1,
    reviews:[
      {stars:5, review:'user 1'}
    ]
  },
  {
    name: 'Sour',
    userId:1,
    reviews:[
      {stars:5, review:'user 1'}
    ]
  },
  {
    name: 'Last',
    userId:2,
    reviews:[
      {stars:5, review:'user 2'}
    ]
  },
  {
    name: 'Sweet',
    userId:3,
    reviews:[
      {stars:5, review:'user 3'}
    ]
  },

]

module.exports = {

  async up (queryInterface, Sequelize) {

    for(let spotIdx =0; spotIdx < spotReviews.length; spotIdx++){ //creates index spot loop
      const {name, reviews, userId } = spotReviews[spotIdx] //desconstruct and set position in array to index
      const spot = await Spot.findOne({
        where:{name}
      }) //find the spot by name

      // console.log('spotted',spot)
      // console.log('NAME', name)
      // console.log('REVIEWS', reviews)
      // console.log('userId', userId)


      for(let reviewIdx = 0; reviewIdx < reviews.length; reviewIdx++ ){ //creates index review loop
        const review = reviews[reviewIdx] //create variable equal to reviews array at review index

        // console.log('SPOT',Spot)
        // console.log('PLESASE',Spot.id)
        // console.log('SECOND', spot.id)
        await Review.create({...review, spotId:spot.id, userId}) //create a new review connected with spotId
      }
    }

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for(let spotIdx = 0; spotIdx<spotReviews.length; spotIdx++){
      const {name, reviews, userId} = spotReviews[spotIdx]
      const spot = await Spot.findOne({where:{name}})

      for(let reviewIdx =0; reviewIdx < reviews.length; reviewIdx++){
        const review = reviews[reviewIdx]
        await Review.destroy({where:{...review, spotId:spot.id, userId}})
      }
    }
}
}


// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */



//     options.tableName = 'Reviews';
//     return queryInterface.bulkInsert(options, [
//     {
//       review:'afhskafh',
//       stars:5,

//     },
//     {
//       review:'afhskafh',
//       stars:5,

//     },
//     {
//       review:'afhskafh',
//       stars:5,

//     },
//   ], {});
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     options.tableName = 'Reviews';
//   const Op = Sequelize.Op;
//   return queryInterface.bulkDelete(options);
//   }
// };
