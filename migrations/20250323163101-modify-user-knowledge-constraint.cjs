'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First drop the existing foreign key
    await queryInterface.removeConstraint('User_Knowledges', 'User_Knowledges_ibfk_1');

    // Add the new constraint with CASCADE delete
    await queryInterface.addConstraint('User_Knowledges', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'User_Knowledges_ibfk_1',
      references: {
        table: 'Users',
        field: 'id_user'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to original constraint
    await queryInterface.removeConstraint('User_Knowledges', 'User_Knowledges_ibfk_1');
    await queryInterface.addConstraint('User_Knowledges', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'User_Knowledges_ibfk_1',
      references: {
        table: 'Users',
        field: 'id_user'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    });
  }
};
