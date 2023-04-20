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

    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
    {
      address:'afhskafh',
      city:'dear',
      state:'mich',
      latitude:564.45,
      longitude:432.32,
      country:'aaa',
      name:'last',
      description:'fjsakfhjhe',
      price:5121.12
    },
    {
      address:'afhskafh',
      city:'dear',
      state:'mich',
      country:'aaa',
      latitude:564.65,
      longitude:432.45,
      name:'last',
      description:'fjsakfhjhe',
      price:5121.1
    },
    {
      address:'afhskafh',
      city:'dear',
      state:'mich',
      country:'aaa',
      latitude:564.01,
      longitude:432.22,
      name:'last',
      description:'fjsakfhjhe',
      price:5121.12
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


  options.tableName = 'Spots';
  const Op = Sequelize.Op;
  return queryInterface.bulkDelete(options);
  }

};
