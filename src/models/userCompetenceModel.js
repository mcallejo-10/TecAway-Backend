import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import GeneralCompetence from './generalCompetenceModel.js';

const UserCompetence = sequelize.define('User_Competence', {
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true
  },
  competence_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true
  },
},
{
  timestamps: false, 
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

User.hasMany(UserCompetence, { foreignKey: 'user_id' });
// UserCompetence.belongsTo(User, { foreignKey: 'user_id' });

GeneralCompetence.hasMany(UserCompetence, { foreignKey: 'competence_id' });
// UserCompetence.belongsTo(GeneralCompetence, { foreignKey: 'competence_id' });

export default UserCompetence;
