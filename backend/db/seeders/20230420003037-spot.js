'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const {User, Spot} = require('../models')


const userSpots = [
  {
    firstName: 'Lost',
    lastName: 'Avenger',

    spots:[{
    address:'afhskafh',
    city:'dear',
    state:'mich',
    lat:564.45,
    lng:432.32,
    country:'aaa',
    name:'last',
    description:'fjsakfhjhe',
    price:5121.12}]
},

{
  firstName: 'Lost1',
  lastName:'Avenger1',

  spots:[{
  address:'afhskafh',
  city:'dear',
  state:'mich',
  country:'aaa',
  lat:564.65,
  lng:432.45,
  name:'last',
  description:'fjsakfhjhe',
  price:5121.1}]
},

{
  firstName:'Lost2',
  lastName:'Avenger2',

  spots:[{
  address:'afhskafh',
  city:'dear',
  state:'mich',
  country:'aaa',
  lat:564.01,
  lng:432.22,
  name:'last',
  description:'fjsakfhjhe',
  price:5121.12}]
},

]
module.exports = {
  async up (queryInterface, Sequelize) {

    for(let userIdx =0; userIdx < userSpots.length; userIdx++){
      const {firstName, lastName, spots} = userSpots[userIdx]
      const user = await User.findOne({
        where:{firstName, lastName}
      })

      for(let spotIdx = 0; spotIdx < spots.length; spotIdx++ ){
        const spot = spots[spotIdx]
        await Spot.create({...spot, userId: user.id})
      }
    }

  },

  async down (queryInterface, Sequelize) {
    for(let userIdx =0; userIdx < userSpots.length; userIdx++){
      const {firstName, lastName, spots} = userSpots[userIdx]
      const user = await User.findOne({
        where:{firstName, lastName}
      })

      for(let spotIdx = 0; spotIdx < spots.length; spotIdx++ ){
        const spot = spots[spotIdx]
        await Spot.create({...spot, userId: user.id})
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

//     options.tableName = 'Spots';
//     return queryInterface.bulkInsert(options, [
//     {
//       address:'afhskafh',
//       city:'dear',
//       state:'mich',
//       latitude:564.45,
//       longitude:432.32,
//       country:'aaa',
//       name:'last',
//       description:'fjsakfhjhe',
//       price:5121.12
//     },
//     {
//       address:'afhskafh',
//       city:'dear',
//       state:'mich',
//       country:'aaa',
//       latitude:564.65,
//       longitude:432.45,
//       name:'last',
//       description:'fjsakfhjhe',
//       price:5121.1
//     },
//     {
//       address:'afhskafh',
//       city:'dear',
//       state:'mich',
//       country:'aaa',
//       latitude:564.01,
//       longitude:432.22,
//       name:'last',
//       description:'fjsakfhjhe',
//       price:5121.12
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


//   options.tableName = 'Spots';
//   const Op = Sequelize.Op;
//   return queryInterface.bulkDelete(options);
//   }

// };
