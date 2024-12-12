import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';

const RecoveryToken = sequelize.define('RecoveryToken', {
  token: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  timestamps: false
});
User.hasMany(RecoveryToken, { foreignKey: { name: 'user_id', allowNull: false } });
RecoveryToken.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false } });

export default RecoveryToken;


