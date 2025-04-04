import swaggerJSDoc from 'swagger-jsdoc';
import { PORT } from '../railwayConfig.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TecAway API',
    version: '1.0.0',
    description: 'API documentation for TecAway project',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local Development',
    },
    {
      url: 'https://tecaway-backend-production-7c12.up.railway.app',
      description: 'Production server',
    }
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;