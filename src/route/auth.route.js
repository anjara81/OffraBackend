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
 *                 example: anjara@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234
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
 *                 example: anjara Tiana
 *               email:
 *                 type: string
 *                 example: anjara@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       201:
 *         description: Admin créé avec succès
 *       400:
 *         description: Champs manquants
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', authController.register); // à désactiver/protéger après création du 1er admin

const { verifyAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Récupère le profil de l'admin connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 */
router.get('/profile', verifyAdmin, authController.getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Met à jour le profil de l'admin connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, email]
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       409:
 *         description: Email déjà utilisé
 */
router.put('/profile', verifyAdmin, authController.updateProfile);

/**
 * @swagger
 * /auth/password:
 *   put:
 *     summary: Change le mot de passe de l'admin connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.put('/password', verifyAdmin, authController.changePassword);
module.exports = router;