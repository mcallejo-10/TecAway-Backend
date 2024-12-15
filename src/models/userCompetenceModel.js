import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import GeneralCompetence from './generalCompetenceModel.js';

const UserCompetence = sequelize.define('User_Competences', {
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    references: {
      model: User,   // Relación con el modelo User
      key: 'id_user',
    }
  },
  competence_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    references: {
      model: GeneralCompetence,   // Relación con el modelo GeneralCompetence
      key: 'id_generalCompetence',
    }
  },
},
{
  timestamps: false, 
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});


UserCompetence.belongsTo(User, { foreignKey: 'user_id' });

UserCompetence.belongsTo(GeneralCompetence, { foreignKey: 'competence_id' });

export default UserCompetence;
