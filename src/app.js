const express = require('express')
const authRoutes = require('./route/auth.route')
const offresRoutes = require('./route/offres.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const morgan = require('morgan')
const candidatsRoutes = require('./route/candidats.routes');
const path = require('path');
const multer = require('multer');
const candidaturesRoutes = require('./route/candidatures.routes');
const statsRoutes = require('./route/stats.routes');
const app = express()
app.use(express.json())
app.use(morgan('dev'))



app.use('/api/stats', statsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/candidatures', candidaturesRoutes);



app.use('/api/candidats', candidatsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes)
app.use('/api/offres', offresRoutes);
// Middleware d'erreur global (à placer après TOUTES les routes)
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "Le fichier dépasse la taille maximale de 5MB" });
    }
    return res.status(400).json({ message: error.message });
  }
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

module.exports = app
