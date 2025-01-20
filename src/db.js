import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from './railwayConfig.js';


dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'mysql',
  logging: console.log, // Habilita logs SQL, si no quieres logs usa 'false'
});

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
//     // username: DB_USER,
//     // password: DB_PASSWORD,
//     // database: DB_NAME,
//     host: DB_HOST,
//     dialect: 'mysql',
//     logging: console.log, // Habilita logs SQL
//     port: DB_PORT  
//   }
// );

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

