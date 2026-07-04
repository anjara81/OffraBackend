const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OffreService {

  // Récupérer toutes les offres (avec filtres optionnels)
  async getAll(filters = {}) {
    const { statut, typeContrat, categorie, lieu } = filters;

    const where = {};
    if (statut) where.statut = statut;
    if (typeContrat) where.typeContrat = typeContrat;
    if (categorie) where.categorie = categorie;
    if (lieu) where.lieu = { contains: lieu, mode: 'insensitive' };

    return await prisma.offre.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Récupérer une offre par ID
  async getById(id) {
    const offre = await prisma.offre.findUnique({
      where: { id: Number(id) },
      include: { candidatures: true }
    });

    if (!offre) {
      throw { status: 404, message: "Offre non trouvée" };
    }

    return offre;
  }

  // Créer une offre
  async create(data) {
    const { titre, description, lieu, typeContrat, categorie, salaire, dateExpiration, statut } = data;

    if (!titre || !description || !lieu) {
      throw { status: 400, message: "Titre, description et lieu sont requis" };
    }

    return await prisma.offre.create({
      data: {
        titre,
        description,
        lieu,
        typeContrat: typeContrat || 'CDI',
        categorie,
        salaire,
        dateExpiration: dateExpiration ? new Date(dateExpiration) : null,
        statut: statut || 'ACTIVE'
      }
    });
  }

  // Modifier une offre
  async update(id, data) {
    await this.getById(id); // vérifie qu'elle existe (throw 404 sinon)

    const { titre, description, lieu, typeContrat, categorie, salaire, dateExpiration, statut } = data;

    return await prisma.offre.update({
      where: { id: Number(id) },
      data: {
        ...(titre && { titre }),
        ...(description && { description }),
        ...(lieu && { lieu }),
        ...(typeContrat && { typeContrat }),
        ...(categorie !== undefined && { categorie }),
        ...(salaire !== undefined && { salaire }),
        ...(dateExpiration !== undefined && { dateExpiration: dateExpiration ? new Date(dateExpiration) : null }),
        ...(statut && { statut })
      }
    });
  }

  // Supprimer une offre
  async delete(id) {
    await this.getById(id); // vérifie qu'elle existe

    await prisma.offre.delete({ where: { id: Number(id) } });

    return { message: "Offre supprimée avec succès" };
  }
}

module.exports = new OffreService();