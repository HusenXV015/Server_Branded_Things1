'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const product = require(`../data/Products.json`)
    product.forEach(e => {
      e.updatedAt = e.createdAt = new Date()
    })
    await queryInterface.bulkInsert(`Products`,product,{})
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete(`Products`,null,{})
  }
};
