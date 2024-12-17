import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Knowledge from './knowledgeModel.js';

const UserKnowledge = sequelize.define('User_Knowledge', {
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    references: {
      model: User,   // Relación con el modelo User
      key: 'id_user',
    }
  },
  knowledge_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    references: {
      model: Knowledge,   // Relación con el modelo GeneralCompetence
      key: 'id_knowledge',
    }
  },
},
{
  timestamps: false, 
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});


UserKnowledge.belongsTo(User, { foreignKey: 'user_id' });

UserKnowledge.belongsTo(Knowledge, { foreignKey: 'knowledge_id' });

export default UserKnowledge;
