import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('tecaway', 'root', '', {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST_NAME,
    dialect: 'mysql',
    logging: console.log, // Habilita logs SQL

  }
);

const syncroModel = async () => {
  try {
    // Sincronizar el modelo con la base de datos (crear la tabla si no existe)
    // Con "alter: true" se sincronizan las columnas y se crean/eliminan si fuera necesario
    await sequelize.sync({ alter: true }).then(() => {
      console.log('Modelos sincronizado con la base de datos');
    }); 
  } catch (error) {
    console.error('Unable to connect to the database1:', error);
  }
};
  
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await syncroModel();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection };

