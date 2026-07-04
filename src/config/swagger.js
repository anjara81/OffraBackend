const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ofra API',
      version: '1.0.0',
      description: "API de gestion d'offres d'emploi pour l'entreprise Ofra"
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur local'
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
    security: [
      { bearerAuth: [] }
    ]
  },
  // Chemins des fichiers où Swagger va chercher les commentaires
  apis: ['./src/route/*.js']
};

module.exports = swaggerJsdoc(options);