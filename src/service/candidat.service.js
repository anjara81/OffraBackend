const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CandidatService {

  // Récupérer tous les candidats
  async getAll() {
    return await prisma.candidat.findMany({
      orderBy: { createdAt: 'desc' },
      include: { candidatures: true }
    });
  }

  // Récupérer un candidat par ID
  async getById(id) {
    const candidat = await prisma.candidat.findUnique({
      where: { id: Number(id) },
      include: { candidatures: { include: { offre: true } } }
    });

    if (!candidat) {
      throw { status: 404, message: "Candidat non trouvé" };
    }

    return candidat;
  }

  // Créer un candidat
  async create(data) {
    const { nom, prenom, email, telephone } = data;

  if (!nom || !prenom || !email) {
    throw { status: 400, message: "Nom, prénom et email sont requis" };
  }

  if (!isValidEmail(email)) {
    throw { status: 400, message: "Adresse email invalide" };
  }

  if (!isValidPhone(telephone)) {
    throw { status: 400, message: "Le téléphone doit contenir exactement 10 chiffres" };
  }

    return await prisma.candidat.create({
      data: { nom, prenom, email, telephone }
    });
  }

  // Modifier un candidat
  async update(id, data) {
    await this.getById(id); // vérifie qu'il existe

    const { nom, prenom, email, telephone } = data;

    if (email && !isValidEmail(email)) {
    throw { status: 400, message: "Adresse email invalide" };
  }

  if (telephone && !isValidPhone(telephone)) {
    throw { status: 400, message: "Le téléphone doit contenir exactement 10 chiffres" };
  }

    return await prisma.candidat.update({
      where: { id: Number(id) },
      data: {
        ...(nom && { nom }),
        ...(prenom && { prenom }),
        ...(email && { email }),
        ...(telephone !== undefined && { telephone })
      }
    });
  }

  // Supprimer un candidat
  async delete(id) {
    await this.getById(id); // vérifie qu'il existe

    await prisma.candidat.delete({ where: { id: Number(id) } });

    return { message: "Candidat supprimé avec succès" };
  }
}

module.exports = new CandidatService();