import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Section from './sectionModel.js';

const UserSection = sequelize.define('UserSection', {
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    
  },
  section_id: {
    type: DataTypes.INTEGER(8).UNSIGNED
  },

},
{
  timestamps: false, 
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});
User.hasMany(UserSection, { foreignKey: 'user_id' });
// UserSection.belongsTo(User, { foreignKey: 'user_id' });

Section.hasMany(UserSection, { foreignKey: 'section_id' });
// UserSection.belongsTo(Section, { foreignKey: 'section_id' });

export default UserSection;
