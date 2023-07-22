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

    //Ford Mustang
    {
      url:"https://images.pexels.com/photos/9334967/pexels-photo-9334967.jpeg",
      preview:true,
      imagableType:'Spot',
      imagableId:1

    },

    //Ford Mustang Mach E
    {
      url:'https://images.pexels.com/photos/12088129/pexels-photo-12088129.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:2

    },

    //Maserati Quattroporte
    {
      url:"https://images.pexels.com/photos/10308476/pexels-photo-10308476.jpeg",
      preview:true,
      imagableType:'Spot',
      imagableId:3

    },

    //Maserati Levante
    {
      url:'https://images.pexels.com/photos/12997736/pexels-photo-12997736.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:4

    },
    {
      url:'https://images.pexels.com/photos/12997736/pexels-photo-12997736.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:4

    },
    {
      url:'https://images.pexels.com/photos/12997736/pexels-photo-12997736.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:4

    },
    {
      url:'https://images.pexels.com/photos/12997736/pexels-photo-12997736.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:4

    },
    {
      url:'https://images.pexels.com/photos/12997736/pexels-photo-12997736.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:4

    },

    //Maserati GranTurismo
    {
      url:'https://images.pexels.com/photos/15192136/pexels-photo-15192136/free-photo-of-cars-road-traffic-street.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:5

    },
    {
      url:'https://images.pexels.com/photos/15192136/pexels-photo-15192136/free-photo-of-cars-road-traffic-street.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:5

    },

    //Maserati GranCabrio
    {
      url:'https://images.pexels.com/photos/977003/pexels-photo-977003.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:6

    },
    {
      url:'https://images.pexels.com/photos/977003/pexels-photo-977003.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:6

    },
    {
      url:'https://images.pexels.com/photos/977003/pexels-photo-977003.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:6

    },

    //McLaren 720S Coupe
    {
      url:'https://images.pexels.com/photos/10550012/pexels-photo-10550012.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },
    {
      url:'https://images.pexels.com/photos/10550012/pexels-photo-10550012.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },
    {
      url:'https://images.pexels.com/photos/10550012/pexels-photo-10550012.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },
    {
      url:'https://images.pexels.com/photos/10550012/pexels-photo-10550012.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },
    {
      url:'https://images.pexels.com/photos/10550012/pexels-photo-10550012.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:7

    },

    //McLaren 720S Spider
    {
      url:'https://images.pexels.com/photos/12484821/pexels-photo-12484821.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:8

    },

    //McLaren 765LT
    {
      url:'https://images.pexels.com/photos/7942890/pexels-photo-7942890.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:9

    },

    //McLaren GT
    {
      url:'https://images.pexels.com/photos/7813159/pexels-photo-7813159.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:10
    },

    //McLaren Artura
    {
      url:'https://images.pexels.com/photos/5050537/pexels-photo-5050537.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:11

    },

    //Maserati Ghibli
    {
      url:' https://images.pexels.com/photos/10464255/pexels-photo-10464255.jpeg',
      preview:true,
      imagableType:'Spot',
      imagableId:12

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
