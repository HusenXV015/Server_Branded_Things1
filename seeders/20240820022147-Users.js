'use strict';
const { hash } = require(`../helpers/bcrypt`)
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = require(`../data/Users.json`)
    users.forEach(e => {
      e.password = hash(e.password)
      e.updatedAt = e.createdAt = new Date()
    })
    await queryInterface.bulkInsert(`Users`, users, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
