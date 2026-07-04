const express = require('express');
const router = express.Router();
const candidatController = require('../controller/candidat.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /candidats:
 *   get:
 *     summary: Récupère la liste de tous les candidats (admin uniquement)
 *     tags: [Candidats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des candidats récupérée avec succès
 */
router.get('/', verifyAdmin, candidatController.getAll);

/**
 * @swagger
 * /candidats/{id}:
 *   get:
 *     summary: Récupère un candidat par son ID (admin uniquement)
 *     tags: [Candidats]
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
 *         description: Candidat trouvé
 *       404:
 *         description: Candidat non trouvé
 */
router.get('/:id', verifyAdmin, candidatController.getById);

/**
 * @swagger
 * /candidats:
 *   post:
 *     summary: Crée un candidat
 *     tags: [Candidats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, prenom, email]
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidat créé avec succès
 *       400:
 *         description: Champs manquants
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/', candidatController.create);

/**
 * @swagger
 * /candidats/{id}:
 *   put:
 *     summary: Met à jour un candidat (admin uniquement)
 *     tags: [Candidats]
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
 *         description: Candidat mis à jour
 *       404:
 *         description: Candidat non trouvé
 */
router.put('/:id', verifyAdmin, candidatController.update);

/**
 * @swagger
 * /candidats/{id}:
 *   delete:
 *     summary: Supprime un candidat (admin uniquement)
 *     tags: [Candidats]
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
 *         description: Candidat supprimé avec succès
 *       404:
 *         description: Candidat non trouvé
 */
router.delete('/:id', verifyAdmin, candidatController.delete);

module.exports = router;