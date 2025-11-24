import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProyectoDanie API',
      version: '1.0.0',
      description: 'API documentation for ProyectoDanie backend'
    },
    servers: [
      {
        url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`,
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer'
        }
      }
    }
  },
  apis: [
    path.join(process.cwd(), 'src', 'routes', '*.js'),
    path.join(process.cwd(), 'src', 'controllers', '*.js'),
    path.join(process.cwd(), 'src', 'models', '*.js')
  ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
