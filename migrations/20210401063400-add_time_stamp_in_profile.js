"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return [
      queryInterface.addColumn("profile", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("profile", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return [
      queryInterface.removeColumn("createdAt"),
      queryInterface.removeColumn("updatedAt"),
    ];
  },
};
