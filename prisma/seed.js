const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...\n');

  // ---------------------------
  // 1. ADMIN
  // ---------------------------
  await prisma.admin.deleteMany();
  console.log("BD netoye");
  
  const adminEmail = 'anjara@gmail.com';
  const adminPassword = '1234';

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: {
        nom: 'Anjara Tiana',
        email: adminEmail,
        password: hashedPassword
      }
    });
    console.log('✅ Admin créé :', adminEmail, '| mot de passe :', adminPassword);
  } else {
    console.log('⚠️  Admin déjà existant, non recréé');
  }

  // ---------------------------
  // 2. OFFRES
  // ---------------------------
  const offresData = [
    {
      titre: 'Développeur Full Stack JavaScript',
      description: "Nous recherchons un développeur full stack passionné pour rejoindre notre équipe technique. Vous travaillerez sur des projets variés utilisant Node.js, React et PostgreSQL. Vous participerez à toutes les étapes du cycle de développement, de la conception à la mise en production.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Informatique',
      salaire: '1 500 000 Ar',
      dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Designer UI/UX',
      description: "Rejoignez notre équipe produit en tant que designer UI/UX. Vous serez responsable de la conception d'interfaces intuitives et esthétiques pour nos applications web et mobiles, en étroite collaboration avec les développeurs et les product managers.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Design',
      salaire: '1 200 000 Ar',
      dateExpiration: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Stagiaire Développement Web',
      description: "Stage de 6 mois pour un(e) étudiant(e) en informatique souhaitant se former au développement web moderne. Encadrement par des développeurs seniors, montée en compétences sur React, Node.js et les bonnes pratiques de développement.",
      lieu: 'Antananarivo',
      typeContrat: 'STAGE',
      categorie: 'Informatique',
      salaire: '300 000 Ar',
      dateExpiration: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Chargé(e) de Marketing Digital',
      description: "Nous cherchons un(e) chargé(e) de marketing digital pour piloter nos campagnes sur les réseaux sociaux, améliorer notre référencement SEO et analyser les performances de nos actions marketing.",
      lieu: 'Antananarivo',
      typeContrat: 'CDD',
      categorie: 'Marketing',
      salaire: '900 000 Ar',
      dateExpiration: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Développeur Mobile Flutter',
      description: "Poste de développeur mobile pour concevoir et maintenir nos applications Flutter multiplateformes. Expérience avec les API REST, la gestion d'état (Riverpod/Bloc) et les bonnes pratiques mobiles souhaitée.",
      lieu: 'Antananarivo',
      typeContrat: 'FREELANCE',
      categorie: 'Informatique',
      salaire: 'À négocier',
      dateExpiration: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Comptable Junior',
      description: "Nous recrutons un(e) comptable junior pour assister notre équipe finance dans la gestion quotidienne des comptes, la facturation et le suivi budgétaire.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Finance',
      salaire: '800 000 Ar',
      dateExpiration: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // déjà expirée
      statut: 'FERMEE'
    },
    {
      titre: 'Alternant Support Technique',
      description: "Poste en alternance pour assister notre équipe support dans la résolution des tickets clients, la documentation technique et l'amélioration continue de nos outils internes.",
      lieu: 'Antananarivo',
      typeContrat: 'ALTERNANCE',
      categorie: 'Informatique',
      salaire: '400 000 Ar',
      dateExpiration: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      statut: 'BROUILLON'
    }
  ];

  const offresCreees = [];
  for (const data of offresData) {
    const offre = await prisma.offre.create({ data });
    offresCreees.push(offre);
  }
  console.log(`✅ ${offresCreees.length} offres créées`);

  // ---------------------------
  // 3. CANDIDATS
  // ---------------------------
  const candidatsData = [
    { nom: 'Rakoto', prenom: 'Jean', email: 'jean.rakoto@example.com', telephone: '0341234567' },
    { nom: 'Rasoa', prenom: 'Marie', email: 'marie.rasoa@example.com', telephone: '0331234567' },
    { nom: 'Andria', prenom: 'Paul', email: 'paul.andria@example.com', telephone: '0321234567' },
    { nom: 'Razafy', prenom: 'Lucie', email: 'lucie.razafy@example.com', telephone: '0341122334' },
    { nom: 'Rabe', prenom: 'Nicolas', email: 'nicolas.rabe@example.com', telephone: '0335566778' },
    { nom: 'Ravao', prenom: 'Sophie', email: 'sophie.ravao@example.com', telephone: '0329988776' },
    { nom: 'Randria', prenom: 'Eric', email: 'eric.randria@example.com', telephone: '0344455667' },
    { nom: 'Rasolofo', prenom: 'Hery', email: 'hery.rasolofo@example.com', telephone: '0338877665' }
  ];

  const candidatsCreees = [];
  for (const data of candidatsData) {
    const candidat = await prisma.candidat.upsert({
      where: { email: data.email },
      update: {},
      create: data
    });
    candidatsCreees.push(candidat);
  }
  console.log(`✅ ${candidatsCreees.length} candidats créés`);

  // ---------------------------
  // 4. CANDIDATURES
  // ---------------------------
  const statuts = ['EN_ATTENTE', 'ENTRETIEN', 'ACCEPTEE', 'REFUSEE'];
  let candidaturesCount = 0;

  // Génère des candidatures croisées entre candidats et offres actives, sans doublons
  const offresActives = offresCreees.filter(o => o.statut !== 'BROUILLON');

  for (let i = 0; i < candidatsCreees.length; i++) {
    const candidat = candidatsCreees[i];

    // Chaque candidat postule à 1 à 3 offres différentes
    const nbCandidatures = Math.floor(Math.random() * 3) + 1;
    const offresShuffled = [...offresActives].sort(() => 0.5 - Math.random());
    const offresChoisies = offresShuffled.slice(0, nbCandidatures);

    for (const offre of offresChoisies) {
      const existe = await prisma.candidature.findUnique({
        where: {
          offreId_candidatId: {
            offreId: offre.id,
            candidatId: candidat.id
          }
        }
      });

      if (!existe) {
        const statutAleatoire = statuts[Math.floor(Math.random() * statuts.length)];

        await prisma.candidature.create({
          data: {
            offreId: offre.id,
            candidatId: candidat.id,
            cvPath: `/uploads/cv/cv_exemple_${candidat.id}.pdf`, // fichier fictif, juste pour les tests d'affichage
            lettreMotivation: `Bonjour, je suis très intéressé(e) par le poste de ${offre.titre} et je pense correspondre au profil recherché.`,
            statut: statutAleatoire,
            dateCandidature: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
          }
        });
        candidaturesCount++;
      }
    }
  }

  console.log(`✅ ${candidaturesCount} candidatures créées`);

  console.log('\n🌱 Seed terminé avec succès !');
}

main()
  .catch((error) => {
    console.error('❌ Erreur lors du seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });