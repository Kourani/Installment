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
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName:'Demo',
        lastName:'User'
      },

      {
        email: 'ice@user.io',
        username: 'Ice-Nation',
        hashedPassword: bcrypt.hashSync('password1'),
        firstName:'Lost',
        lastName:'Avenger'
      },

      {
        email: 'summer@user.io',
        username: 'Summer-Nation',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName:'Born',
        lastName:'Avenger'
      },
      {
        email: 'winter@user.io',
        username: 'Winter-Nation',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName:'Avenged',
        lastName:'Avenger'
      },
      {
        email: 'spring@user.io',
        username: 'Spring-Nation',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName:'Unknown',
        lastName:'Avenger'
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'Ice-Nation', 'Summer-Nation', 'Winter-Nation', 'Spring-Nation'] }
    }, {});
  }
};
