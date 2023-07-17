const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Images';
    return queryInterface.bulkInsert(options, [
    {
      url:`https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg`,
      preview:true,
      imagableType:'Spot',
      imagableId:1

    },
    {
      url:`https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg`,
      preview:true,
      imagableType:'Spot',
      imagableId:1

    },
    {
      url:`https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg`,
      preview:true,
      imagableType:'Spot',
      imagableId:1

    },
    {
      url:`https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg`,
      preview:true,
      imagableType:'Spot',
      imagableId:1

    },
    {
      url:`https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg`,
      preview:true,
      imagableType:'Spot',
      imagableId:1

    },

    {
      url:'https://images.pexels.com/photos/1672813/pexels-photo-1672813.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:2

    },

    {
      url:'https://images.pexels.com/photos/788434/pexels-photo-788434.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:3

    },

    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:4

    },

    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:5

    },
    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:5

    },
    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:5

    },
    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:5

    },
    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:5

    },

    {
      url:'https://images.pexels.com/photos/9069564/pexels-photo-9069564.png',
      preview:true,
      imagableType:'Spot',
      imagableId:6

    },
    {
      url:'https://images.pexels.com/photos/9069564/pexels-photo-9069564.png',
      preview:true,
      imagableType:'Spot',
      imagableId:6

    },

    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },
    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },
    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },

    {
      url:'https://images.pexels.com/photos/2387965/pexels-photo-2387965.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:8

    },
    {
      url:'https://images.pexels.com/photos/2387965/pexels-photo-2387965.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:8

    },
    {
      url:'https://images.pexels.com/photos/2387965/pexels-photo-2387965.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:8

    },
    {
      url:'https://images.pexels.com/photos/2387965/pexels-photo-2387965.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:8

    },
    {
      url:'https://images.pexels.com/photos/2387965/pexels-photo-2387965.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:8

    },

    {
      url:'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:9

    },

    {
      url:'https://images.pexels.com/photos/9069564/pexels-photo-9069564.png',
      preview:true,
      imagableType:'Spot',
      imagableId:10

    },









    {
      url:'https://images.pexels.com/photos/65865/dawn-sun-mountain-landscape-65865.jpeg',
      preview:true,
      imagableType:'Review',
      imagableId:2

    },

  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
    }
};
