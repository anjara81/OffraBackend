const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const randomPastDate = (maxDaysAgo) =>
  new Date(Date.now() - Math.floor(Math.random() * maxDaysAgo) * 24 * 60 * 60 * 1000);

// Contenu PDF minimal mais valide (un PDF vide avec juste une page blanche)
const MINIMAL_PDF_CONTENT = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 100 >>
stream
BT
/F1 18 Tf
100 700 Td
(CV - Document de demonstration) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
0
%%EOF`;

// Crée un fichier PDF factice sur le disque pour une candidature de démo
const createDummyPdf = (uploadDir, filename) => {
  const dir = path.join(__dirname, '..', 'src', 'uploads', uploadDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, MINIMAL_PDF_CONTENT);
};

async function main() {
  console.log('🌱 Début du seed...\n');

  // ---------------------------
  // 1. ADMIN
  // ---------------------------
  const adminEmail = 'rakotoarinirinanjara@gmail.com';
  const adminPassword = '040125';

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: {
        nom: 'Admin OFFRA',
        email: adminEmail,
        password: hashedPassword
      }
    });
    console.log('✅ Admin créé :', adminEmail, '| mot de passe :', adminPassword);
  } else {
    console.log('⚠️  Admin déjà existant, non recréé');
  }

  // ---------------------------
  // 2. OFFRES (variées pour bien remplir les filtres)
  // ---------------------------
  const offresData = [
    // --- CDI ---
    {
      titre: 'Développeur Full Stack JavaScript',
      description: "Nous recherchons un développeur full stack passionné pour rejoindre notre équipe technique. Vous travaillerez sur des projets variés utilisant Node.js, React et PostgreSQL, de la conception à la mise en production.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Informatique',
      salaire: '1 500 000 Ar',
      dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Designer UI/UX',
      description: "Rejoignez notre équipe produit en tant que designer UI/UX. Vous serez responsable de la conception d'interfaces intuitives pour nos applications web et mobiles, en collaboration avec les développeurs.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Design',
      salaire: '1 200 000 Ar',
      dateExpiration: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Comptable Junior',
      description: "Nous recrutons un(e) comptable junior pour assister notre équipe finance dans la gestion quotidienne des comptes, la facturation et le suivi budgétaire.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Finance',
      salaire: '800 000 Ar',
      dateExpiration: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Responsable Ressources Humaines',
      description: "Poste de responsable RH pour piloter le recrutement, la gestion administrative du personnel et le développement des talents au sein de l'entreprise.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Ressources Humaines',
      salaire: '1 400 000 Ar',
      dateExpiration: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Ingénieur DevOps',
      description: "Nous cherchons un ingénieur DevOps pour automatiser nos pipelines CI/CD, gérer notre infrastructure cloud et améliorer la fiabilité de nos systèmes en production.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Informatique',
      salaire: '1 800 000 Ar',
      dateExpiration: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },

    // --- CDD ---
    {
      titre: 'Chargé(e) de Marketing Digital',
      description: "Nous cherchons un(e) chargé(e) de marketing digital pour piloter nos campagnes sur les réseaux sociaux, améliorer notre référencement SEO et analyser les performances marketing.",
      lieu: 'Antananarivo',
      typeContrat: 'CDD',
      categorie: 'Marketing',
      salaire: '900 000 Ar',
      dateExpiration: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Assistant(e) Administratif(ve)',
      description: "Poste en CDD de 6 mois pour assister l'équipe de direction dans la gestion administrative quotidienne, l'organisation des réunions et le suivi des dossiers.",
      lieu: 'Antananarivo',
      typeContrat: 'CDD',
      categorie: 'Administration',
      salaire: '600 000 Ar',
      dateExpiration: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Chargé(e) de Communication',
      description: "Mission de 8 mois pour renforcer notre stratégie de communication interne et externe, gérer nos réseaux sociaux et organiser nos événements d'entreprise.",
      lieu: 'Antananarivo',
      typeContrat: 'CDD',
      categorie: 'Marketing',
      salaire: '850 000 Ar',
      dateExpiration: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },

    // --- STAGE ---
    {
      titre: 'Stagiaire Développement Web',
      description: "Stage de 6 mois pour un(e) étudiant(e) en informatique souhaitant se former au développement web moderne. Encadrement par des développeurs seniors sur React et Node.js.",
      lieu: 'Antananarivo',
      typeContrat: 'STAGE',
      categorie: 'Informatique',
      salaire: '300 000 Ar',
      dateExpiration: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Stagiaire Design Graphique',
      description: "Stage de 4 mois pour un(e) étudiant(e) en design souhaitant acquérir une expérience concrète sur des projets d'identité visuelle et de supports marketing.",
      lieu: 'Antananarivo',
      typeContrat: 'STAGE',
      categorie: 'Design',
      salaire: '250 000 Ar',
      dateExpiration: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Stagiaire Ressources Humaines',
      description: "Stage de 3 mois au sein du service RH pour accompagner le processus de recrutement, la gestion des dossiers du personnel et l'organisation d'événements internes.",
      lieu: 'Antananarivo',
      typeContrat: 'STAGE',
      categorie: 'Ressources Humaines',
      salaire: '200 000 Ar',
      dateExpiration: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },

    // --- FREELANCE ---
    {
      titre: 'Développeur Mobile Flutter',
      description: "Mission freelance pour concevoir et maintenir nos applications Flutter multiplateformes. Expérience avec les API REST, la gestion d'état (Riverpod/Bloc) souhaitée.",
      lieu: 'Antananarivo',
      typeContrat: 'FREELANCE',
      categorie: 'Informatique',
      salaire: 'À négocier',
      dateExpiration: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Rédacteur(trice) Web SEO',
      description: "Mission freelance pour la rédaction d'articles optimisés SEO sur des thématiques variées liées à notre secteur d'activité, à raison de 4 articles par semaine.",
      lieu: 'Remote',
      typeContrat: 'FREELANCE',
      categorie: 'Marketing',
      salaire: 'Rémunération au projet',
      dateExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Consultant(e) en Cybersécurité',
      description: "Mission freelance pour auditer notre infrastructure informatique, identifier les vulnérabilités et proposer des recommandations de sécurisation.",
      lieu: 'Antananarivo',
      typeContrat: 'FREELANCE',
      categorie: 'Informatique',
      salaire: 'À négocier',
      dateExpiration: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },

    // --- ALTERNANCE ---
    {
      titre: 'Alternant Support Technique',
      description: "Poste en alternance pour assister notre équipe support dans la résolution des tickets clients, la documentation technique et l'amélioration continue de nos outils internes.",
      lieu: 'Antananarivo',
      typeContrat: 'ALTERNANCE',
      categorie: 'Informatique',
      salaire: '400 000 Ar',
      dateExpiration: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },
    {
      titre: 'Alternant Comptabilité',
      description: "Poste en alternance au sein du service comptable pour préparer un diplôme en gestion tout en participant à la tenue des comptes et au suivi de la facturation.",
      lieu: 'Antananarivo',
      typeContrat: 'ALTERNANCE',
      categorie: 'Finance',
      salaire: '380 000 Ar',
      dateExpiration: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      statut: 'ACTIVE'
    },

    // --- Offres non actives (pour tester les autres statuts côté admin) ---
    {
      titre: 'Ancien poste Comptable Senior',
      description: "Ce poste a été pourvu et n'est plus disponible. Conservé à titre d'archive pour l'historique des recrutements.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Finance',
      salaire: '1 100 000 Ar',
      dateExpiration: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      statut: 'FERMEE'
    },
    {
      titre: 'Data Analyst (brouillon)',
      description: "Offre en cours de rédaction, pas encore publiée. Le poste consistera à analyser les données de performance de l'entreprise et produire des rapports décisionnels.",
      lieu: 'Antananarivo',
      typeContrat: 'CDI',
      categorie: 'Informatique',
      salaire: '1 300 000 Ar',
      dateExpiration: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      statut: 'BROUILLON'
    }
  ];

  const offresCreees = [];
  for (const data of offresData) {
    const offre = await prisma.offre.create({
      data: {
        ...data,
        createdAt: randomPastDate(60)
      }
    });
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
    { nom: 'Rasolofo', prenom: 'Hery', email: 'hery.rasolofo@example.com', telephone: '0338877665' },
    { nom: 'Rakotondrabe', prenom: 'Nathalie', email: 'nathalie.rakotondrabe@example.com', telephone: '0342233445' },
    { nom: 'Ramanantsoa', prenom: 'Tojo', email: 'tojo.ramanantsoa@example.com', telephone: '0339988776' },
    { nom: 'Rasoanaivo', prenom: 'Fara', email: 'fara.rasoanaivo@example.com', telephone: '0331122334' },
    { nom: 'Andriamahefa', prenom: 'Mamy', email: 'mamy.andriamahefa@example.com', telephone: '0345566778' }
  ];

  const candidatsCreees = [];
  for (const data of candidatsData) {
    const candidat = await prisma.candidat.upsert({
      where: { email: data.email },
      update: {},
      create: { ...data, createdAt: randomPastDate(45) }
    });
    candidatsCreees.push(candidat);
  }
  console.log(`✅ ${candidatsCreees.length} candidats créés`);

  // ---------------------------
  // 4. CANDIDATURES
  // ---------------------------
  const statuts = ['EN_ATTENTE', 'ENTRETIEN', 'ACCEPTEE', 'REFUSEE'];
  let candidaturesCount = 0;

  const offresActives = offresCreees.filter(o => o.statut === 'ACTIVE');

  for (const candidat of candidatsCreees) {
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
        const cvFilename = `cv_exemple_${candidat.id}.pdf`;

        createDummyPdf('cv', cvFilename);

        await prisma.candidature.create({
          data: {
            offreId: offre.id,
            candidatId: candidat.id,
            cvPath: `/uploads/cv/${cvFilename}`,
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