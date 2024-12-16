import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Section from './sectionModel.js';

const UserSection = sequelize.define('User_Section', {
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    references: {
      model: User,   // Relación con el modelo User
      key: 'id_user',
    }
  },
  section_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    eferences: {
      model: Section,   // Relación con el modelo Section
      key: 'id_section',
    }
  },
},
{
  timestamps: false, 
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

UserSection.belongsTo(User, { foreignKey: 'user_id' });

UserSection.belongsTo(Section, { foreignKey: 'section_id' });

export default UserSection;
