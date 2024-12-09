import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Knowledge = sequelize.define('Knowledge', {
    id_knowledge: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    knowledge: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
},
    {
        timestamps: false, // Activa la creación automática de createdAt y updatedAt
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    });


export default Knowledge;