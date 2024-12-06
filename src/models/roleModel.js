import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Role = sequelize.define('Role', {
    id_role: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    role: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    },{
    indexes: [{ unique: true, fields: ['role'] }],
    timestamps: false, // Activa la creación automática de createdAt y updatedAt
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});