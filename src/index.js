// app.js
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors'; //para poder hacer puts, y tal desde el cliente al servidor
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import knowlegdeRoutes from './routes/knowledgeRoutes.js';
import userSectionRoutes from './routes/userSectionRoutes.js';
import userCompetenceRoutes from './routes/userCompetenceRoutes.js';
import generalCompetenceRoutes from './routes/generalCompetenceRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { testConnection } from './db.js';
import { insertInitialUserData } from './start_data.js';
import dotenv from 'dotenv';

dotenv.config({ path: './environment.env' });





const app = express();

// Configura el middleware CORS para que peuda recibir solicitudes de POST, PUT, DELETE, UPDATE, etc.
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4200'
}));

//header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// Middleware para analizar el cuerpo de las solicitudes con formato JSON
app.use(express.json());

// Middleware para analizar el cuerpo de las solicitudes con datos de formulario
app.use(express.urlencoded({ extended: true })); // Para analizar datos de formularios en el cuerpo de la solicitud

await testConnection();
await insertInitialUserData();

// Configurar rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/section', sectionRoutes);
app.use('/general_competence', generalCompetenceRoutes);
app.use('/knowledge', knowlegdeRoutes);
app.use('/userSection', userSectionRoutes);
app.use('/userCompetence', userCompetenceRoutes);
app.use('/test', testRoutes);

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

