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
  title: {
    type: DataTypes.STRING(130),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(2400),
    allowNull: true,
  },
  town: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  can_move: {
    type: DataTypes.BOOLEAN(1),
    allowNull: true,
  },  
  photo: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  roles: {
    type: DataTypes.STRING(30),
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('roles');
      if (!rawValue) {
        console.log('Valor de roles es undefined o null');
        return [];
      }
      return rawValue.split(',');
    },
    set(value) {
      this.setDataValue('roles', value.join(','));
    }
  },
},{
  indexes: [{ unique: true, fields: ['email'] }],
  timestamps: true, 
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// In User model
User.associate = function(models) {
  User.hasMany(models.UserKnowledge, {
    foreignKey: 'user_id',
    sourceKey: 'id_user',
    onDelete: 'CASCADE',
    hooks: true
  });
};

export default User;
