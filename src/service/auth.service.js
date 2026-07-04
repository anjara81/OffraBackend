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
}

module.exports = new AuthService();