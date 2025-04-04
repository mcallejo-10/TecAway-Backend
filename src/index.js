// app.js
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors'; //para poder hacer puts, y tal desde el cliente al servidor
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import knowlegdeRoutes from './routes/knowledgeRoutes.js';
import userCompetenceRoutes from './routes/userKnowledgeRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { testConnection } from './db.js';
import { insertInitialUserData } from './start_data.js';
import dotenv from 'dotenv';
import {PORT} from './railwayConfig.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import basicAuth from 'express-basic-auth';

dotenv.config({ path: './environment.env' });


const app = express();
app.use(cors({
  credentials: true,
  origin: [
    'https://tec-away-frontend.vercel.app',
    'http://localhost:4200',
    'https://localhost:4200',
    'https://tecaway-backend-production-7c12.up.railway.app'
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

app.use(cookieParser());

// Middleware para analizar el cuerpo de las solicitudes con formato JSON
app.use(express.json());

// Middleware para analizar el cuerpo de las solicitudes con datos de formulario
app.use(express.urlencoded({ extended: true })); // Para analizar datos de formularios en el cuerpo de la solicitud

await testConnection();
// await insertInitialUserData();


// Configurar rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/section', sectionRoutes);
app.use('/knowledge', knowlegdeRoutes);
app.use('/user-knowledge', userCompetenceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/test', testRoutes);

// Move this before routes configuration
const swaggerAuth = basicAuth({
    users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    challenge: true,
    realm: 'TecAway API Documentation'
});

// Protected Swagger route - move this before other routes
app.use('/api-docs', swaggerAuth, swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

