const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion de l'admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@ofra.com
 *               password:
 *                 type: string
 *                 example: MotDePasse123
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne le token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nom:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Email et mot de passe requis
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Crée un nouvel admin (à protéger/désactiver après la création du 1er admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, email, password]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Admin Ofra
 *               email:
 *                 type: string
 *                 example: admin@ofra.com
 *               password:
 *                 type: string
 *                 example: MotDePasse123
 *     responses:
 *       201:
 *         description: Admin créé avec succès
 *       400:
 *         description: Champs manquants
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', authController.register); // à désactiver/protéger après création du 1er admin

module.exports = router;