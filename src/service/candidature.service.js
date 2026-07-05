const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

class CandidatureService {

  // Récupérer toutes les candidatures (admin), avec filtres optionnels
  async getAll(filters = {}) {
    const { offreId, statut, candidatId } = filters;

    const where = {};
    if (offreId) where.offreId = Number(offreId);
    if (statut) where.statut = statut;
    if (candidatId) where.candidatId = Number(candidatId);

    return await prisma.candidature.findMany({
      where,
      include: {
        offre: true,
        candidat: true
      },
      orderBy: { dateCandidature: 'desc' }
    });
  }

  // Récupérer une candidature par ID
  async getById(id) {
    const candidature = await prisma.candidature.findUnique({
      where: { id: Number(id) },
      include: { offre: true, candidat: true }
    });

    if (!candidature) {
      throw { status: 404, message: "Candidature non trouvée" };
    }

    return candidature;
  }

  // Créer une candidature (candidat postule à une offre)
  async create(data, file) {
    const { offreId, nom, prenom, email, telephone, lettreMotivation } = data;

    if (!file) {
      throw { status: 400, message: "Le CV est requis" };
    }

    if (!offreId || !nom || !prenom || !email) {
      // On supprime le fichier déjà uploadé si la validation échoue
      this._deleteFile(file.path);
      throw { status: 400, message: "offreId, nom, prenom et email sont requis" };
    }

    // Vérifie que l'offre existe et est active
    const offre = await prisma.offre.findUnique({ where: { id: Number(offreId) } });
    if (!offre) {
      this._deleteFile(file.path);
      throw { status: 404, message: "Offre non trouvée" };
    }
    if (offre.statut !== 'ACTIVE') {
      this._deleteFile(file.path);
      throw { status: 400, message: "Cette offre n'accepte plus de candidatures" };
    }

    // Récupère le candidat existant par email, ou le crée
    let candidat = await prisma.candidat.findUnique({ where: { email } });

    if (!candidat) {
      candidat = await prisma.candidat.create({
        data: { nom, prenom, email, telephone }
      });
    }

    // Vérifie qu'il n'a pas déjà postulé à cette offre
    const existingCandidature = await prisma.candidature.findUnique({
      where: {
        offreId_candidatId: {
          offreId: Number(offreId),
          candidatId: candidat.id
        }
      }
    });

    if (existingCandidature) {
      this._deleteFile(file.path);
      throw { status: 409, message: "Vous avez déjà postulé à cette offre" };
    }

    // Chemin relatif stocké en DB (pas le chemin absolu du système)
    const cvPath = `/uploads/cv/${file.filename}`;

    const candidature = await prisma.candidature.create({
      data: {
        offreId: Number(offreId),
        candidatId: candidat.id,
        cvPath,
        lettreMotivation: lettreMotivation || null
      },
      include: { offre: true, candidat: true }
    });

    return candidature;
  }

  // Modifier le statut d'une candidature (admin)
  async updateStatut(id, statut) {
    const validStatuts = ['EN_ATTENTE', 'ENTRETIEN', 'ACCEPTEE', 'REFUSEE'];

    if (!statut || !validStatuts.includes(statut)) {
      throw { status: 400, message: `Statut invalide. Valeurs acceptées : ${validStatuts.join(', ')}` };
    }

    await this.getById(id); // vérifie qu'elle existe

    return await prisma.candidature.update({
      where: { id: Number(id) },
      data: { statut },
      include: { offre: true, candidat: true }
    });
  }

  // Supprimer une candidature (admin) — supprime aussi le fichier CV
  async delete(id) {
    const candidature = await this.getById(id);

    const filePath = path.join(__dirname, '..', candidature.cvPath);
    this._deleteFile(filePath);

    await prisma.candidature.delete({ where: { id: Number(id) } });

    return { message: "Candidature supprimée avec succès" };
  }

  // Utilitaire privé : supprime un fichier du disque en sécurité
  _deleteFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Erreur suppression fichier:", err);
      });
    }
  }
}

module.exports = new CandidatureService();