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
  // 🗺️ Coordenadas geográficas para cálculo de distancias
  latitude: {
    type: DataTypes.DECIMAL(10, 8), // Ej: 40.41675000
    allowNull: true,
    comment: 'Latitud de la ciudad del usuario',
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8), // Ej: -3.70379000
    allowNull: true,
    comment: 'Longitud de la ciudad del usuario',
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: false,  // ⭐ OBLIGATORIO
    defaultValue: 'ES',
    comment: 'Código ISO del país (ES, AR, MX, etc.) - OBLIGATORIO',
  },
  postal_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Código postal (útil para búsquedas)',
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


export default User;

