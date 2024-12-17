import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import Section from './sectionModel.js';

const Knowledge = sequelize.define('Knowledge', {
    id_knowledge: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    knowledge: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    section_id: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        allowNull: false,
    },
},
    {
        timestamps: false, // Activa la creación automática de createdAt y updatedAt
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    });

    Knowledge.belongsTo(Section, { foreignKey: 'section_id' });

export default Knowledge;