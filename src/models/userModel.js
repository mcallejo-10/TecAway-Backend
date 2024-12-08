import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  CP: {
    type: DataTypes.INTEGER(5),
    allowNull: false,
  },
  distance: {
    type: DataTypes.INTEGER(8),
    allowNull: false,
  },  
  photo: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
},{
  indexes: [{ unique: true, fields: ['email'] }],
  timestamps: true, // Activa la creación automática de createdAt y updatedAt
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

export default User;

