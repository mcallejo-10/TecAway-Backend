import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Section = sequelize.define('Section', {
    id_section: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    section: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    },{
    indexes: [{ unique: true }],
    timestamps: false, // Activa la creación automática de createdAt y updatedAt
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});


export default Section;