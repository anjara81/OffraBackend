const express = require('express');
const router = express.Router();
const statsController = require('../controller/stats.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /stats/dashboard:
 *   get:
 *     summary: Récupère toutes les statistiques du dashboard admin
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 */
router.get('/dashboard', verifyAdmin, statsController.getDashboard);

/**
 * @swagger
 * /stats/offres/{id}:
 *   get:
 *     summary: Récupère les statistiques détaillées d'une offre
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statistiques de l'offre
 *       404:
 *         description: Offre non trouvée
 */
router.get('/offres/:id', verifyAdmin, statsController.getOffreStats);

module.exports = router;