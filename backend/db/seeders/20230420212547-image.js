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
      url:`https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`,
      preview:true,
      imagableType:'Spot',
      imagableId:1

    },
    {
      url:'https://images.pexels.com/photos/65865/dawn-sun-mountain-landscape-65865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      preview:true,
      imagableType:'Review',
      imagableId:2

    },



    {
      url:'   https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      preview:true,
      imagableType:'Spot',
      imagableId:2

    },

    {
      url:'https://images.pexels.com/photos/3801458/pexels-photo-3801458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      preview:true,
      imagableType:'Spot',
      imagableId:3

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
