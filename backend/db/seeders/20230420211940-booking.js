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

    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
    {
      startDate:'afhskafh',
      endDate:'aaaaaa',
      userId:1,
      spotId:1

    },
    {
      startDate:'afhskafh1',
      endDate:'aaaaaa1',
      userId:2,
      spotId:3


    },
    {
      startDate:'afhskafh2',
      endDate:'aaaaaa2',
      userId:3,
      spotId:2

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
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
    }
};
