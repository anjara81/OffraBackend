const express = require('express');
const router = express.Router();
const offreController = require('../controller/offre.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');
/**
 * @swagger
 * /offres:
 *   get:
 *     summary: Récupère la liste de toutes les offres
 *     tags: [Offres]
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut (ACTIVE, FERMEE, BROUILLON)
 *       - in: query
 *         name: lieu
 *         schema:
 *           type: string
 *         description: Filtrer par lieu
 *     responses:
 *       200:
 *         description: Liste des offres récupérée avec succès
 */
router.get('/', offreController.getAll);

/**
 * @swagger
 * /offres/{id}:
 *   get:
 *     summary: Récupère une offre par son ID
 *     tags: [Offres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offre trouvée
 *       404:
 *         description: Offre non trouvée
 */
router.get('/:id', offreController.getById);

/**
 * @swagger
 * /offres:
 *   post:
 *     summary: Crée une nouvelle offre (admin uniquement)
 *     tags: [Offres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, description, lieu]
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               lieu:
 *                 type: string
 *               typeContrat:
 *                 type: string
 *                 enum: [CDI, CDD, STAGE, FREELANCE, ALTERNANCE]
 *               categorie:
 *                 type: string
 *               salaire:
 *                 type: string
 *               dateExpiration:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Offre créée avec succès
 *       400:
 *         description: Champs manquants
 *       401:
 *         description: Non authentifié
 */
router.post('/', verifyAdmin, offreController.create);

/**
 * @swagger
 * /offres/{id}:
 *   put:
 *     summary: Met à jour une offre (admin uniquement)
 *     tags: [Offres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               statut:
 *                 type: string
 *                 enum: [ACTIVE, FERMEE, BROUILLON]
 *     responses:
 *       200:
 *         description: Offre mise à jour
 *       404:
 *         description: Offre non trouvée
 */
router.put('/:id', verifyAdmin, offreController.update);

/**
 * @swagger
 * /offres/{id}:
 *   delete:
 *     summary: Supprime une offre (admin uniquement)
 *     tags: [Offres]
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
 *         description: Offre supprimée avec succès
 *       404:
 *         description: Offre non trouvée
 */
router.delete('/:id', verifyAdmin, offreController.delete);

module.exports = router;