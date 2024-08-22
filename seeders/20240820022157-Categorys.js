'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categorys = require(`../data/Categorys.json`)
    categorys.forEach(e => {
      e.updatedAt = e.createdAt = new Date()
    })
    await queryInterface.bulkInsert(`Categories`, categorys , {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(`Categories`, null , {})
  }
};
