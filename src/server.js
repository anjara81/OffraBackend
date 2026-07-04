const app = require('./app')
const prisma = require('./config/prisma')

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log('========================================')
  console.log(`🚀 Serveur Ofra lancé avec succès`)
  console.log(`📡 Port         : ${PORT}`)
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 URL          : http://localhost:${PORT}`)
  console.log(`📚 Swagger docs : http://localhost:${PORT}/api-docs`)
  console.log(`🕐 Démarré le   : ${new Date().toLocaleString()}`)
  console.log('========================================')
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Signal SIGINT reçu, arrêt du serveur en cours...')
  await prisma.$disconnect()
  console.log('🔌 Connexion Prisma fermée')
  server.close(() => {
    console.log('✅ Serveur arrêté proprement')
    process.exit(0)
  })
})

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Log des erreurs non gérées (utile pour debug pendant le projet)
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
})