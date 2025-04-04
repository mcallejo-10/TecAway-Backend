import swaggerJSDoc from 'swagger-jsdoc';

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
      url: 'https://tecaway-backend-devs.up.railway.app',
      description: 'Development server',
    }
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;