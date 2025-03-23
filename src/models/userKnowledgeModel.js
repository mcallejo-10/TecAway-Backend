import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Knowledge from './knowledgeModel.js';

const UserKnowledge = sequelize.define('UserKnowledge', {
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
      model: Knowledge, 
      key: 'id_knowledge',
    }
  },
},
{
  timestamps: false, 
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// In UserKnowledge model
UserKnowledge.associate = function(models) {
  UserKnowledge.belongsTo(models.User, {
    foreignKey: 'user_id',
    targetKey: 'id_user',
    onDelete: 'CASCADE',
    hooks: true
  });
};

UserKnowledge.belongsTo(Knowledge, { foreignKey: 'knowledge_id' });

export default UserKnowledge;
