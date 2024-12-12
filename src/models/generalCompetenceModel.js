import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const GeneralCompetence = sequelize.define('General_Competence', {
    id_generalCompetence: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    generalCompetence: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
},
    {
        timestamps: false, // Activa la creación automática de createdAt y updatedAt
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    });


export default GeneralCompetence;