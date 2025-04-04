import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TecAway API',
      version: '1.0.0',
      description: 'API documentation for TecAway - A platform for managing technical knowledge',
      contact: {
        name: 'TecAway Team',
        url: 'https://tec-away-frontend.vercel.app/',
        email: 'info.tecaway@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints relacionados con autenticación de usuarios'
      },
      {
        name: 'Usuarios',
        description: 'Operaciones con usuarios'
      },
      {
        name: 'Secciones',
        description: 'Gestión de secciones de conocimiento'
      },
      {
        name: 'Conocimientos',
        description: 'Gestión de conocimientos técnicos'
      },
      {
        name: 'Conocimientos de Usuario',
        description: 'Gestión de conocimientos asociados a usuarios'
      },
      {
        name: 'Contacto',
        description: 'Endpoints para contacto'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;