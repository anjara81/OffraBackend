const express = require('express');
const router = express.Router();
const candidatureController = require('../controller/candidature.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');
const upload = require('../config/multer.config');

/**
 * @swagger
 * /candidatures:
 *   get:
 *     summary: Récupère toutes les candidatures (admin uniquement)
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: offreId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [EN_ATTENTE, ENTRETIEN, ACCEPTEE, REFUSEE]
 *     responses:
 *       200:
 *         description: Liste des candidatures
 */
router.get('/', verifyAdmin, candidatureController.getAll);

/**
 * @swagger
 * /candidatures/{id}:
 *   get:
 *     summary: Récupère une candidature par ID (admin uniquement)
 *     tags: [Candidatures]
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
 *         description: Candidature trouvée
 *       404:
 *         description: Candidature non trouvée
 */
router.get('/:id', verifyAdmin, candidatureController.getById);

/**
 * @swagger
 * /candidatures:
 *   post:
 *     summary: Postuler à une offre (public, avec upload CV)
 *     tags: [Candidatures]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [offreId, nom, prenom, email, cv]
 *             properties:
 *               offreId:
 *                 type: integer
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               lettreMotivation:
 *                 type: string
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Candidature créée avec succès
 *       400:
 *         description: Champs manquants ou offre fermée
 *       404:
 *         description: Offre non trouvée
 *       409:
 *         description: Déjà postulé à cette offre
 */
router.post('/', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'lettreMotivation', maxCount: 1 }
]), candidatureController.create);

/**
 * @swagger
 * /candidatures/{id}/statut:
 *   patch:
 *     summary: Modifie le statut d'une candidature (admin uniquement)
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [statut]
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, ENTRETIEN, ACCEPTEE, REFUSEE]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Statut invalide
 *       404:
 *         description: Candidature non trouvée
 */
router.patch('/:id/statut', verifyAdmin, candidatureController.updateStatut);

/**
 * @swagger
 * /candidatures/{id}:
 *   delete:
 *     summary: Supprime une candidature (admin uniquement)
 *     tags: [Candidatures]
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
 *         description: Candidature supprimée avec succès
 *       404:
 *         description: Candidature non trouvée
 */
router.delete('/:id', verifyAdmin, candidatureController.delete);

module.exports = router;