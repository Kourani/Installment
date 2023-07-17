'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// const {Sequelize} = require("sequelize")

const {User, Spot} = require('../models')


const userSpots = [

  {
    firstName: 'Demo',
    lastName: 'User',

    spots:[
      {
      address:"123 Disney Lane",
      city:"Tusayan",
      state:'Arizona',
      lat: 37.7645358,
      lng: -122.4730327,
      country:"United States of America",
      name:"Peach",
      description:"Place where web developers are created",
      price:50}
  ]
},


  {
    firstName: 'Lost',
    lastName: 'Avenger',

    spots:[{
    address:"123 Disney Lane",
    city:"San Jose",
    state:'California',
    lat: 37.7645358,
    lng: -122.4730327,
    country:"United States of America",
    name:"Lemon",
    description:"Place where web developers are created",
    price:5121.12},

    {
      address:"123 Disney Lane",
      city:"Tusayan",
      state:'Arizona',
      lat: 37.7645358,
      lng: -122.4730327,
      country:"United States of America",
      name:"Mango",
      description:"Place where web developers are created",
      price:5121.12}
  ]
},

{
  firstName: 'Born',
  lastName:'Avenger',

  spots:[{
  address:"123 Disney Lane",
  city:'New York',
  state:'New York',
  country:"United States of America",
  lat:564.65,
  lng:432.45,
  name:'Apple',
  description:'Home this is what this place resembles. And who does not want to go back home?',
  price:5121.1}]
},

{
  firstName:'Avenged',
  lastName:'Avenger',

  spots:[{
  address:"123 Disney Lane",
  city:'Orlando',
  state:'Florida',
  country:"United States of America",
  lat:564.01,
  lng:432.22,
  name:'Orange',
  description:'This place is not usually booked year round but for the people who give this place a chance They always end up coming back',
  price:5121.12},

  {
    address:"123 Disney Lane",
    city:'TEST1',
    state:'Florida',
    country:"United States of America",
    lat:564.01,
    lng:432.22,
    name:'Grape',
    description:'This place is always booked year round. If your lucky and theres still a spot life take it you will not regret it',
    price:5121.12},

    {
      address:"123 Disney Lane",
      city:'TEST2',
      state:'Florida',
      country:"United States of America",
      lat:564.01,
      lng:432.22,
      name:'Cherry',
      description:'Visit me',
      price:5121.12},

      {
        address:"123 Disney Lane",
        city:'TEST3',
        state:'Florida',
        country:"United States of America",
        lat:564.01,
        lng:432.22,
        name:'Banana',
        description:'Who doesnt enjoy the wide outdoors',
        price:5121.12},

        {
          address:"123 Disney Lane",
          city:'TEST4',
          state:'Florida',
          country:"United States of America",
          lat:564.01,
          lng:432.22,
          name:'Apricot',
          description:'Its the place youve been searching for, Book a trip',
          price:5121.12}

  ]},

{
  firstName:'Unknown',
  lastName:'Avenger',

  spots:[{
  address:"123 Disney Lane",
  city:'asd',
  state:'Florida',
  country:"United States of America",
  lat:564.01,
  lng:432.22,
  name:'Pineapple',
  description:'Welcome look around and enjoy. The place is full of wonders',
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
        await Spot.create({...spot, ownerId: user.id})
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
        await Spot.create({...spot, ownerId: user.id})
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
