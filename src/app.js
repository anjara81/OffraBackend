const express = require('express')
const authRoutes = require('./route/auth.route')

const offresRoutes = require('./route/offres.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const morgan = require('morgan')
const candidatsRoutes = require('./route/candidats.routes');


// ... tes autres middlewares


const app = express()

app.use('/api/candidats', candidatsRoutes);
app.use(morgan('dev'))
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes)
app.use('/api/offres', offresRoutes);

module.exports = app
