const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthService {

  async login(email, password) {
    if (!email || !password) {
      throw { status: 400, message: "Email et mot de passe requis" };
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      throw { status: 401, message: "Email ou mot de passe incorrect" };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw { status: 401, message: "Email ou mot de passe incorrect" };
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return {
      token,
      admin: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email
      }
    };
  }

  async register(nom, email, password) {
    if (!nom || !email || !password) {
      throw { status: 400, message: "Tous les champs sont requis" };
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      throw { status: 409, message: "Cet email est déjà utilisé" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { nom, email, password: hashedPassword }
    });

    return {
      id: admin.id,
      nom: admin.nom,
      email: admin.email
    };
  }

  // À ajouter dans la classe AuthService existante

  async getProfile(adminId) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, nom: true, email: true, createdAt: true }
    });

    if (!admin) {
      throw { status: 404, message: "Admin non trouvé" };
    }

    return admin;
  }

  async updateProfile(adminId, data) {
    const { nom, email } = data;

    if (!nom || !email) {
      throw { status: 400, message: "Nom et email sont requis" };
    }

    // Vérifie que l'email n'est pas déjà utilisé par un autre admin
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin && existingAdmin.id !== adminId) {
      throw { status: 409, message: "Cet email est déjà utilisé" };
    }

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: { nom, email },
      select: { id: true, nom: true, email: true }
    });

    return admin;
  }

  async changePassword(adminId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw { status: 400, message: "Mot de passe actuel et nouveau mot de passe requis" };
    }

    if (newPassword.length < 6) {
      throw { status: 400, message: "Le nouveau mot de passe doit contenir au moins 6 caractères" };
    }

    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      throw { status: 404, message: "Admin non trouvé" };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      throw { status: 401, message: "Mot de passe actuel incorrect" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    return { message: "Mot de passe modifié avec succès" };
  }
}

module.exports = new AuthService();