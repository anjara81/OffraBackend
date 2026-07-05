const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class StatsService {

  async getDashboardStats() {
    const [
      totalOffres,
      offresParStatut,
      totalCandidats,
      totalCandidatures,
      candidaturesParStatut,
      offresExpirantBientot,
      candidaturesRecentes,
      topOffres,
      candidaturesParMois,
      offresParType,
      offresParCategorie
    ] = await Promise.all([
      // Nombre total d'offres
      prisma.offre.count(),

      // Répartition des offres par statut (ACTIVE, FERMEE, BROUILLON)
      prisma.offre.groupBy({
        by: ['statut'],
        _count: { statut: true }
      }),

      // Nombre total de candidats
      prisma.candidat.count(),

      // Nombre total de candidatures
      prisma.candidature.count(),

      // Répartition des candidatures par statut
      prisma.candidature.groupBy({
        by: ['statut'],
        _count: { statut: true }
      }),

      // Offres actives qui expirent dans les 7 prochains jours
      prisma.offre.findMany({
        where: {
          statut: 'ACTIVE',
          dateExpiration: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: { id: true, titre: true, dateExpiration: true },
        orderBy: { dateExpiration: 'asc' }
      }),

      // 5 dernières candidatures reçues
      prisma.candidature.findMany({
        take: 5,
        orderBy: { dateCandidature: 'desc' },
        include: {
          offre: { select: { id: true, titre: true } },
          candidat: { select: { id: true, nom: true, prenom: true, email: true } }
        }
      }),

      // Top 5 des offres avec le plus de candidatures
      prisma.offre.findMany({
        take: 5,
        select: {
          id: true,
          titre: true,
          _count: { select: { candidatures: true } }
        },
        orderBy: {
          candidatures: { _count: 'desc' }
        }
      }),

      // Candidatures groupées par mois (12 derniers mois) - requête brute car Prisma groupBy ne gère pas les dates tronquées
      prisma.$queryRaw`
        SELECT 
          TO_CHAR("dateCandidature", 'YYYY-MM') AS mois,
          COUNT(*)::int AS total
        FROM "Candidature"
        WHERE "dateCandidature" >= NOW() - INTERVAL '12 months'
        GROUP BY mois
        ORDER BY mois ASC
      `,

      // Répartition des offres par type de contrat
      prisma.offre.groupBy({
        by: ['typeContrat'],
        _count: { typeContrat: true }
      }),

      // Répartition des offres par catégorie
      prisma.offre.groupBy({
        by: ['categorie'],
        _count: { categorie: true }
      })
    ]);

    // Formatage des résultats groupBy en objets simples { CLE: valeur }
    const formatGroupBy = (data, key) => {
      return data.reduce((acc, item) => {
        const label = item[key] || 'Non spécifié';
        acc[label] = item._count[key];
        return acc;
      }, {});
    };

    // Taux de conversion : candidatures acceptées / total
    const accepteesCount = candidaturesParStatut.find(c => c.statut === 'ACCEPTEE')?._count.statut || 0;
    const tauxAcceptation = totalCandidatures > 0
      ? ((accepteesCount / totalCandidatures) * 100).toFixed(2)
      : "0.00";

    // Moyenne de candidatures par offre
    const moyenneCandidaturesParOffre = totalOffres > 0
      ? (totalCandidatures / totalOffres).toFixed(2)
      : "0.00";

    return {
      resume: {
        totalOffres,
        totalCandidats,
        totalCandidatures,
        tauxAcceptation: `${tauxAcceptation}%`,
        moyenneCandidaturesParOffre: Number(moyenneCandidaturesParOffre)
      },
      offres: {
        parStatut: formatGroupBy(offresParStatut, 'statut'),
        parTypeContrat: formatGroupBy(offresParType, 'typeContrat'),
        parCategorie: formatGroupBy(offresParCategorie, 'categorie'),
        expirantBientot: offresExpirantBientot
      },
      candidatures: {
        parStatut: formatGroupBy(candidaturesParStatut, 'statut'),
        recentes: candidaturesRecentes,
        parMois: candidaturesParMois.map(row => ({
          mois: row.mois,
          total: row.total
        }))
      },
      topOffres: topOffres.map(o => ({
        id: o.id,
        titre: o.titre,
        nombreCandidatures: o._count.candidatures
      }))
    };
  }

  // Stats détaillées pour une offre spécifique
  async getOffreStats(offreId) {
    const offre = await prisma.offre.findUnique({
      where: { id: Number(offreId) },
      include: {
        candidatures: {
          include: { candidat: true }
        }
      }
    });

    if (!offre) {
      throw { status: 404, message: "Offre non trouvée" };
    }

    const statutCounts = offre.candidatures.reduce((acc, c) => {
      acc[c.statut] = (acc[c.statut] || 0) + 1;
      return acc;
    }, {});

    return {
      offre: {
        id: offre.id,
        titre: offre.titre,
        statut: offre.statut,
        dateExpiration: offre.dateExpiration
      },
      totalCandidatures: offre.candidatures.length,
      parStatut: statutCounts,
      candidats: offre.candidatures.map(c => ({
        candidatureId: c.id,
        nom: c.candidat.nom,
        prenom: c.candidat.prenom,
        email: c.candidat.email,
        statut: c.statut,
        dateCandidature: c.dateCandidature
      }))
    };
  }
}

module.exports = new StatsService();