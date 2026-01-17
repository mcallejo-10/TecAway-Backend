'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columnas de geolocalización a la tabla Users
    await queryInterface.addColumn('Users', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
      comment: 'Latitud de la ciudad del usuario'
    });

    await queryInterface.addColumn('Users', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
      comment: 'Longitud de la ciudad del usuario'
    });

    await queryInterface.addColumn('Users', 'country', {
      type: Sequelize.STRING(2),
      allowNull: false,  // ⭐ OBLIGATORIO
      defaultValue: 'ES',
      comment: 'Código ISO del país (ES, AR, MX, etc.) - OBLIGATORIO'
    });

    await queryInterface.addColumn('Users', 'postal_code', {
      type: Sequelize.STRING(10),
      allowNull: true,
      comment: 'Código postal (útil para búsquedas)'
    });

    console.log('✅ Columnas de geolocalización agregadas a Users');
  },

  async down(queryInterface, Sequelize) {
    // Revertir la migración eliminando las columnas
    await queryInterface.removeColumn('Users', 'latitude');
    await queryInterface.removeColumn('Users', 'longitude');
    await queryInterface.removeColumn('Users', 'country');
    await queryInterface.removeColumn('Users', 'postal_code');

    console.log('✅ Columnas de geolocalización eliminadas de Users');
  }
};
