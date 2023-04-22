'use strict';



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
      url:'afhskafh',
      preview:true,
      imagableType:'aaaaa'

    },
    {
      url:'afhskafh',
      preview:true,
      imagableType:'aaaaa'

    },
    {
      url:'afhskafh',
      preview:true,
      imagableType:'aaaaa'

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